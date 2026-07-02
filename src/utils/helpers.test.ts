import { describe, it, expect } from 'vitest'
import { optionLabel, shuffleArray } from './helpers'

describe('optionLabel', () => {
  it('returns "A" for index 0', () => {
    expect(optionLabel(0)).toBe('A')
  })

  it('returns "B" for index 1', () => {
    expect(optionLabel(1)).toBe('B')
  })

  it('returns "C" for index 2', () => {
    expect(optionLabel(2)).toBe('C')
  })

  it('returns "D" for index 3', () => {
    expect(optionLabel(3)).toBe('D')
  })
})

describe('shuffleArray', () => {
  it('returns an array with the same length', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffleArray(input)
    expect(result).toHaveLength(5)
  })

  it('does not mutate the original array', () => {
    const input = [1, 2, 3, 4, 5]
    const copy = [...input]
    shuffleArray(input)
    expect(input).toEqual(copy)
  })

  it('contains the same elements after shuffling', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffleArray(input)
    expect(result.sort()).toEqual([1, 2, 3, 4, 5])
  })
})
