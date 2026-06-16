import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  LayoutAnimation,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInDown, useReducedMotion } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { colors, radius } from '../theme/tokens';
import { useCaseStore } from '../store/caseStore';
import { DOCUMENT_TYPE_GROUPS } from '../constants/documentTypes';
import AdvisorAlertBanner from '../components/advisor/AdvisorAlertBanner';

interface Issue {
  id: string;
  text: string;
  step: number;
  severity: 'required' | 'warning';
}

interface CategoryState {
  name: string;
  key: string;
  status: 'complete' | 'warning' | 'required';
  issues: Issue[];
}

export default function VerifyScreen() {
  const router = useRouter();
  const isReducedMotion = useReducedMotion();

  // Zustand State
  const caseStore = useCaseStore();

  // Local State
  const [analyzing, setAnalyzing] = useState(true);
  const [categories, setCategories] = useState<CategoryState[]>([]);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [ignoredIssues, setIgnoredIssues] = useState<Record<string, boolean>>({});

  // Initial load animation — runs once only
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalyzing(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Re-run verification when store data or ignored issues change (no animation)
  useEffect(() => {
    runVerification();
  }, [caseStore.district, caseStore.court, caseStore.documentType, caseStore.parties,
      caseStore.uploadedDocs, caseStore.chronology, caseStore.factualSynopsis,
      caseStore.legalStrategy, caseStore.causeOfAction, caseStore.causeOfActionDate,
      caseStore.prayers, caseStore.companionDocs, caseStore.witnesses, caseStore.valuation,
      ignoredIssues]);

  const runVerification = () => {
    const issuesList: Record<string, Issue[]> = {
      details: [],
      parties: [],
      docs: [],
      strategy: [],
      companions: [],
    };

    // 1. Details Verification
    if (!caseStore.district) {
      issuesList.details.push({
        id: 'det_dist',
        text: 'District has not been selected.',
        step: 1,
        severity: 'required',
      });
    }
    if (!caseStore.court) {
      issuesList.details.push({
        id: 'det_court',
        text: 'Court or Tribunal has not been selected.',
        step: 1,
        severity: 'required',
      });
    }
    if (!caseStore.documentType) {
      issuesList.details.push({
        id: 'det_type',
        text: 'Draft document type has not been selected.',
        step: 1,
        severity: 'required',
      });
    }

    // 2. Parties Verification
    if (caseStore.parties.length === 0) {
      issuesList.parties.push({
        id: 'par_empty',
        text: 'At least one party (Petitioner/Respondent) is required.',
        step: 1,
        severity: 'required',
      });
    } else {
      // Check for incomplete fields
      caseStore.parties.forEach((party, i) => {
        if (!party.address || party.address.trim().length < 8) {
          issuesList.parties.push({
            id: `par_addr_${party.id}`,
            text: `${party.role} ${party.name || `[#${i+1}]`} address appears incomplete or too short.`,
            step: 1,
            severity: 'warning',
          });
        }
      });
    }

    // 3. Documents Verification
    if (caseStore.uploadedDocs.length === 0) {
      issuesList.docs.push({
        id: 'doc_empty',
        text: 'No case documents or exhibits have been uploaded.',
        step: 2,
        severity: 'warning',
      });
    } else {
      caseStore.uploadedDocs.forEach((doc) => {
        if (!doc.description || doc.description.trim() === '') {
          issuesList.docs.push({
            id: `doc_desc_${doc.id}`,
            text: `Description is missing for uploaded file: ${doc.name}.`,
            step: 2,
            severity: 'warning',
          });
        }
      });
    }

    // 4. Strategy & Prayer Verification
    if (!caseStore.chronology || caseStore.chronology.trim() === '') {
      issuesList.strategy.push({
        id: 'strat_chron',
        text: 'Chronology timeline is empty.',
        step: 3,
        severity: 'warning',
      });
    }
    if (!caseStore.factualSynopsis || caseStore.factualSynopsis.trim() === '') {
      issuesList.strategy.push({
        id: 'strat_facts',
        text: 'Factual Synopsis has not been entered.',
        step: 3,
        severity: 'warning',
      });
    }
    if (!caseStore.legalStrategy || caseStore.legalStrategy.trim() === '') {
      issuesList.strategy.push({
        id: 'strat_legal',
        text: 'Legal grounds and statutory codes have not been entered.',
        step: 3,
        severity: 'warning',
      });
    }
    if (!caseStore.causeOfAction || caseStore.causeOfAction.trim() === '') {
      issuesList.strategy.push({
        id: 'strat_coa',
        text: 'Details of Cause of Action are missing.',
        step: 3,
        severity: 'warning',
      });
    }
    if (!caseStore.causeOfActionDate) {
      issuesList.strategy.push({
        id: 'strat_coa_date',
        text: 'Date of Cause of Action is missing.',
        step: 3,
        severity: 'warning',
      });
    }
    if (!caseStore.prayers || caseStore.prayers.length === 0) {
      issuesList.strategy.push({
        id: 'strat_prayer',
        text: 'Prayer & Reliefs section is empty.',
        step: 3,
        severity: 'warning',
      });
    }

    // 5. Companion Documents Verification
    const isValuationChecked =
      !!caseStore.companionDocs['4.7.valuation_stmt'] ||
      !!caseStore.companionDocs['4.7.court_fee'];
    if (isValuationChecked && (!caseStore.valuation || caseStore.valuation.trim() === '')) {
      issuesList.companions.push({
        id: 'comp_val',
        text: 'Valuation is selected, but valuation amount is missing.',
        step: 4,
        severity: 'warning',
      });
    }
    const isWitnessChecked = !!caseStore.companionDocs['4.6.witness_list'];
    if (isWitnessChecked && caseStore.witnesses.length === 0) {
      issuesList.companions.push({
        id: 'comp_wit',
        text: 'Witness List is selected, but no witnesses have been added.',
        step: 4,
        severity: 'warning',
      });
    }

    // Filter ignored issues
    const filterIgnored = (issues: Issue[]) => {
      return issues.filter((iss) => !ignoredIssues[iss.id]);
    };

    const getStatus = (issues: Issue[]) => {
      const active = filterIgnored(issues);
      if (active.length === 0) return 'complete';
      if (active.some((i) => i.severity === 'required')) return 'required';
      return 'warning';
    };

    setCategories([
      {
        name: 'Case Details',
        key: 'details',
        status: getStatus(issuesList.details),
        issues: filterIgnored(issuesList.details),
      },
      {
        name: 'Parties',
        key: 'parties',
        status: getStatus(issuesList.parties),
        issues: filterIgnored(issuesList.parties),
      },
      {
        name: 'Documents',
        key: 'docs',
        status: getStatus(issuesList.docs),
        issues: filterIgnored(issuesList.docs),
      },
      {
        name: 'Strategy & Prayer',
        key: 'strategy',
        status: getStatus(issuesList.strategy),
        issues: filterIgnored(issuesList.strategy),
      },
      {
        name: 'Companion Documents',
        key: 'companions',
        status: getStatus(issuesList.companions),
        issues: filterIgnored(issuesList.companions),
      },
    ]);
  };

  const toggleExpandCategory = (key: string) => {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setExpandedCat(expandedCat === key ? null : key);
  };

  const handleFixIssue = (issue: Issue) => {
    router.dismissAll();
    router.push(`/step${issue.step}` as any);
  };

  const handleIgnoreIssue = (issueId: string) => {
    setIgnoredIssues((prev) => ({
      ...prev,
      [issueId]: true,
    }));
  };

  // Document Generator File Name Helper
  const generateDraftDocumentName = () => {
    // 1. Document Code
    let docCode = 'CaseDraft';
    if (caseStore.documentType) {
      // Find matching code in constants
      for (const group of DOCUMENT_TYPE_GROUPS) {
        const match = group.items.find(i => i.name === caseStore.documentType);
        if (match) {
          docCode = match.code;
          break;
        }
      }
    }

    // 2. Primary Party Last Name
    let lastName = 'Draft';
    if (caseStore.parties.length > 0) {
      const primary = caseStore.parties[0];
      const nameParts = primary.name.trim().split(' ');
      lastName = nameParts[nameParts.length - 1].replace(/[^a-zA-Z]/g, '') || 'Party';
    }

    // 3. Case Number
    let caseNo = 'TEMP';
    if (caseStore.caseNumbers.existing) {
      caseNo = caseStore.caseNumbers.existing.replace(/[^a-zA-Z0-9]/g, '');
    }

    // 4. Date Year
    const year = caseStore.draftingDate ? caseStore.draftingDate.split('-')[0] : '2026';

    return `${docCode}_${lastName}_${caseNo}_${year}.gdoc`;
  };

  const handleGenerate = () => {
    router.push('/generating' as any);
  };

  const handleAllocate = () => {
    router.push('/allocate' as any);
  };

  // Count total active remaining issues
  const totalRequiredIssues = categories.reduce((sum, cat) => {
    return sum + cat.issues.filter((i) => i.severity === 'required').length;
  }, 0);

  const totalWarningIssues = categories.reduce((sum, cat) => {
    return sum + cat.issues.filter((i) => i.severity === 'warning').length;
  }, 0);

  const hasIssues = totalRequiredIssues > 0 || totalWarningIssues > 0;
  const isHardBlocked = totalRequiredIssues > 0;

  const slideInAnimation = isReducedMotion
    ? undefined
    : SlideInDown.duration(400);

  const getStatusBadge = (status: string, count: number) => {
    if (status === 'complete') {
      return (
        <View style={[styles.badge, styles.badgeSuccess]}>
          <Text style={[styles.badgeText, styles.badgeTextSuccess]}>✓ Complete</Text>
        </View>
      );
    }
    if (status === 'required') {
      return (
        <View style={[styles.badge, styles.badgeError]}>
          <Text style={[styles.badgeText, styles.badgeTextError]}>
            ✗ {count} Required
          </Text>
        </View>
      );
    }
    return (
      <View style={[styles.badge, styles.badgeWarning]}>
        <Text style={[styles.badgeText, styles.badgeTextWarning]}>
          ⚠ {count} {count === 1 ? 'issue' : 'issues'}
        </Text>
      </View>
    );
  };

  const getShieldColor = () => {
    if (isHardBlocked) return colors.error;
    if (totalWarningIssues > 0) return colors.warning;
    return colors.verified;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={styles.modalCard} entering={slideInAnimation}>
        {analyzing ? (
          /* Loading State */
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.gold} />
            <Text style={styles.loaderTitle}>Smart Verification</Text>
            <Text style={styles.loaderSubtitle}>Reviewing your case file...</Text>
          </View>
        ) : (
          /* Result Content */
          <SafeAreaView style={{ flex: 1 }}>
            {/* ADVISOR Alert Banner */}
            <AdvisorAlertBanner step="verify" />

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconWrapper}>
                <Ionicons
                  name="shield-checkmark"
                  size={48}
                  color={getShieldColor()}
                />
              </View>
              <Text style={styles.title}>Smart Verification</Text>
              <Text style={styles.subtitle}>
                {isHardBlocked
                  ? 'Verification failed. Required fields must be completed.'
                  : totalWarningIssues > 0
                  ? `Review complete. ${totalWarningIssues} placeholder recommendations found.`
                  : 'Verification passed. Your case file is complete.'}
              </Text>
            </View>

            {/* Checklist Drawer */}
            <ScrollView
              style={styles.issuesScroll}
              showsVerticalScrollIndicator={false}
            >
              {categories.map((cat) => {
                const isExpanded = expandedCat === cat.key;
                return (
                  <View key={cat.key} style={styles.rowWrapper}>
                    <TouchableOpacity
                      style={styles.categoryRow}
                      onPress={() => cat.issues.length > 0 && toggleExpandCategory(cat.key)}
                      disabled={cat.issues.length === 0}
                    >
                      <View style={styles.categoryInfo}>
                        <Ionicons
                          name={
                            cat.status === 'complete'
                              ? 'checkbox'
                              : cat.status === 'required'
                              ? 'alert-circle'
                              : 'warning'
                          }
                          size={18}
                          color={
                            cat.status === 'complete'
                              ? colors.verified
                              : cat.status === 'required'
                              ? colors.error
                              : colors.warning
                          }
                          style={{ marginRight: 10 }}
                        />
                        <Text style={styles.categoryName}>{cat.name}</Text>
                      </View>
                      
                      <View style={styles.badgeRow}>
                        {getStatusBadge(cat.status, cat.issues.length)}
                        {cat.issues.length > 0 && (
                          <Ionicons
                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color={colors.textSecond}
                            style={{ marginLeft: 6 }}
                          />
                        )}
                      </View>
                    </TouchableOpacity>

                    {/* Expandable Issues list */}
                    {isExpanded && cat.issues.length > 0 && (
                      <Animated.View style={styles.issuesList} entering={FadeIn}>
                        {cat.issues.map((issue) => (
                          <View key={issue.id} style={styles.issueCard}>
                            <Text style={styles.issueText}>{issue.text}</Text>
                            
                            <View style={styles.issueActions}>
                              <TouchableOpacity
                                style={[styles.issueBtn, styles.fixBtn]}
                                onPress={() => handleFixIssue(issue)}
                              >
                                <Text style={styles.fixBtnText}>Fix Now</Text>
                              </TouchableOpacity>
                              
                              {issue.severity === 'warning' && (
                                <TouchableOpacity
                                  style={[styles.issueBtn, styles.placeholderBtn]}
                                  onPress={() => handleIgnoreIssue(issue.id)}
                                >
                                  <Text style={styles.placeholderBtnText}>
                                    Use Placeholder
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        ))}
                      </Animated.View>
                    )}
                  </View>
                );
              })}
            </ScrollView>

            {/* Bottom Actions Card */}
            <View style={styles.footer}>
              {!hasIssues ? (
                /* All Clear */
                <View>
                  <View style={styles.successMessageRow}>
                    <Ionicons name="checkmark-circle" size={18} color={colors.verified} style={{ marginRight: 6 }} />
                    <Text style={styles.successMessage}>All verification checks passed.</Text>
                  </View>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.outlineBtn, { flex: 1, marginRight: 10 }]}
                      onPress={handleAllocate}
                    >
                      <Text style={styles.outlineBtnText}>Allocate to Clerk</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.primaryBtn, { flex: 1 }]}
                      onPress={handleGenerate}
                    >
                      <Text style={styles.primaryBtnText}>Generate Draft</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : isHardBlocked ? (
                /* Blocked (Required issues exist) */
                <View>
                  <Text style={styles.warningMessage}>
                    You must fix required errors before generating the draft.
                  </Text>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.primaryBtn, { flex: 1 }]}
                      onPress={() => {
                        // Find first category that requires attention and route
                        const firstBadCat = categories.find((c) => c.status === 'required');
                        if (firstBadCat && firstBadCat.issues.length > 0) {
                          handleFixIssue(firstBadCat.issues[0]);
                        }
                      }}
                    >
                      <Text style={styles.primaryBtnText}>Fix Required Issues</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.cancelBtn]}
                      onPress={() => router.back()}
                    >
                      <Text style={styles.cancelBtnText}>Back</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                /* Warnings Only (Can bypass) */
                <View>
                  <Text style={styles.warningMessage}>
                    {totalWarningIssues} warnings remaining. Warnings will appear as placeholders in the draft.
                  </Text>
                  <View style={[styles.buttonRow, { flexWrap: 'wrap', gap: 8 }]}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.primaryBtn, { flex: 1, minWidth: 120 }]}
                      onPress={() => {
                        // Go back to the first step that has a warning
                        const firstWarnCat = categories.find((c) => c.status === 'warning');
                        if (firstWarnCat && firstWarnCat.issues.length > 0) {
                          handleFixIssue(firstWarnCat.issues[0]);
                        }
                      }}
                    >
                      <Text style={styles.primaryBtnText}>Fix Warnings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.outlineBtn, { flex: 1, minWidth: 120 }]}
                      onPress={handleAllocate}
                    >
                      <Text style={styles.outlineBtnText}>Allocate to Clerk</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.outlineBtn, { flex: 1, minWidth: 120 }]}
                      onPress={handleGenerate}
                    >
                      <Text style={styles.outlineBtnText}>Generate Anyway</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </SafeAreaView>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(27, 42, 74, 0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    width: '100%',
    height: '90%',
    backgroundColor: colors.cream,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 16,
    ...Platform.select({
      web: {
        maxWidth: 780,
        alignSelf: 'center',
        borderBottomLeftRadius: radius.lg,
        borderBottomRightRadius: radius.lg,
        height: '85%',
        marginTop: 'auto',
        marginBottom: 'auto',
        boxShadow: '0 5px 25px rgba(0,0,0,0.15)',
      },
    }),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderTitle: {
    fontSize: 22,
    fontFamily: 'DMSerifDisplay_400Regular',
    color: colors.navy,
    marginTop: 16,
    marginBottom: 6,
  },
  loaderSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecond,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 10,
  },
  iconWrapper: {
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'DMSerifDisplay_400Regular',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecond,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  issuesScroll: {
    flex: 1,
  },
  rowWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  categoryRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  badgeSuccess: {
    backgroundColor: '#EAFCEF',
  },
  badgeWarning: {
    backgroundColor: '#FEF3C7',
  },
  badgeError: {
    backgroundColor: '#FDE8E8',
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  badgeTextSuccess: {
    color: colors.verified,
  },
  badgeTextWarning: {
    color: colors.warning,
  },
  badgeTextError: {
    color: colors.error,
  },
  issuesList: {
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cream,
  },
  issueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.sm,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  issueText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
    lineHeight: 18,
    marginBottom: 8,
  },
  issueActions: {
    flexDirection: 'row',
  },
  issueBtn: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    marginRight: 8,
  },
  fixBtn: {
    backgroundColor: colors.navy,
  },
  fixBtnText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  placeholderBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
  },
  placeholderBtnText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: colors.textSecond,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  successMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.verified,
  },
  warningMessage: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecond,
    textAlign: 'center',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    height: 48,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtn: {
    backgroundColor: colors.gold,
  },
  primaryBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
  outlineBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.navy,
  },
  outlineBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  cancelBtn: {
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    marginLeft: 10,
  },
  cancelBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
});
