import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export interface Party {
  id: string;
  role: string;
  name: string;
  age: string;
  relationName: string;
  relationType: 'Father' | 'Mother' | 'Spouse';
  address: string;
  pinCode?: string;
  state?: string;
  country?: string;
  representative?: string;
  guardian?: string;
  mobile?: string;
  email?: string;
}

export interface UploadedDoc {
  id: string;
  uri: string;
  name: string;
  type: string; // e.g. pdf, docx, doc, jpg, jpeg, png, tiff, other
  description: string;
  source: 'device' | 'drive';
}

export interface Prayer {
  id: string;
  description: string;
  amount?: number;
}

export interface PrayerCalculation {
  includeInterest: boolean;
  interestRate: number;
  interestPeriodYears: number;
  totalRelief: number;
}

export interface Witness {
  id: string;
  name: string;
  address: string;
  purpose: string;
}

export interface CaseNumbers {
  existing?: string;
  previous?: string;
  connected?: string;
  fir?: string;
  appeal?: string;
  execution?: string;
}

export interface Advocate {
  name: string;
  rollNumber?: string;
  firmName?: string;
  address?: string;
  mobile?: string;
  email?: string;
}

export interface CaseState {
  // Step 1
  district: string;
  court: string;
  documentType: string;
  caseNumbers: CaseNumbers;
  parties: Party[];
  advocate: Advocate;
  draftingDate: string;
  language: 'English' | 'Malayalam';

  // Step 2
  uploadedDocs: UploadedDoc[];

  // Step 3
  chronology: string;
  factualSynopsis: string;
  legalStrategy: string;
  causeOfAction: string;
  causeOfActionDate: string;
  prayers: Prayer[];
  prayerCalculation: PrayerCalculation;

  // Step 4
  companionDocs: Record<string, boolean>;
  witnesses: Witness[];
  valuation: string;

  // Actions
  setField: <K extends keyof Omit<CaseState, 'setField' | 'setCaseNumber' | 'setAdvocateField' | 'addParty' | 'removeParty' | 'updateParty' | 'addDocument' | 'removeDocument' | 'updateDocumentDescription' | 'reorderDocuments' | 'toggleCompanionDoc' | 'addWitness' | 'removeWitness' | 'addPrayer' | 'removePrayer' | 'updatePrayer' | 'setPrayerCalculation' | 'reset'>>(
    key: K,
    value: CaseState[K]
  ) => void;
  setCaseNumber: (key: keyof CaseNumbers, value: string) => void;
  setAdvocateField: (key: keyof Advocate, value: string) => void;
  addParty: (party: Party) => void;
  removeParty: (id: string) => void;
  updateParty: (id: string, updatedParty: Partial<Party>) => void;
  addDocument: (doc: UploadedDoc) => void;
  removeDocument: (id: string) => void;
  updateDocumentDescription: (id: string, description: string) => void;
  reorderDocuments: (docs: UploadedDoc[]) => void;
  toggleCompanionDoc: (key: string) => void;
  addWitness: (witness: Witness) => void;
  removeWitness: (id: string) => void;
  addPrayer: (prayer: Prayer) => void;
  removePrayer: (id: string) => void;
  updatePrayer: (id: string, updatedPrayer: Partial<Prayer>) => void;
  setPrayerCalculation: (calc: Partial<PrayerCalculation>) => void;
  reset: () => void;
}

const todayFormatted = format(new Date(), 'yyyy-MM-dd');

const initialState = {
  district: '',
  court: '',
  documentType: '',
  caseNumbers: {},
  parties: [],
  advocate: {
    name: '',
    rollNumber: '',
    firmName: '',
    address: '',
    mobile: '',
    email: '',
  },
  draftingDate: todayFormatted,
  language: 'English' as const,
  uploadedDocs: [],
  chronology: '',
  factualSynopsis: '',
  legalStrategy: '',
  causeOfAction: '',
  causeOfActionDate: todayFormatted,
  prayers: [],
  prayerCalculation: {
    includeInterest: false,
    interestRate: 12,
    interestPeriodYears: 1,
    totalRelief: 0,
  },
  companionDocs: {
    '4.5.document_list': true, // Auto-generated — always ON & pre-checked
  },
  witnesses: [],
  valuation: '',
};

export const useCaseStore = create<CaseState>()(
  persist(
    (set) => ({
      ...initialState,

      setField: (key, value) =>
        set((state) => ({
          ...state,
          [key]: value,
        })),

      setCaseNumber: (key, value) =>
        set((state) => ({
          ...state,
          caseNumbers: {
            ...state.caseNumbers,
            [key]: value,
          },
        })),

      setAdvocateField: (key, value) =>
        set((state) => ({
          ...state,
          advocate: {
            ...state.advocate,
            [key]: value,
          },
        })),

      addParty: (party) =>
        set((state) => ({
          ...state,
          parties: [...state.parties, party],
        })),

      removeParty: (id) =>
        set((state) => ({
          ...state,
          parties: state.parties.filter((p) => p.id !== id),
        })),

      updateParty: (id, updatedParty) =>
        set((state) => ({
          ...state,
          parties: state.parties.map((p) =>
            p.id === id ? { ...p, ...updatedParty } : p
          ),
        })),

      addDocument: (doc) =>
        set((state) => ({
          ...state,
          uploadedDocs: [...state.uploadedDocs, doc],
        })),

      removeDocument: (id) =>
        set((state) => ({
          ...state,
          uploadedDocs: state.uploadedDocs.filter((d) => d.id !== id),
        })),

      updateDocumentDescription: (id, description) =>
        set((state) => ({
          ...state,
          uploadedDocs: state.uploadedDocs.map((d) =>
            d.id === id ? { ...d, description } : d
          ),
        })),

      reorderDocuments: (docs) =>
        set((state) => ({
          ...state,
          uploadedDocs: docs,
        })),

      toggleCompanionDoc: (key) =>
        set((state) => {
          if (key === '4.5.document_list') return state; // Always on, cannot toggle off
          const current = !!state.companionDocs[key];
          return {
            ...state,
            companionDocs: {
              ...state.companionDocs,
              [key]: !current,
            },
          };
        }),

      addWitness: (witness) =>
        set((state) => ({
          ...state,
          witnesses: [...state.witnesses, witness],
        })),

      removeWitness: (id) =>
        set((state) => ({
          ...state,
          witnesses: state.witnesses.filter((w) => w.id !== id),
        })),

      addPrayer: (prayer) =>
        set((state) => ({
          ...state,
          prayers: [...state.prayers, prayer],
        })),

      removePrayer: (id) =>
        set((state) => ({
          ...state,
          prayers: state.prayers.filter((p) => p.id !== id),
        })),

      updatePrayer: (id, updatedPrayer) =>
        set((state) => ({
          ...state,
          prayers: state.prayers.map((p) =>
            p.id === id ? { ...p, ...updatedPrayer } : p
          ),
        })),

      setPrayerCalculation: (calc) =>
        set((state) => ({
          ...state,
          prayerCalculation: {
            ...state.prayerCalculation,
            ...calc,
          },
        })),

      reset: () => set(initialState),
    }),
    {
      name: 'case-draft-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
