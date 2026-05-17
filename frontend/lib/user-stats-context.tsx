"use client"

/**
 * UserStatsContext — single source of truth for the current player's
 * gamified state across the entire app.
 *
 * Submitting a quest, claiming a walk pickup, or logging a meal all
 * funnel through this context, so the leaderboard reflects the new XP
 * and recomputes the user's rank in real time.
 *
 * In production this hydrates from Firestore; for the demo we seed it
 * from the same MOCK_USER object the rest of the codebase uses.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"
import type { LeaderboardEntry } from "./types"
import { currentUser as mockUser, leaderboard as mockLeaderboard } from "./mock-data"
import { calculateLevel } from "./xp"

export interface RankInfo {
  rank: number
  previousRank: number
  delta: number
  total: number
  ahead: LeaderboardEntry | null
}

export interface UserStatsState {
  // Live numbers
  xp: number
  coins: number
  level: number
  streak: number
  steps: number
  mealsLogged: number
  hydrationGlasses: number
  // Completed-by-id sets (drives "claimed" UI everywhere)
  completedQuestIds: Set<string>
  claimedSpotIds: Set<string>
  loggedMealIds: Set<string>
  // Today's session totals (resets on reload)
  earnedToday: { xp: number; coins: number }
  // Leaderboard (live, recomputed from xp)
  leaderboard: LeaderboardEntry[]
  rank: RankInfo
  // Last-action toast payload (consumed by toaster)
  lastReward: {
    id: number
    xp: number
    coins: number
    label: string
    rankAfter: number
    rankDelta: number
  } | null
}

export interface UserStatsActions {
  /** Award XP / coins for an action and update rank. */
  awardXP: (xp: number, opts?: { coins?: number; label?: string }) => void
  /** Mark a quest as complete (idempotent) and award its XP. */
  completeQuest: (id: string, xp: number, coins: number, title?: string) => void
  /** Mark a walk-spot as claimed and award XP + coins + steps. */
  claimSpot: (
    id: string,
    xp: number,
    coins: number,
    stepsAdded: number,
    title?: string,
  ) => void
  /** Log a meal — bumps mealsLogged and awards XP. */
  logMeal: (id: string, xp: number, title?: string) => void
  /** Add a glass of water (capped at hydrationTarget). */
  addHydration: () => void
  /** Manually bump steps (used by Explore "walk here" animation). */
  addSteps: (n: number) => void
  /** Dismiss the last reward toast. */
  clearReward: () => void
}

type Ctx = UserStatsState & UserStatsActions

const UserStatsContext = createContext<Ctx | null>(null)

/* -------------------------------------------------------------- */
/*  Helpers                                                       */
/* -------------------------------------------------------------- */

function rebuildLeaderboard(
  base: LeaderboardEntry[],
  liveXP: number,
  liveLevel: number,
  liveStreak: number,
): { board: LeaderboardEntry[]; rank: number } {
  const merged = base.map((e) =>
    e.isYou ? { ...e, xp: liveXP, level: liveLevel, streak: liveStreak } : e,
  )
  const sorted = [...merged]
    .sort((a, b) => b.xp - a.xp)
    .map((e, i) => ({ ...e, rank: i + 1 }))
  const rank = sorted.find((e) => e.isYou)?.rank ?? sorted.length
  return { board: sorted, rank }
}

/* -------------------------------------------------------------- */
/*  Provider                                                      */
/* -------------------------------------------------------------- */

export function UserStatsProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState(mockUser.xp)
  const [coins, setCoins] = useState(mockUser.coins)
  const [streak] = useState(mockUser.streak)
  const [steps, setSteps] = useState(mockUser.steps)
  const [mealsLogged, setMealsLogged] = useState(mockUser.mealsLogged)
  const [hydrationGlasses, setHydrationGlasses] = useState(mockUser.hydrationGlasses)

  const [completedQuestIds, setCompletedQuestIds] = useState<Set<string>>(new Set())
  const [claimedSpotIds, setClaimedSpotIds] = useState<Set<string>>(
    new Set(mockUser ? [] : []),
  )
  const [loggedMealIds, setLoggedMealIds] = useState<Set<string>>(new Set())

  const [earnedToday, setEarnedToday] = useState({ xp: 0, coins: 0 })
  const [lastReward, setLastReward] = useState<UserStatsState["lastReward"]>(null)
  const previousRankRef = useRef<number>(
    mockLeaderboard.find((e) => e.isYou)?.rank ?? mockLeaderboard.length,
  )
  const rewardIdRef = useRef(0)

  /* ----- Derived ----- */
  const level = useMemo(() => calculateLevel(xp), [xp])

  const { board, rank } = useMemo(
    () => rebuildLeaderboard(mockLeaderboard, xp, level, streak),
    [xp, level, streak],
  )

  const rankInfo: RankInfo = useMemo(() => {
    const idx = board.findIndex((e) => e.rank === rank)
    const ahead = idx > 0 ? board[idx - 1] : null
    const previousRank = previousRankRef.current
    return {
      rank,
      previousRank,
      delta: previousRank - rank, // positive = improved
      total: board.length,
      ahead,
    }
  }, [board, rank])

  /* ----- Actions ----- */
  const fireReward = useCallback(
    (xpAdd: number, coinsAdd: number, label: string, rankAfter: number) => {
      rewardIdRef.current += 1
      setLastReward({
        id: rewardIdRef.current,
        xp: xpAdd,
        coins: coinsAdd,
        label,
        rankAfter,
        rankDelta: previousRankRef.current - rankAfter,
      })
      previousRankRef.current = rankAfter
    },
    [],
  )

  const awardXP = useCallback<UserStatsActions["awardXP"]>(
    (xpAdd, opts) => {
      const coinsAdd = opts?.coins ?? 0
      const nextXp = xp + xpAdd
      const nextLevel = calculateLevel(nextXp)
      setXp(nextXp)
      if (coinsAdd) setCoins((c) => c + coinsAdd)
      setEarnedToday((t) => ({ xp: t.xp + xpAdd, coins: t.coins + coinsAdd }))
      const { rank: nextRank } = rebuildLeaderboard(
        mockLeaderboard,
        nextXp,
        nextLevel,
        streak,
      )
      fireReward(xpAdd, coinsAdd, opts?.label ?? "Reward earned", nextRank)
    },
    [xp, streak, fireReward],
  )

  const completeQuest = useCallback<UserStatsActions["completeQuest"]>(
    (id, xpAdd, coinsAdd, title) => {
      if (completedQuestIds.has(id)) return
      setCompletedQuestIds((s) => new Set(s).add(id))
      awardXP(xpAdd, { coins: coinsAdd, label: title ?? "Quest complete" })
    },
    [awardXP, completedQuestIds],
  )

  const claimSpot = useCallback<UserStatsActions["claimSpot"]>(
    (id, xpAdd, coinsAdd, stepsAdded, title) => {
      if (claimedSpotIds.has(id)) return
      setClaimedSpotIds((s) => new Set(s).add(id))
      if (stepsAdded > 0) setSteps((p) => p + stepsAdded)
      awardXP(xpAdd, { coins: coinsAdd, label: title ?? "Pickup claimed" })
    },
    [awardXP, claimedSpotIds],
  )

  const logMeal = useCallback<UserStatsActions["logMeal"]>(
    (id, xpAdd, title) => {
      if (loggedMealIds.has(id)) return
      setLoggedMealIds((s) => new Set(s).add(id))
      setMealsLogged((m) => m + 1)
      awardXP(xpAdd, { label: title ?? "Meal logged" })
    },
    [awardXP, loggedMealIds],
  )

  const addHydration = useCallback(() => {
    setHydrationGlasses((g) => Math.min(mockUser.hydrationTarget, g + 1))
  }, [])

  const addSteps = useCallback((n: number) => {
    if (n <= 0) return
    setSteps((p) => p + n)
  }, [])

  const clearReward = useCallback(() => setLastReward(null), [])

  /* ----- Memoized value ----- */
  const value = useMemo<Ctx>(
    () => ({
      xp,
      coins,
      level,
      streak,
      steps,
      mealsLogged,
      hydrationGlasses,
      completedQuestIds,
      claimedSpotIds,
      loggedMealIds,
      earnedToday,
      leaderboard: board,
      rank: rankInfo,
      lastReward,
      awardXP,
      completeQuest,
      claimSpot,
      logMeal,
      addHydration,
      addSteps,
      clearReward,
    }),
    [
      xp,
      coins,
      level,
      streak,
      steps,
      mealsLogged,
      hydrationGlasses,
      completedQuestIds,
      claimedSpotIds,
      loggedMealIds,
      earnedToday,
      board,
      rankInfo,
      lastReward,
      awardXP,
      completeQuest,
      claimSpot,
      logMeal,
      addHydration,
      addSteps,
      clearReward,
    ],
  )

  return <UserStatsContext.Provider value={value}>{children}</UserStatsContext.Provider>
}

export function useUserStats(): Ctx {
  const ctx = useContext(UserStatsContext)
  if (!ctx) {
    throw new Error("useUserStats must be used inside <UserStatsProvider>")
  }
  return ctx
}
