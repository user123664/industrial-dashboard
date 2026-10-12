let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioCtx
}

export function playAlertSound(level: 'warning' | 'error'): void {
  try {
    const ctx = getCtx()
    if (ctx.state === 'suspended') ctx.resume()
    const now = ctx.currentTime

    if (level === 'error') {
      // 连续三声急促高音
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'square'
        osc.frequency.value = 880
        gain.gain.setValueAtTime(0, now + i * 0.3)
        gain.gain.linearRampToValueAtTime(0.3, now + i * 0.3 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.3 + 0.22)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.3)
        osc.stop(now + i * 0.3 + 0.25)
      }
    } else {
      // 两声较低柔和提示音
      for (let i = 0; i < 2; i++) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = 440
        gain.gain.setValueAtTime(0, now + i * 0.4)
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.4 + 0.03)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.4 + 0.32)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.4)
        osc.stop(now + i * 0.4 + 0.35)
      }
    }
  } catch (e) {
    console.warn('Audio playback failed:', e)
  }
}
