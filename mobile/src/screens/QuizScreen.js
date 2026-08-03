import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { generateQuestions, QUESTIONS_PER_SET } from '../questions';
import { getModeTheme } from '../theme';
import Confetti from '../components/Confetti';

export default function QuizScreen({ mode, onFinish }) {
  const theme = getModeTheme(mode);
  const questions = useMemo(() => generateQuestions(mode), [mode]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [burstId, setBurstId] = useState(0);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const streakScale = useRef(new Animated.Value(1)).current;
  const inputRef = useRef(null);

  const question = questions[index];

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (index + 1) / QUESTIONS_PER_SET,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [index]);

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

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['5%', '100%'],
  });

  return (
    <View>
      <Confetti burstId={burstId} />

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      <View style={styles.header}>
        <Text style={styles.headerText}>Question {index + 1}/{QUESTIONS_PER_SET}</Text>
        {streak >= 2 ? (
          <Animated.Text style={[styles.streak, { transform: [{ scale: streakScale }] }]}>
            🔥 {streak}
          </Animated.Text>
        ) : (
          <View />
        )}
        <Text style={styles.headerText}>Score: {score}</Text>
      </View>

      <Animated.View style={[styles.questionBox, { transform: [{ translateX: shakeTranslate }] }]}>
        <Text style={styles.questionText}>{question.text}</Text>

        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
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
  progressTrack: {
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 18,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#6d5bd0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#35317a',
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
    color: '#1f2430',
    marginVertical: 24,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  input: {
    flex: 1,
    fontSize: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    textAlign: 'center',
  },
  submitBtn: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 12,
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  feedback: {
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    width: '100%',
  },
  feedbackCorrect: {
    backgroundColor: '#e3f8e8',
  },
  feedbackWrong: {
    backgroundColor: '#fbe6e5',
  },
  feedbackText: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  feedbackTextCorrect: {
    color: '#1a7a34',
  },
  feedbackTextWrong: {
    color: '#b6221e',
  },
  nextBtn: {
    marginTop: 18,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
