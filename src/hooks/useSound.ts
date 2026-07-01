import { useCallback, useRef } from 'react'
import * as Tone from 'tone'

export type SoundName = 'correct' | 'incorrect' | 'timerTick' | 'finalAnswer'

interface SoundCollection {
  correct?: Tone.Synth
  incorrect?: Tone.Synth
  timerTick?: Tone.MembraneSynth
  finalAnswer?: Tone.MetalSynth
}

const NOTES: Record<SoundName, string> = {
  correct: 'G5',
  incorrect: 'C3',
  timerTick: 'C6',
  finalAnswer: 'A3',
}

export function useSound() {
  const sounds = useRef<SoundCollection>({})
  const initialized = useRef(false)

  const initialize = useCallback(async () => {
    if (initialized.current) return
    try {
      await Tone.start()
      sounds.current = {
        correct: new Tone.Synth({
          volume: -10,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.3 },
        }).toDestination(),
        incorrect: new Tone.Synth({
          volume: -10,
          oscillator: { type: 'square' },
          envelope: { attack: 0.01, decay: 0.4, sustain: 0, release: 0.1 },
        }).toDestination(),
        timerTick: new Tone.MembraneSynth({
          volume: -15,
          pitchDecay: 0.008,
          octaves: 2,
          envelope: { attack: 0.001, decay: 0.1, sustain: 0 },
        }).toDestination(),
        finalAnswer: new Tone.MetalSynth({
          volume: -12,
          envelope: { attack: 0.01, decay: 0.4, release: 0.2 },
          harmonicity: 3.1,
          modulationIndex: 16,
          resonance: 4000,
          octaves: 1.5,
        }).toDestination(),
      }
      initialized.current = true
    } catch {
      console.warn('Audio initialization failed')
    }
  }, [])

  const play = useCallback((name: SoundName) => {
    const synth = sounds.current[name]
    if (!synth) return
    try {
      synth.triggerAttackRelease(NOTES[name], '8n', Tone.now())
    } catch {
      // some browsers block audio playback; safe to ignore
    }
  }, [])

  return { initialize, play }
}
