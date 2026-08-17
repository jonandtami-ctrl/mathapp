import React, { useRef } from 'react';
import { Animated, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type PressableScaleProps = TouchableOpacityProps & {
  children: React.ReactNode;
  scaleTo?: number;
};

// Adds a satisfying press-down "pop" to whatever it wraps - used on the
// big mode cards so tapping them feels responsive and game-like.
export default function PressableScale({ children, scaleTo = 0.95, style, ...rest }: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  function pressIn() {
    Animated.spring(scale, { toValue: scaleTo, useNativeDriver: true, friction: 6 }).start();
  }

  function pressOut() {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4 }).start();
  }

  return (
    <TouchableOpacity activeOpacity={0.9} onPressIn={pressIn} onPressOut={pressOut} style={style} {...rest}>
      <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>
    </TouchableOpacity>
  );
}
