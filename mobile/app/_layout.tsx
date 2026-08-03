import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { gradients } from '../constants/theme';
import { ProfileProvider, useProfile } from '../features/profile/ProfileContext';
import ScreenContainer from '../components/ScreenContainer';
import LoadingState from '../components/LoadingState';
import GradePicker from '../features/onboarding/GradePicker';

function RootGate() {
  const { loading, needsOnboarding, completeOnboarding } = useProfile();

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingState message="Loading Epic Math..." />
      </ScreenContainer>
    );
  }

  if (needsOnboarding) {
    return (
      <ScreenContainer>
        <GradePicker onConfirm={completeOnboarding} />
      </ScreenContainer>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <LinearGradient colors={gradients.background} style={styles.flex}>
          <StatusBar style="light" />
          <ProfileProvider>
            <RootGate />
          </ProfileProvider>
        </LinearGradient>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
