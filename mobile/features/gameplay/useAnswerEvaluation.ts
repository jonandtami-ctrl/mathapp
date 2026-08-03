import { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard } from 'react-native';
import type { EngineQuestion } from '../questions';

const CORRECT_MESSAGES = ['Great job!', 'Epic answer!', 'Nice thinking!', "You're getting stronger!"];
const RETRY_MESSAGES = ['Almost there!', "Let's try another one!"];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Shared answer-evaluation state machine used by Quick Play, Adventure
 * levels, and Boss Battles. Resets automatically whenever `question.id`
 * changes (advancing to the next question, or a "try similar" swap).
 */
export function useAnswerEvaluation(question: EngineQuestion, onResult: (correct: boolean) => void) {
  const [answerText, setAnswerText] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setAnswerText('');
    setSelectedChoice(null);
    setAnswered(false);
    setIsCorrect(null);
    setFeedbackMessage('');
  }, [question.id]);

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
    } else {
      setFeedbackMessage(pickRandom(RETRY_MESSAGES));
      triggerShake();
    }
    onResult(correct);
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

  const shakeTranslate = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-8, 0, 8],
  });

  return {
    answerText,
    setAnswerText,
    selectedChoice,
    answered,
    isCorrect,
    feedbackMessage,
    shakeTranslate,
    submitNumeric,
    submitChoice,
  };
}
