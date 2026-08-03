import React, { useMemo, useRef, useState } from 'react';
import { Animated, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { generateQuestion, generateQuickPlaySet } from '../questions';
import type { EngineQuestion } from '../questions';
import Confetti from '../../components/Confetti';
import ProgressBar from '../../components/ProgressBar';
import { colors, gradients, radii, spacing, typography } from '../../constants/theme';
import type { Category, CategoryStat, Grade } from '../../types';
import type { QuizResult } from '../../hooks/useActiveProfile';

const CORRECT_MESSAGES = ['Great job!', 'Epic answer!', 'Nice thinking!', "You're getting stronger!"];
const RETRY_MESSAGES = ['Almost there!', "Let's try another one!"];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

type QuickPlayProps = {
  grade: Grade;
  onFinish: (result: QuizResult) => void;
};

export default function QuickPlay({ grade, onFinish }: QuickPlayProps) {
  const initialSet = useMemo(() => generateQuickPlaySet(grade), [grade]);
  const [questions, setQuestions] = useState<EngineQuestion[]>(initialSet);

  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);

  const [answerText, setAnswerText] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [burstId, setBurstId] = useState(0);

  const highestStreakRef = useRef(0);
  const categoryBreakdownRef = useRef<Partial<Record<Category, CategoryStat>>>({});
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const question = questions[index];
  const isLast = index + 1 >= questions.length;

  function triggerShake() {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }

  function evaluate(submitted: string) {
    const correct = submitted === question.answer || Number(submitted) === Number(question.answer);
    setAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      setFeedbackMessage(pickRandom(CORRECT_MESSAGES));
      setBurstId((b) => b + 1);
      setTotalXp((v) => v + question.xpValue);
      setTotalCoins((v) => v + 5 + question.difficulty * 2);
      setCurrentStreak((s) => {
        const next = s + 1;
        highestStreakRef.current = Math.max(highestStreakRef.current, next);
        return next;
      });
    } else {
      setFeedbackMessage(pickRandom(RETRY_MESSAGES));
      setCurrentStreak(0);
      triggerShake();
    }
  }

  function submitNumeric() {
    if (answered || answerText === '') return;
    Keyboard.dismiss();
    evaluate(answerText);
  }

  function submitChoice(choice: string) {
    if (answered) return;
    setSelectedChoice(choice);
    evaluate(choice);
  }

  function recordSlotAndAdvance() {
    const current = categoryBreakdownRef.current[question.category] ?? { attempted: 0, correct: 0 };
    categoryBreakdownRef.current[question.category] = {
      attempted: current.attempted + 1,
      correct: current.correct + (isCorrect ? 1 : 0),
    };
    if (isCorrect) setCorrectCount((c) => c + 1);

    if (isLast) {
      onFinish({
        xpEarned: totalXp,
        coinsEarned: totalCoins,
        correctCount: correctCount + (isCorrect ? 1 : 0),
        totalCount: questions.length,
        sessionHighestStreak: highestStreakRef.current,
        categoryBreakdown: categoryBreakdownRef.current,
      });
      return;
    }

    setIndex((i) => i + 1);
    resetAnswerState();
  }

  function resetAnswerState() {
    setAnswerText('');
    setSelectedChoice(null);
    setAnswered(false);
    setIsCorrect(null);
    setFeedbackMessage('');
  }

  function trySimilar() {
    const replacement = generateQuestion(question.category, question.grade, question.difficulty);
    setQuestions((prev) => prev.map((q, i) => (i === index ? replacement : q)));
    resetAnswerState();
  }

  const shakeTranslate = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-8, 0, 8],
  });

  return (
    <View>
      <Confetti burstId={burstId} />
      <ProgressBar progress={(index + 1) / questions.length} />

      <View style={styles.header}>
        <Text style={styles.headerText}>
          Question {index + 1}/{questions.length}
        </Text>
        {currentStreak >= 2 ? <Text style={styles.streak}>🔥 {currentStreak}</Text> : <View />}
        <Text style={styles.headerText}>Score: {correctCount}</Text>
      </View>

      <Animated.View style={[styles.questionBox, { transform: [{ translateX: shakeTranslate }] }]}>
        <Text style={styles.questionText}>{question.text}</Text>

        {question.inputMode === 'numeric' ? (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              returnKeyType="done"
              placeholder="Your answer"
              value={answerText}
              editable={!answered}
              onChangeText={setAnswerText}
              onSubmitEditing={submitNumeric}
            />
            <TouchableOpacity disabled={answered} onPress={submitNumeric}>
              <LinearGradient colors={gradients.accentButton} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>Check</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.choiceGrid}>
            {question.choices?.map((choice) => {
              const isSelected = selectedChoice === choice;
              const isRightChoice = choice === question.answer;
              const showState = answered && (isSelected || isRightChoice);
              return (
                <TouchableOpacity
                  key={choice}
                  disabled={answered}
                  onPress={() => submitChoice(choice)}
                  style={[
                    styles.choiceBtn,
                    showState && isRightChoice && styles.choiceCorrect,
                    showState && isSelected && !isRightChoice && styles.choiceWrong,
                  ]}
                >
                  <Text style={styles.choiceText}>{choice}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {answered ? (
          <View style={[styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
            <Text style={[styles.feedbackTitle, isCorrect ? styles.feedbackTextCorrect : styles.feedbackTextWrong]}>
              {isCorrect ? `${feedbackMessage} 🎉` : feedbackMessage}
            </Text>
            {!isCorrect ? (
              <>
                <Text style={styles.feedbackBody}>The correct answer is {question.answer}.</Text>
                <Text style={styles.feedbackBody}>{question.explanation}</Text>
              </>
            ) : (
              <Text style={styles.feedbackBody}>
                +{question.xpValue} XP · +{5 + question.difficulty * 2} coins
              </Text>
            )}
          </View>
        ) : null}

        {answered && !isCorrect ? (
          <TouchableOpacity onPress={trySimilar}>
            <LinearGradient colors={gradients.primaryButton} style={styles.secondaryBtn}>
              <Text style={styles.nextBtnText}>Try a Similar Question</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : null}

        {answered ? (
          <TouchableOpacity onPress={recordSlotAndAdvance}>
            <LinearGradient colors={gradients.successButton} style={styles.nextBtn}>
              <Text style={styles.nextBtnText}>{isLast ? 'See Results →' : 'Next Question →'}</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textBody,
    marginVertical: spacing.xl,
    textAlign: 'center',
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
  choiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: spacing.md,
  },
  choiceBtn: {
    width: '48%',
    paddingVertical: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  choiceCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.successBg,
  },
  choiceWrong: {
    borderColor: colors.error,
    backgroundColor: colors.errorBg,
  },
  choiceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textBody,
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
  feedbackTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  feedbackBody: {
    fontSize: 14,
    color: colors.textBody,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  feedbackTextCorrect: {
    color: colors.success,
  },
  feedbackTextWrong: {
    color: colors.error,
  },
  secondaryBtn: {
    marginTop: spacing.lg,
    width: '100%',
    paddingVertical: spacing.md + 2,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  nextBtn: {
    marginTop: spacing.lg,
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
