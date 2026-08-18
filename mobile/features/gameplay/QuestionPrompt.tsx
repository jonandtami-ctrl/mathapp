import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import VerticalProblem from '../../components/VerticalProblem';
import { colors, gradients, radii, spacing, typography } from '../../constants/theme';
import type { EngineQuestion } from '../questions';

type QuestionPromptProps = {
  question: EngineQuestion;
  answered: boolean;
  isCorrect: boolean | null;
  answerText: string;
  selectedChoice: string | null;
  feedbackMessage: string;
  onChangeAnswerText: (text: string) => void;
  onSubmitNumeric: () => void;
  onSubmitChoice: (choice: string) => void;
};

export default function QuestionPrompt({
  question,
  answered,
  isCorrect,
  answerText,
  selectedChoice,
  feedbackMessage,
  onChangeAnswerText,
  onSubmitNumeric,
  onSubmitChoice,
}: QuestionPromptProps) {
  return (
    <View style={styles.container}>
      {question.vertical ? (
        <VerticalProblem vertical={question.vertical} />
      ) : (
        <Text style={styles.questionText}>{question.text}</Text>
      )}

      {question.inputMode === 'numeric' ? (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            returnKeyType="done"
            placeholder="Your answer"
            value={answerText}
            editable={!answered}
            onChangeText={onChangeAnswerText}
            onSubmitEditing={onSubmitNumeric}
          />
          <TouchableOpacity disabled={answered} onPress={onSubmitNumeric}>
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
                onPress={() => onSubmitChoice(choice)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
