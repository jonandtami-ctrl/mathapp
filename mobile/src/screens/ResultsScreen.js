import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { QUESTIONS_PER_SET } from '../questions';
import Confetti from '../components/Confetti';

function getTier(score) {
  if (score >= 18) return { stars: 3, title: 'Amazing! 🏆', message: "You're a math superstar!", confetti: true };
  if (score >= 14) return { stars: 2, title: 'Great Job! 🌟', message: 'Nice work, keep it up!', confetti: true };
  if (score >= 8) return { stars: 1, title: 'Good Effort! 👍', message: "Practice makes perfect, try again!", confetti: false };
  return { stars: 0, title: 'Set Complete!', message: "Keep practicing, you'll get there!", confetti: false };
}

function Star({ lit, delay }) {
  const scale = React.useRef(new Animated.Value(lit ? 0 : 1)).current;

  useEffect(() => {
    if (lit) {
      Animated.sequence([
        Animated.delay(delay),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }),
      ]).start();
    }
  }, [lit]);

  return (
    <Animated.Text style={[styles.star, lit && styles.starLit, { transform: [{ scale }] }]}>
      {lit ? '★' : '☆'}
    </Animated.Text>
  );
}

export default function ResultsScreen({ score, mode, onRetry, onHome }) {
  const [burstId, setBurstId] = useState(0);
  const tier = getTier(score);

  useEffect(() => {
    if (tier.confetti) {
      setBurstId((b) => b + 1);
      const second = setTimeout(() => setBurstId((b) => b + 1), 300);
      return () => clearTimeout(second);
    }
    return undefined;
  }, []);

  return (
    <View>
      <Confetti burstId={burstId} />
      <Text style={styles.title}>{tier.title}</Text>
      <View style={styles.starsRow}>
        {[0, 1, 2].map((i) => (
          <Star key={i} lit={i < tier.stars} delay={i * 150} />
        ))}
      </View>
      <Text style={styles.summary}>You got {score} out of {QUESTIONS_PER_SET} correct!</Text>
      <Text style={styles.message}>{tier.message}</Text>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.slot} onPress={() => onRetry(mode)}>
          <LinearGradient colors={['#6d5bd0', '#8f7ff0']} style={styles.button}>
            <Text style={styles.buttonText}>Try Again</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.slot} onPress={onHome}>
          <LinearGradient colors={['#38ef7d', '#11998e']} style={styles.button}>
            <Text style={styles.buttonText}>Back to Menu</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#35317a',
    textAlign: 'center',
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 12,
  },
  star: {
    fontSize: 46,
    color: '#ddd',
  },
  starLit: {
    color: '#ffc93c',
    textShadowColor: 'rgba(255, 201, 60, 0.7)',
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },
  summary: {
    textAlign: 'center',
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 6,
  },
  message: {
    textAlign: 'center',
    fontSize: 15,
    color: '#555',
    marginBottom: 26,
    marginTop: 4,
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slot: {
    width: '48%',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
