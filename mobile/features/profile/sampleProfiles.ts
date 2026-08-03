import type { ChildProfile } from '../../types';

// Seed data used the first time the app runs, before real account/profile
// creation (Supabase + multi-profile UI) lands in a later phase.
export const sampleProfiles: ChildProfile[] = [
  {
    id: 'sample-1',
    nickname: 'Explorer',
    grade: 4,
    avatar: '🦊',
    xp: 0,
    coins: 0,
    createdAt: new Date().toISOString(),
  },
];
