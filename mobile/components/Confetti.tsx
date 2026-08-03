import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const EMOJI = ['🎉', '⭐', '✨', '🎊', '💫'];
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type ConfettiPiece = {
  id: string;
  anim: Animated.Value;
  left: number;
  emoji: string;
  duration: number;
  size: number;
  spin: number;
};

type ConfettiProps = {
  burstId: number;
};

export default function Confetti({ burstId }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!burstId) return undefined;

    const count = 18;
    const newPieces: ConfettiPiece[] = Array.from({ length: count }).map((_, i) => ({
      id: `${burstId}-${i}`,
      anim: new Animated.Value(0),
      left: Math.random() * (SCREEN_WIDTH - 30),
      emoji: EMOJI[randomInt(0, EMOJI.length - 1)],
      duration: randomInt(1200, 2200),
      size: randomInt(14, 26),
      spin: Math.random() > 0.5 ? 1 : -1,
    }));
    setPieces(newPieces);

    newPieces.forEach((piece) => {
      Animated.timing(piece.anim, {
        toValue: 1,
        duration: piece.duration,
        useNativeDriver: true,
      }).start();
    });

    const timeout = setTimeout(() => setPieces([]), 2400);
    return () => clearTimeout(timeout);
  }, [burstId]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((piece) => {
        const translateY = piece.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [-30, SCREEN_HEIGHT + 30],
        });
        const rotate = piece.anim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${360 * piece.spin}deg`],
        });
        const opacity = piece.anim.interpolate({
          inputRange: [0, 0.85, 1],
          outputRange: [1, 1, 0],
        });
        return (
          <Animated.Text
            key={piece.id}
            style={{
              position: 'absolute',
              left: piece.left,
              fontSize: piece.size,
              opacity,
              transform: [{ translateY }, { rotate }],
            }}
          >
            {piece.emoji}
          </Animated.Text>
        );
      })}
    </View>
  );
}
