/**
 * XP / level math used across the dashboard.
 * Curve: each level requires ~20% more XP than the previous one.
 */

export function xpForLevel(level: number): number {
  if (level <= 1) return 0
  return Math.floor(50 * Math.pow(1.2, level - 1))
}

export function calculateLevel(totalXP: number): number {
  if (totalXP < 100) return 1
  return Math.min(50, Math.floor(Math.log(totalXP / 50) / Math.log(1.2)) + 1)
}

export function xpProgressInLevel(totalXP: number): {
  percent: number
  current: number
  needed: number
} {
  const level = calculateLevel(totalXP)
  const currentLevelXP = xpForLevel(level)
  const nextLevelXP = xpForLevel(level + 1)
  const span = Math.max(1, nextLevelXP - currentLevelXP)
  const current = Math.max(0, totalXP - currentLevelXP)
  return {
    percent: Math.min(100, Math.round((current / span) * 100)),
    current,
    needed: span,
  }
}
