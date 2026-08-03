import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import { BG_GRADIENT } from './src/theme';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [mode, setMode] = useState(null);
  const [lastScore, setLastScore] = useState(0);

  function startQuiz(selectedMode) {
    setMode(selectedMode);
    setScreen('quiz');
  }

  function finishQuiz(score) {
    setLastScore(score);
    setScreen('results');
  }

  function goHome() {
    setMode(null);
    setScreen('home');
  }

  return (
    <LinearGradient colors={BG_GRADIENT} style={styles.background}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              {screen === 'home' && <HomeScreen onSelectMode={startQuiz} />}
              {screen === 'quiz' && <QuizScreen mode={mode} onFinish={finishQuiz} />}
              {screen === 'results' && (
                <ResultsScreen score={lastScore} mode={mode} onRetry={startQuiz} onHome={goHome} />
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
  },
});
