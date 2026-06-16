import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../theme/tokens';

interface StepProgressBarProps {
  currentStep: number; // 1 to 4
}

export default function StepProgressBar({ currentStep }: StepProgressBarProps) {
  const steps = [1, 2, 3, 4];

  return (
    <View style={styles.container}>
      {steps.map((step) => {
        const isFilled = step <= currentStep;
        return (
          <View
            key={step}
            style={[
              styles.segment,
              isFilled ? styles.filledSegment : styles.emptySegment,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 4,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#1B2A4A', // match navy background
  },
  segment: {
    flex: 1,
    height: '100%',
    marginRight: 2,
  },
  filledSegment: {
    backgroundColor: colors.gold,
  },
  emptySegment: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // light navy representation
  },
});
