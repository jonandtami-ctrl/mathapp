import { useEffect, useState } from 'react';
import { getActiveProfileId, getProfiles, saveProfiles, setActiveProfileId } from '../services/storage';
import { sampleProfiles } from '../features/profile/sampleProfiles';
import type { ChildProfile } from '../types';

type UseActiveProfileResult = {
  profile: ChildProfile | null;
  profiles: ChildProfile[];
  loading: boolean;
  switchProfile: (id: string) => Promise<void>;
  addXpAndCoins: (xp: number, coins: number) => Promise<void>;
};

export function useActiveProfile(): UseActiveProfileResult {
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let stored = await getProfiles();
      if (stored.length === 0) {
        stored = sampleProfiles;
        await saveProfiles(stored);
      }

      let id = await getActiveProfileId();
      if (!id || !stored.some((p) => p.id === id)) {
        id = stored[0].id;
        await setActiveProfileId(id);
      }

      setProfiles(stored);
      setActiveId(id);
      setLoading(false);
    })();
  }, []);

  async function switchProfile(id: string) {
    await setActiveProfileId(id);
    setActiveId(id);
  }

  async function addXpAndCoins(xp: number, coins: number) {
    const updated = profiles.map((p) => (p.id === activeId ? { ...p, xp: p.xp + xp, coins: p.coins + coins } : p));
    setProfiles(updated);
    await saveProfiles(updated);
  }

  const profile = profiles.find((p) => p.id === activeId) ?? null;

  return { profile, profiles, loading, switchProfile, addXpAndCoins };
}
