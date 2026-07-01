import { useCallback, useRef } from 'react'
import * as Tone from 'tone'

interface SoundCollection {
  start?: Tone.Player
  correct?: Tone.Synth
  incorrect?: Tone.Synth
  lifeline?: Tone.Synth
  timerTick?: Tone.MembraneSynth
  finalAnswer?: Tone.MetalSynth
  winMillion?: Tone.Player
}

const TIMER_NOTE = 'C6'
const CORRECT_NOTE = 'G5'
const INCORRECT_NOTE = 'C3'
const LIFELINE_NOTE = 'E4'
const FINAL_NOTE = 'A3'

export function useSound() {
  const sounds = useRef<SoundCollection>({})
  const initialized = useRef(false)

  const initialize = useCallback(async () => {
    if (initialized.current) return
    try {
      await Tone.start()
      sounds.current = {
        correct: new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.3 }
        }).toDestination(),
        incorrect: new Tone.Synth({
          oscillator: { type: 'square' },
          envelope: { attack: 0.01, decay: 0.4, sustain: 0, release: 0.1 }
        }).toDestination(),
        lifeline: new Tone.Synth({
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.05, decay: 0.3, sustain: 0.1, release: 0.5 }
        }).toDestination(),
        timerTick: new Tone.MembraneSynth({
          pitchDecay: 0.008,
          octaves: 2,
          envelope: { attack: 0.001, decay: 0.1, sustain: 0 }
        }).toDestination(),
        finalAnswer: new Tone.MetalSynth({
          envelope: { attack: 0.01, decay: 0.4, release: 0.2 },
          harmonicity: 3.1,
          modulationIndex: 16,
          resonance: 4000,
          octaves: 1.5
        }).toDestination(),
      }
      const vol = -10
      sounds.current.correct!.volume.value = vol
      sounds.current.incorrect!.volume.value = vol
      sounds.current.lifeline!.volume.value = -8
      sounds.current.timerTick!.volume.value = -15
      sounds.current.finalAnswer!.volume.value = -12
      initialized.current = true
    } catch {
      console.warn('Audio initialization failed')
    }
  }, [])

  const play = useCallback((soundName: string) => {
    const s = sounds.current[soundName as keyof SoundCollection]
    if (!s) return
    try {
      if (s instanceof Tone.Synth || s instanceof Tone.MembraneSynth || s instanceof Tone.MetalSynth) {
        let note = 'C4'
        if (soundName === 'correct') note = CORRECT_NOTE
        else if (soundName === 'incorrect') note = INCORRECT_NOTE
        else if (soundName === 'lifeline') note = LIFELINE_NOTE
        else if (soundName === 'timerTick') note = TIMER_NOTE
        else if (soundName === 'finalAnswer') note = FINAL_NOTE
        s.triggerAttackRelease(note, '8n', Tone.now())
      } else if (s instanceof Tone.Player) {
        s.start(Tone.now())
      }
    } catch {
      // ignore audio errors
    }
  }, [])

  return { initialize, play }
}
