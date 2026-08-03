import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { generateQuestions, QUESTIONS_PER_SET } from './questions';
import { getModeMeta } from './modes';
import Confetti from '../../components/Confetti';
import ProgressBar from '../../components/ProgressBar';
import { colors, radii, spacing, typography } from '../../constants/theme';
import type { GameMode } from '../../types';

type QuizFlowProps = {
  mode: GameMode;
  onFinish: (score: number) => void;
};

export default function QuizFlow({ mode, onFinish }: QuizFlowProps) {
  const theme = getModeMeta(mode);
  const questions = useMemo(() => generateQuestions(mode), [mode]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [burstId, setBurstId] = useState(0);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const streakScale = useRef(new Animated.Value(1)).current;

  const question = questions[index];

  function triggerShake() {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }

  function pulseStreak() {
    streakScale.setValue(1);
    Animated.sequence([
      Animated.timing(streakScale, { toValue: 1.35, duration: 120, useNativeDriver: true }),
      Animated.timing(streakScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }

  function submitAnswer() {
    if (answered || answerText === '') return;
    Keyboard.dismiss();
    const userAnswer = Number(answerText);
    const correct = userAnswer === question.answer;
    setAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        if (next >= 2) pulseStreak();
        return next;
      });
      setBurstId((b) => b + 1);
    } else {
      setStreak(0);
      triggerShake();
    }
  }

  function goNext() {
    if (index + 1 >= QUESTIONS_PER_SET) {
      onFinish(score);
      return;
    }
    setIndex((i) => i + 1);
    setAnswerText('');
    setAnswered(false);
    setIsCorrect(null);
  }

  const shakeTranslate = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-8, 0, 8],
  });

  return (
    <View>
      <Confetti burstId={burstId} />

      <ProgressBar progress={(index + 1) / QUESTIONS_PER_SET} />

      <View style={styles.header}>
        <Text style={styles.headerText}>
          Question {index + 1}/{QUESTIONS_PER_SET}
        </Text>
        {streak >= 2 ? (
          <Animated.Text style={[styles.streak, { transform: [{ scale: streakScale }] }]}>🔥 {streak}</Animated.Text>
        ) : (
          <View />
        )}
        <Text style={styles.headerText}>Score: {score}</Text>
      </View>

      <Animated.View style={[styles.questionBox, { transform: [{ translateX: shakeTranslate }] }]}>
        <Text style={styles.questionText}>{question.text}</Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            returnKeyType="done"
            placeholder="Your answer"
            value={answerText}
            editable={!answered}
            onChangeText={setAnswerText}
            onSubmitEditing={submitAnswer}
          />
          <TouchableOpacity disabled={answered} onPress={submitAnswer}>
            <LinearGradient colors={['#35b0ab', '#4facfe']} style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Check</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {answered ? (
          <View style={[styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
            <Text style={[styles.feedbackText, isCorrect ? styles.feedbackTextCorrect : styles.feedbackTextWrong]}>
              {isCorrect ? 'Correct! 🎉' : `Not quite. The answer is ${question.answer}.`}
            </Text>
          </View>
        ) : null}

        {answered ? (
          <TouchableOpacity onPress={goNext}>
            <LinearGradient colors={theme.colors} style={styles.nextBtn}>
              <Text style={styles.nextBtnText}>
                {index + 1 >= QUESTIONS_PER_SET ? 'See Results →' : 'Next Question →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  headerText: {
    fontWeight: 'bold',
    color: colors.textHeading,
    fontSize: 15,
  },
  streak: {
    color: '#ff6a00',
    fontWeight: 'bold',
    fontSize: 15,
  },
  questionBox: {
    alignItems: 'center',
  },
  questionText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.textBody,
    marginVertical: spacing.xxl,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  input: {
    flex: 1,
    fontSize: 20,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: radii.md,
    textAlign: 'center',
  },
  submitBtn: {
    paddingVertical: spacing.lg - 2,
    paddingHorizontal: spacing.xl + 2,
    borderRadius: radii.md,
    justifyContent: 'center',
  },
  submitBtnText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: typography.bodyBold.fontSize,
  },
  feedback: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radii.md,
    width: '100%',
  },
  feedbackCorrect: {
    backgroundColor: colors.successBg,
  },
  feedbackWrong: {
    backgroundColor: colors.errorBg,
  },
  feedbackText: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  feedbackTextCorrect: {
    color: colors.success,
  },
  feedbackTextWrong: {
    color: colors.error,
  },
  nextBtn: {
    marginTop: spacing.xl,
    width: '100%',
    paddingVertical: spacing.lg,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  nextBtnText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: typography.bodyBold.fontSize,
  },
});
