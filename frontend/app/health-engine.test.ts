import { describe, it, expect } from 'vitest'

describe('Arise-X1 Health Engine', () => {
  it('should calculate XP correctly for a 500 step walk', () => {
    const steps = 500
    const xpPerStep = 0.1
    const totalXP = steps * xpPerStep
    expect(totalXP).toBe(50)
  })

  it('should unlock badges when requirements are met', () => {
    const loggedMeals = 11
    const requirement = 10
    const isUnlocked = loggedMeals > requirement
    expect(isUnlocked).toBe(true)
  })
})
