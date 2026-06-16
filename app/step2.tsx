import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Modal,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import Toast from 'react-native-toast-message';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { colors, radius } from '../theme/tokens';
import { useCaseStore, UploadedDoc } from '../store/caseStore';
import StepHeader from '../components/layout/StepHeader';
import BottomNavBar from '../components/layout/BottomNavBar';
import DocumentCard from '../components/ui/DocumentCard';
import AdvisorAlertBanner from '../components/advisor/AdvisorAlertBanner';

interface MockDriveFile {
  name: string;
  type: string;
  size: string;
}

const MOCK_DRIVE_FILES: MockDriveFile[] = [
  { name: 'Certified_Copy_Impugned_Order.pdf', type: 'pdf', size: '2.4 MB' },
  { name: 'Written_Statement_Respondent.docx', type: 'docx', size: '412 KB' },
  { name: 'Site_Plan_Exhibit_A.png', type: 'png', size: '1.8 MB' },
  { name: 'Representation_Dated_05_02_2026.pdf', type: 'pdf', size: '890 KB' },
  { name: 'Legal_Notice_Copy.pdf', type: 'pdf', size: '1.2 MB' },
];

export default function Step2Screen() {
  const router = useRouter();
  
  // Zustand State
  const { uploadedDocs, addDocument, removeDocument, updateDocumentDescription, setField } = useCaseStore();
  
  // Local UI State
  const [driveModalVisible, setDriveModalVisible] = useState(false);
  
  const { width } = useWindowDimensions();
  const isMobile = width < 480;

  const handleBrowseFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const extension = asset.name.split('.').pop() || 'pdf';
        
        const newDoc: UploadedDoc = {
          id: Math.random().toString(36).substring(2, 9),
          uri: asset.uri,
          name: asset.name,
          type: extension,
          description: '',
          source: 'device',
        };
        addDocument(newDoc);
        Toast.show({
          type: 'success',
          text1: 'Document Added',
          text2: `${asset.name} has been added to files.`,
          position: 'bottom',
        });
      }
    } catch (err) {
      console.log('Error picking file', err);
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: 'Could not select document. Try again.',
        position: 'bottom',
      });
    }
  };

  const handleSelectDriveFile = (file: MockDriveFile) => {
    const newDoc: UploadedDoc = {
      id: Math.random().toString(36).substring(2, 9),
      uri: `mock-drive-uri://${file.name}`,
      name: file.name,
      type: file.type,
      description: '',
      source: 'drive',
    };
    addDocument(newDoc);
    setDriveModalVisible(false);
    
    Toast.show({
      type: 'success',
      text1: 'Google Drive Import',
      text2: `Linked ${file.name} successfully.`,
      position: 'bottom',
    });
  };

  // Reordering documents (Up/Down)
  const moveDoc = (index: number, direction: 'up' | 'down') => {
    const updated = [...uploadedDocs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < uploadedDocs.length) {
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      setField('uploadedDocs', updated);
    }
  };

  const handleNext = () => {
    // Soft warning check (At least 1 document with description required)
    const hasUnlabeledDocs = uploadedDocs.some(d => !d.description || d.description.trim() === '');
    
    if (uploadedDocs.length === 0) {
      Toast.show({
        type: 'info',
        text1: 'No Documents Uploaded',
        text2: 'Proceeding without documents. You can add them later.',
        position: 'bottom',
      });
    } else if (hasUnlabeledDocs) {
      Toast.show({
        type: 'info',
        text1: 'Missing Descriptions',
        text2: 'Please add descriptions before final generation.',
        position: 'bottom',
      });
    }

    router.push('/step3');
  };

  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.translationX < -50) handleNext(); // swipe left
      if (event.translationX > 50) router.push('/step1'); // swipe right
    });

  return (
    <RNSafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <GestureDetector gesture={swipeGesture}>
        <View style={{ flex: 1 }}>
          <StepHeader currentStep={2} title="Documents Upload" />

          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
        <View style={styles.responsiveWrapper}>
          {/* ADVISOR Alert Banner */}
          <AdvisorAlertBanner step="step2" />

          {/* Signature Underline Motif */}
          <View style={styles.motifContainer}>
            <Text style={styles.sectionTitle}>Matter Records</Text>
            <View style={styles.goldMotif} />
          </View>

          {/* Upload Zone Card */}
          <View style={styles.uploadZone}>
            <Ionicons
              name="cloud-upload-outline"
              size={56}
              color={colors.gold}
              style={styles.uploadIcon}
            />
            <Text style={styles.uploadTitle}>Upload Case Documents</Text>
            <Text style={styles.uploadSubtitle}>
              PDF • Word • Images • Scanned records
            </Text>

            <View style={[styles.buttonRow, isMobile && { flexDirection: 'column' }]}>
              <TouchableOpacity
                style={[styles.uploadButton, styles.browseButton, isMobile && { width: '100%', marginBottom: 12 }]}
                onPress={handleBrowseFiles}
                accessibilityLabel="Browse local files"
                accessibilityRole="button"
              >
                <Ionicons name="folder-open" size={16} color={colors.navy} style={{ marginRight: 6 }} />
                <Text style={styles.browseButtonText}>Browse Files</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.uploadButton, styles.driveButton, isMobile && { width: '100%', marginHorizontal: 0 }]}
                onPress={() => setDriveModalVisible(true)}
                accessibilityLabel="Import from Google Drive"
                accessibilityRole="button"
              >
                <FontAwesome5 name="google-drive" size={15} color={colors.navy} style={{ marginRight: 6 }} />
                <Text style={styles.driveButtonText}>Google Drive</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Uploaded Documents List */}
          {uploadedDocs.length > 0 && (
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>
                Uploaded Documents ({uploadedDocs.length})
              </Text>
              
              <FlatList
                data={uploadedDocs}
                keyExtractor={(item) => item.id}
                scrollEnabled={false} // since it's inside a ScrollView
                renderItem={({ item: doc, index }) => (
                  <View style={styles.cardContainer}>
                    <DocumentCard
                      doc={doc}
                      onRemove={() => removeDocument(doc.id)}
                      onDescriptionChange={(desc) =>
                        updateDocumentDescription(doc.id, desc)
                      }
                    />
                    {/* Reorder Arrows on Web */}
                    {Platform.OS === 'web' && uploadedDocs.length > 1 && (
                      <View style={styles.reorderControls}>
                        <TouchableOpacity
                          onPress={() => moveDoc(index, 'up')}
                          disabled={index === 0}
                          style={[styles.arrowBtn, index === 0 && styles.arrowDisabled]}
                        >
                          <Ionicons name="arrow-up" size={16} color={colors.textSecond} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => moveDoc(index, 'down')}
                          disabled={index === uploadedDocs.length - 1}
                          style={[styles.arrowBtn, index === uploadedDocs.length - 1 && styles.arrowDisabled]}
                        >
                          <Ionicons name="arrow-down" size={16} color={colors.textSecond} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              />
            </View>
          )}

          {uploadedDocs.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="document-attach-outline" size={36} color={colors.textMuted} />
              <Text style={styles.emptyText}>No documents attached yet</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Nav Bar */}
      <BottomNavBar currentStep={2} onNext={handleNext} />
        </View>
      </GestureDetector>

      {/* Mock Google Drive Modal */}
      <Modal
        visible={driveModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setDriveModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDriveModalVisible(false)}
        >
          <View
            style={[
              styles.modalContent,
              Platform.OS === 'web' && styles.modalContentWeb,
            ]}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FontAwesome5 name="google-drive" size={18} color="#34A853" style={{ marginRight: 8 }} />
                  <Text style={styles.modalTitle}>Google Drive Picker (Mock)</Text>
                </View>
                <TouchableOpacity onPress={() => setDriveModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSub}>
                Select a document from your Google Drive legal folders.
              </Text>

              <FlatList
                data={MOCK_DRIVE_FILES}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.driveItem}
                    onPress={() => handleSelectDriveFile(item)}
                  >
                    <Ionicons
                      name={item.type === 'pdf' ? 'document-text' : item.type === 'png' ? 'image' : 'document'}
                      size={20}
                      color={colors.navy}
                      style={{ marginRight: 12 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.driveFileName}>{item.name}</Text>
                      <Text style={styles.driveFileSize}>{item.size}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                  </TouchableOpacity>
                )}
              />
            </SafeAreaView>
          </View>
        </TouchableOpacity>
      </Modal>
    </RNSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  responsiveWrapper: {
    maxWidth: 780,
    width: '100%',
    alignSelf: 'center',
  },
  motifContainer: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'DMSerifDisplay_400Regular',
    color: colors.navy,
    marginBottom: 4,
  },
  goldMotif: {
    width: 40,
    height: 3,
    backgroundColor: colors.gold,
    borderRadius: 999,
  },
  uploadZone: {
    backgroundColor: 'rgba(201,150,58,0.04)',
    borderRadius: radius.lg,
    padding: 32,
    minHeight: 220,
    borderWidth: 2.5,
    borderStyle: 'dashed',
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  uploadIcon: {
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  uploadButton: {
    height: 52,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginHorizontal: 6,
  },
  browseButton: {
    backgroundColor: colors.gold,
  },
  browseButtonText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: colors.navy,
  },
  driveButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.navy,
  },
  driveButtonText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  listContainer: {
    marginTop: 8,
  },
  listTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
    marginBottom: 12,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reorderControls: {
    flexDirection: 'column',
    marginLeft: 8,
    justifyContent: 'center',
  },
  arrowBtn: {
    padding: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    marginBottom: 4,
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 42, 74, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxHeight: '70%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 16,
  },
  modalContentWeb: {
    maxWidth: 480,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: colors.navy,
  },
  modalSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecond,
    marginVertical: 12,
  },
  driveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cream,
  },
  driveFileName: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: colors.textPrimary,
  },
  driveFileSize: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
    marginTop: 2,
  },
});
