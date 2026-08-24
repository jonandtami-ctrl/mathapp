import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Confetti from '../../components/Confetti';
import ProgressBar from '../../components/ProgressBar';
import QuestionPrompt from './QuestionPrompt';
import { useAnswerEvaluation } from './useAnswerEvaluation';
import { generateQuestion } from '../questions';
import type { EngineQuestion } from '../questions';
import { colors, gradients, radii, spacing, typography } from '../../constants/theme';
import type { Category, CategoryStat } from '../../types';

export type SessionOutcome = {
  correctCount: number;
  totalCount: number;
  xpEarned: number;
  coinsEarned: number;
  sessionHighestStreak: number;
  categoryBreakdown: Partial<Record<Category, CategoryStat>>;
};

type QuestionSessionProps = {
  initialQuestions: EngineQuestion[];
  allowRetry?: boolean;
  onFinish: (outcome: SessionOutcome) => void;
};

export default function QuestionSession({ initialQuestions, allowRetry = true, onFinish }: QuestionSessionProps) {
  const [questions, setQuestions] = useState<EngineQuestion[]>(initialQuestions);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [burstId, setBurstId] = useState(0);

  const highestStreakRef = useRef(0);
  const categoryBreakdownRef = useRef<Partial<Record<Category, CategoryStat>>>({});

  const question = questions[index];
  const isLast = index + 1 >= questions.length;

  function handleResult(correct: boolean) {
    if (correct) {
      setBurstId((b) => b + 1);
      setTotalXp((v) => v + question.xpValue);
      setTotalCoins((v) => v + 5 + question.difficulty * 2);
      setCurrentStreak((s) => {
        const next = s + 1;
        highestStreakRef.current = Math.max(highestStreakRef.current, next);
        return next;
      });
    } else {
      setCurrentStreak(0);
    }
  }

  const { answerText, setAnswerText, selectedChoice, answered, isCorrect, feedbackMessage, shakeTranslate, submitNumeric, submitChoice } =
    useAnswerEvaluation(question, currentStreak, handleResult);

  function recordSlotAndAdvance() {
    const current = categoryBreakdownRef.current[question.category] ?? { attempted: 0, correct: 0 };
    categoryBreakdownRef.current[question.category] = {
      attempted: current.attempted + 1,
      correct: current.correct + (isCorrect ? 1 : 0),
    };
    const finalCorrectCount = correctCount + (isCorrect ? 1 : 0);
    setCorrectCount(finalCorrectCount);

    if (isLast) {
      onFinish({
        correctCount: finalCorrectCount,
        totalCount: questions.length,
        xpEarned: totalXp,
        coinsEarned: totalCoins,
        sessionHighestStreak: highestStreakRef.current,
        categoryBreakdown: categoryBreakdownRef.current,
      });
      return;
    }

    setIndex((i) => i + 1);
  }

  function trySimilar() {
    const replacement = generateQuestion(question.category, question.grade, question.difficulty);
    setQuestions((prev) => prev.map((q, i) => (i === index ? replacement : q)));
  }

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

      <Animated.View style={{ transform: [{ translateX: shakeTranslate }] }}>
        <QuestionPrompt
          question={question}
          answered={answered}
          isCorrect={isCorrect}
          answerText={answerText}
          selectedChoice={selectedChoice}
          feedbackMessage={feedbackMessage}
          onChangeAnswerText={setAnswerText}
          onSubmitNumeric={submitNumeric}
          onSubmitChoice={submitChoice}
        />

        {answered && !isCorrect && allowRetry ? (
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
