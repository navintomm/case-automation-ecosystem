import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, radius } from '../../theme/tokens';

export default function SkeletonCard() {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.badge} />
      <View style={styles.line1} />
      <View style={styles.line2} />
      <View style={styles.footer}>
        <View style={styles.status} />
        <View style={styles.step} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    width: 220,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    width: 60,
    height: 20,
    backgroundColor: colors.cream,
    borderRadius: radius.full,
    marginBottom: 10,
  },
  line1: {
    width: '90%',
    height: 14,
    backgroundColor: colors.cream,
    borderRadius: radius.sm,
    marginBottom: 6,
  },
  line2: {
    width: '60%',
    height: 12,
    backgroundColor: colors.cream,
    borderRadius: radius.sm,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  status: {
    width: 50,
    height: 12,
    backgroundColor: colors.cream,
    borderRadius: radius.sm,
  },
  step: {
    width: 40,
    height: 12,
    backgroundColor: colors.cream,
    borderRadius: radius.sm,
  },
});
