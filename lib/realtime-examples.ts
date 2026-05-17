// Real-time Supabase Usage Examples

import { 
  subscribeToUserProfile, 
  subscribeToLeaderboard, 
  subscribeToUserMeals,
  unsubscribe 
} from './supabase-queries';

// ============ EXAMPLE 1: Real-time User Profile Updates ============
// Use in dashboard to show XP/level changes instantly

export function useUserProfileRealtime(userId: string, onUpdate: (user: any) => void) {
  const channel = subscribeToUserProfile(userId, (payload) => {
    console.log('User profile updated:', payload);
    onUpdate(payload.new);
  });

  // Cleanup function
  return () => unsubscribe(channel);
}

// Usage in React component:
/*
useEffect(() => {
  const cleanup = useUserProfileRealtime(userId, (updatedUser) => {
    setUser(updatedUser);
  });
  
  return cleanup;
}, [userId]);
*/

// ============ EXAMPLE 2: Real-time Leaderboard ============
// Use in leaderboard page to show live rank changes

export function useLeaderboardRealtime(onUpdate: (data: any) => void) {
  const channel = subscribeToLeaderboard((payload) => {
    console.log('Leaderboard updated:', payload);
    onUpdate(payload);
  });

  return () => unsubscribe(channel);
}

// Usage:
/*
useEffect(() => {
  const cleanup = useLeaderboardRealtime((payload) => {
    // Refetch leaderboard data
    fetchLeaderboard();
  });
  
  return cleanup;
}, []);
*/

// ============ EXAMPLE 3: Real-time Meal Logging ============
// Use to update meal list when new meals are logged

export function useMealsRealtime(userId: string, onMealChange: () => void) {
  const channel = subscribeToUserMeals(userId, (payload) => {
    console.log('Meal change:', payload.eventType, payload.new);
    onMealChange();
  });

  return () => unsubscribe(channel);
}

// Usage:
/*
useEffect(() => {
  const cleanup = useMealsRealtime(userId, () => {
    // Refetch meals
    fetchTodaysMeals();
  });
  
  return cleanup;
}, [userId]);
*/
