// Retro arcade sound effects using Web Audio API
// All sounds are synthesized programmatically for authentic 8-bit feel

let audioContext: AudioContext | null = null
let isMuted = false
let bgmGainNode: GainNode | null = null
let bgmOscillators: OscillatorNode[] = []

// Check if AudioContext is available (not available in test environments like jsdom)
function isAudioSupported(): boolean {
  return typeof AudioContext !== 'undefined' || typeof (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext !== 'undefined'
}

function getAudioContext(): AudioContext | null {
  if (!isAudioSupported()) {
    return null
  }
  if (!audioContext) {
    const AudioContextClass = AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioContext = new AudioContextClass()
  }
  return audioContext
}

export function setMuted(muted: boolean): void {
  isMuted = muted
  const ctx = getAudioContext()
  if (bgmGainNode && ctx) {
    bgmGainNode.gain.setValueAtTime(muted ? 0 : 0.08, ctx.currentTime)
  }
}

export function getMuted(): boolean {
  return isMuted
}

// Button click beep - short 8-bit style
export function playButtonSound(): void {
  if (isMuted) return

  const ctx = getAudioContext()
  if (!ctx) return

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.type = 'square'
  oscillator.frequency.setValueAtTime(800, ctx.currentTime)
  oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.05)

  gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.1)
}

// Operator button sound - slightly different tone
export function playOperatorSound(): void {
  if (isMuted) return

  const ctx = getAudioContext()
  if (!ctx) return

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.type = 'square'
  oscillator.frequency.setValueAtTime(1000, ctx.currentTime)
  oscillator.frequency.setValueAtTime(1200, ctx.currentTime + 0.05)

  gainNode.gain.setValueAtTime(0.12, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.08)
}

// Equals/Calculate sound - triumphant arpeggio
export function playEqualsSound(): void {
  if (isMuted) return

  const ctx = getAudioContext()
  if (!ctx) return

  const notes = [523, 659, 784, 1047] // C5, E5, G5, C6

  notes.forEach((freq, index) => {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime)

    const startTime = ctx.currentTime + index * 0.06
    gainNode.gain.setValueAtTime(0, startTime)
    gainNode.gain.linearRampToValueAtTime(0.12, startTime + 0.02)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15)

    oscillator.start(startTime)
    oscillator.stop(startTime + 0.15)
  })
}

// Clear sound - descending tone
export function playClearSound(): void {
  if (isMuted) return

  const ctx = getAudioContext()
  if (!ctx) return

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.type = 'sawtooth'
  oscillator.frequency.setValueAtTime(600, ctx.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2)

  gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.2)
}

// Background music - simple retro arcade loop
export function startBackgroundMusic(): void {
  if (bgmOscillators.length > 0) return // Already playing

  const ctx = getAudioContext()
  if (!ctx) return

  // Store a reference to ctx that TypeScript knows is non-null
  const audioCtx: AudioContext = ctx

  bgmGainNode = audioCtx.createGain()
  bgmGainNode.connect(audioCtx.destination)
  bgmGainNode.gain.setValueAtTime(isMuted ? 0 : 0.08, audioCtx.currentTime)

  // Simple bass line pattern (C, G, A, E pattern)
  const bassNotes = [65.41, 49.00, 55.00, 41.20] // C2, G1, A1, E1
  const noteLength = 0.5 // seconds per note

  function playBassNote(noteIndex: number) {
    if (bgmOscillators.length === 0 && noteIndex > 0) return // Stopped

    const osc = audioCtx.createOscillator()
    const noteGain = audioCtx.createGain()

    osc.connect(noteGain)
    noteGain.connect(bgmGainNode!)

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(bassNotes[noteIndex % bassNotes.length], audioCtx.currentTime)

    noteGain.gain.setValueAtTime(1, audioCtx.currentTime)
    noteGain.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + noteLength * 0.8)

    osc.start(audioCtx.currentTime)
    osc.stop(audioCtx.currentTime + noteLength)

    if (bgmOscillators.length > 0) {
      setTimeout(() => playBassNote((noteIndex + 1) % bassNotes.length), noteLength * 1000)
    }
  }

  // Add a simple arpeggio pattern on top
  const arpeggioNotes = [261.63, 329.63, 392.00, 329.63] // C4, E4, G4, E4

  function playArpeggio(noteIndex: number) {
    if (bgmOscillators.length === 0 && noteIndex > 0) return // Stopped

    const osc = audioCtx.createOscillator()
    const noteGain = audioCtx.createGain()

    osc.connect(noteGain)
    noteGain.connect(bgmGainNode!)

    osc.type = 'square'
    osc.frequency.setValueAtTime(arpeggioNotes[noteIndex % arpeggioNotes.length], audioCtx.currentTime)

    const shortNote = noteLength / 4
    noteGain.gain.setValueAtTime(0.3, audioCtx.currentTime)
    noteGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + shortNote * 0.9)

    osc.start(audioCtx.currentTime)
    osc.stop(audioCtx.currentTime + shortNote)

    if (bgmOscillators.length > 0) {
      setTimeout(() => playArpeggio((noteIndex + 1) % arpeggioNotes.length), shortNote * 1000)
    }
  }

  // Mark as playing with a dummy oscillator reference
  const dummyOsc = audioCtx.createOscillator()
  bgmOscillators.push(dummyOsc)

  playBassNote(0)
  playArpeggio(0)
}

export function stopBackgroundMusic(): void {
  bgmOscillators.forEach(osc => {
    try {
      osc.stop()
    } catch {
      // Already stopped
    }
  })
  bgmOscillators = []

  if (bgmGainNode) {
    bgmGainNode.disconnect()
    bgmGainNode = null
  }
}

export function isBackgroundMusicPlaying(): boolean {
  return bgmOscillators.length > 0
}
