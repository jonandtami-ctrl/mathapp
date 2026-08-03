import React, { useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Confetti from '../../components/Confetti';
import ProgressBar from '../../components/ProgressBar';
import QuestionPrompt from '../gameplay/QuestionPrompt';
import { useAnswerEvaluation } from '../gameplay/useAnswerEvaluation';
import { generateQuestionSet } from '../questions';
import { colors, gradients, radii, spacing, typography } from '../../constants/theme';
import type { Grade } from '../../types';
import type { SessionOutcome } from '../gameplay/QuestionSession';
import type { BossStage } from './types';

type BossBattleProps = {
  stage: BossStage;
  grade: Grade;
  onFinish: (outcome: SessionOutcome) => void;
};

export default function BossBattle({ stage, grade, onFinish }: BossBattleProps) {
  const questionPool = useMemo(
    () => generateQuestionSet(stage.category, grade, stage.difficulty, stage.maxAttempts),
    [stage, grade],
  );

  const [attemptIndex, setAttemptIndex] = useState(0);
  const [hitsLanded, setHitsLanded] = useState(0);
  const [burstId, setBurstId] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const question = questionPool[attemptIndex];

  function handleResult(correct: boolean) {
    if (correct) {
      setHitsLanded((h) => h + 1);
      setTotalXp((v) => v + question.xpValue);
      setTotalCoins((v) => v + 5 + question.difficulty * 2);
      setBurstId((b) => b + 1);
    } else {
      shakeAnim.setValue(0);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -1, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    }
  }

  const { answerText, setAnswerText, selectedChoice, answered, isCorrect, feedbackMessage, submitNumeric, submitChoice } =
    useAnswerEvaluation(question, handleResult);

  const defeated = hitsLanded >= stage.healthHits;
  const attemptsUsed = attemptIndex + 1;
  const outOfAttempts = attemptsUsed >= stage.maxAttempts;
  const battleOver = answered && (defeated || outOfAttempts);

  function continueBattle() {
    if (defeated || outOfAttempts) {
      onFinish({
        correctCount: hitsLanded,
        totalCount: attemptsUsed,
        xpEarned: totalXp,
        coinsEarned: totalCoins,
        sessionHighestStreak: hitsLanded,
        categoryBreakdown: { [stage.category]: { attempted: attemptsUsed, correct: hitsLanded } },
      });
      return;
    }
    setAttemptIndex((i) => i + 1);
  }

  const shakeTranslate = shakeAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: [-8, 0, 8] });
  const bossHealthProgress = Math.max(0, (stage.healthHits - hitsLanded) / stage.healthHits);

  return (
    <View>
      <Confetti burstId={burstId} />

      <Text style={styles.bossName}>
        {stage.bossEmoji} {stage.bossName}
      </Text>
      <ProgressBar progress={bossHealthProgress} height={16} />
      <Text style={styles.hitsLabel}>
        {hitsLanded}/{stage.healthHits} hits landed · Attempt {attemptsUsed}/{stage.maxAttempts}
      </Text>

      <Animated.View style={{ transform: [{ translateX: shakeTranslate }] }}>
        <QuestionPrompt
          question={question}
          answered={answered}
          isCorrect={isCorrect}
          answerText={answerText}
          selectedChoice={selectedChoice}
          feedbackMessage={answered && isCorrect ? `Direct hit! ${feedbackMessage}` : feedbackMessage}
          onChangeAnswerText={setAnswerText}
          onSubmitNumeric={submitNumeric}
          onSubmitChoice={submitChoice}
        />

        {answered ? (
          <TouchableOpacity onPress={continueBattle}>
            <LinearGradient colors={gradients.mixed} style={styles.continueBtn}>
              <Text style={styles.continueBtnText}>
                {battleOver ? (defeated ? 'Victory! →' : 'See Results →') : 'Continue Battle →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bossName: {
    fontSize: typography.heading2.fontSize,
    fontWeight: '700',
    color: colors.textHeading,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  hitsLabel: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: typography.small.fontSize,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  continueBtn: {
    marginTop: spacing.lg,
    width: '100%',
    paddingVertical: spacing.lg,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  continueBtnText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: typography.bodyBold.fontSize,
  },
});
