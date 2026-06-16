import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme/tokens';
import { useCaseStore } from '../../store/caseStore';

export default function PrayerBuilder() {
  const { prayers, prayerCalculation, addPrayer, updatePrayer, removePrayer, setPrayerCalculation } = useCaseStore();

  const handleAddPrayer = () => {
    addPrayer({
      id: Math.random().toString(36).substring(2, 9),
      description: '',
      amount: undefined,
    });
  };

  const hasAmounts = prayers.some((p) => p.amount !== undefined && p.amount > 0);

  // Recalculate total relief whenever prayers or calculation settings change
  useEffect(() => {
    if (!hasAmounts) {
      if (prayerCalculation.totalRelief !== 0) {
        setPrayerCalculation({ totalRelief: 0 });
      }
      return;
    }

    const baseAmount = prayers.reduce((sum, p) => sum + (p.amount || 0), 0);
    let total = baseAmount;

    if (prayerCalculation.includeInterest) {
      const interest = (baseAmount * prayerCalculation.interestRate * prayerCalculation.interestPeriodYears) / 100;
      total += interest;
    }

    if (prayerCalculation.totalRelief !== total) {
      setPrayerCalculation({ totalRelief: total });
    }
  }, [prayers, prayerCalculation.includeInterest, prayerCalculation.interestRate, prayerCalculation.interestPeriodYears, hasAmounts]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <View style={styles.container}>
      {prayers.map((prayer, index) => (
        <View key={prayer.id} style={styles.prayerRow}>
          <Text style={styles.prayerIndex}>{index + 1}.</Text>
          <View style={styles.prayerInputs}>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Relief description..."
              value={prayer.description}
              onChangeText={(text) => updatePrayer(prayer.id, { description: text })}
              multiline
              {...Platform.select({ web: { outlineStyle: 'none' } })}
            />
            <View style={styles.amountContainer}>
              <Text style={styles.rupeeSymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Amount (Opt)"
                keyboardType="numeric"
                value={prayer.amount !== undefined ? String(prayer.amount) : ''}
                onChangeText={(text) => {
                  const val = text.replace(/[^0-9]/g, '');
                  updatePrayer(prayer.id, { amount: val ? Number(val) : undefined });
                }}
                {...Platform.select({ web: { outlineStyle: 'none' } })}
              />
            </View>
          </View>
          <TouchableOpacity onPress={() => removePrayer(prayer.id)} style={styles.removeBtn}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={handleAddPrayer} style={styles.addBtn}>
        <Text style={styles.addBtnText}>+ Add Prayer</Text>
      </TouchableOpacity>

      {hasAmounts && (
        <View style={styles.calcPanel}>
          <Text style={styles.calcTitle}>Auto Calculation</Text>
          
          <View style={styles.baseAmounts}>
            {prayers.filter(p => p.amount && p.amount > 0).map((p, i) => (
              <View key={p.id} style={styles.calcRow}>
                <Text style={styles.calcLabel} numberOfLines={1}>Relief {prayers.indexOf(p) + 1}</Text>
                <Text style={styles.calcValue}>{formatCurrency(p.amount!)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.interestSection}>
            <View style={styles.interestHeader}>
              <Text style={styles.interestLabel}>Claim Interest</Text>
              <Switch
                value={prayerCalculation.includeInterest}
                onValueChange={(val) => setPrayerCalculation({ includeInterest: val })}
                trackColor={{ false: colors.cream, true: colors.gold }}
                thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
              />
            </View>
            
            {prayerCalculation.includeInterest && (
              <View style={styles.interestInputs}>
                <View style={styles.intInputWrapper}>
                  <Text style={styles.intInputLabel}>Rate (%)</Text>
                  <TextInput
                    style={styles.intInput}
                    keyboardType="numeric"
                    value={String(prayerCalculation.interestRate)}
                    onChangeText={(text) => setPrayerCalculation({ interestRate: Number(text) || 0 })}
                    {...Platform.select({ web: { outlineStyle: 'none' } })}
                  />
                </View>
                <View style={styles.intInputWrapper}>
                  <Text style={styles.intInputLabel}>Period (Yrs)</Text>
                  <TextInput
                    style={styles.intInput}
                    keyboardType="numeric"
                    value={String(prayerCalculation.interestPeriodYears)}
                    onChangeText={(text) => setPrayerCalculation({ interestPeriodYears: Number(text) || 0 })}
                    {...Platform.select({ web: { outlineStyle: 'none' } })}
                  />
                </View>
              </View>
            )}
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Relief Value</Text>
            <Text style={styles.totalValue}>{formatCurrency(prayerCalculation.totalRelief)}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  prayerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  prayerIndex: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
    marginRight: 8,
    marginTop: 10,
    width: 20,
  },
  prayerInputs: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
  },
  descriptionInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 10,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    height: 38,
    width: 150,
  },
  rupeeSymbol: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.textMuted,
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  removeBtn: {
    padding: 10,
    marginLeft: 4,
  },
  addBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    marginTop: 4,
    marginBottom: 16,
  },
  addBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.gold,
  },
  calcPanel: {
    backgroundColor: 'rgba(27, 42, 74, 0.03)', // very light navy
    borderRadius: radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  calcTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
    marginBottom: 12,
  },
  baseAmounts: {
    marginBottom: 12,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  calcLabel: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecond,
    flex: 1,
    marginRight: 10,
  },
  calcValue: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
  },
  interestSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginBottom: 12,
  },
  interestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  interestLabel: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
  },
  interestInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  intInputWrapper: {
    flex: 1,
  },
  intInputLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginBottom: 4,
  },
  intInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    height: 36,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.gold,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  totalValue: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
});
