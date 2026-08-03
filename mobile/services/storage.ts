import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ChildProfile } from '../types';

const KEYS = {
  profiles: 'epicmath.profiles',
  activeProfileId: 'epicmath.activeProfileId',
} as const;

export async function getProfiles(): Promise<ChildProfile[]> {
  const raw = await AsyncStorage.getItem(KEYS.profiles);
  return raw ? (JSON.parse(raw) as ChildProfile[]) : [];
}

export async function saveProfiles(profiles: ChildProfile[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.profiles, JSON.stringify(profiles));
}

export async function getActiveProfileId(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.activeProfileId);
}

export async function setActiveProfileId(id: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.activeProfileId, id);
}
