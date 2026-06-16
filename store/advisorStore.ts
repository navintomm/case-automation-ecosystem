import { create } from 'zustand';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdvisorMessage {
  id: string;
  role: 'user' | 'advisor';
  text: string;
  timestamp: string;
  isAlert?: boolean;
}

interface AdvisorState {
  isOpen: boolean;
  drawerOpen: boolean;  // BUG-013: track nav drawer state
  unreadCount: number;
  messages: AdvisorMessage[];
  alerts: Record<string, string[]>;

  // Actions
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  addMessage: (msg: AdvisorMessage) => void;
  clearUnread: () => void;
  dismissAlert: (step: string, index: number) => void;
  setDrawerOpen: (open: boolean) => void;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockOpening: AdvisorMessage[] = [
  {
    id: 'adv_open_1',
    role: 'advisor',
    text: 'Good morning. I have reviewed the information entered so far for this matter. I am ready to assist with drafting, procedure, strategy, court fee, limitation, or any other query.',
    timestamp: 'Just now',
  },
  {
    id: 'adv_open_2',
    role: 'advisor',
    text: '⚠ I notice the cause of action date has not been entered yet. This is required for limitation analysis. Please enter it in Step 3.',
    isAlert: true,
    timestamp: 'Just now',
  },
];

const mockAlerts: Record<string, string[]> = {
  step1: [
    'Respondent address is incomplete. Full address is required for service of notice.',
    'Advocate roll number has not been entered. Some courts require this on the vakalath.',
  ],
  step2: [
    'For a Writ Petition, a certified copy of the impugned order is mandatory. Please verify it has been uploaded.',
    'Medical records may be required if the petition involves personal hardship grounds.',
  ],
  step3: [
    'Cause of action date is missing. This is essential for limitation calculation.',
    'Prayer section is empty. The AI cannot generate the relief clause without this.',
  ],
  step4: [
    'A Delay Condonation Petition may be required. The chronology suggests a gap of more than 30 days.',
    'Supporting affidavit has not been selected. Most High Court IAs require an affidavit.',
  ],
  verify: [
    'Three items require attention before generation. Tap to review.',
  ],
};

// ─── Mock Reply Pool ──────────────────────────────────────────────────────────

export const mockReplies: Record<string, string> = {
  default:
    'Based on the current matter details, I recommend verifying all mandatory documents before proceeding to draft generation. If you have a specific query, I am here to assist.',
  delay:
    'Delay condonation is required when a petition is filed beyond the statutory limitation period. For most High Court matters, this is 90 days. The court has discretion to condone delay on showing sufficient cause.',
  documents:
    'Based on the uploaded documents so far, the following appear to be missing: certified copy of the impugned order, supporting affidavit, and the vakalatnama. Please upload these before proceeding.',
  fee:
    'For a Writ Petition before the High Court of Kerala, the court fee payable is ₹300 under Article 17 of the Kerala Court Fees Act. Additional fees apply if interim relief is sought.',
  interim:
    'Interim relief via an IA (Interlocutory Application) should be sought when there is a risk of irreparable harm or when the matter involves urgent enforcement. Please ensure you attach a supporting affidavit.',
  limitation:
    'The limitation period for filing a Writ Petition is generally not fixed by statute, but courts apply the principle of laches. Most High Courts dismiss petitions filed beyond 3 years without sufficient explanation.',
  companion:
    'Based on the document type selected, the recommended companion documents include: Vakalath, Index of Documents, Court Fee Receipt, Memo of Parties, and a Supporting Affidavit if interim relief is claimed.',
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAdvisorStore = create<AdvisorState>((set) => ({
  isOpen: false,
  drawerOpen: false,
  unreadCount: 1,
  messages: [...mockOpening],
  alerts: { ...mockAlerts },

  togglePanel: () =>
    set((state) => ({
      isOpen: !state.isOpen,
      unreadCount: state.isOpen ? state.unreadCount : 0,
    })),

  openPanel: () => set({ isOpen: true, unreadCount: 0 }),

  closePanel: () => set({ isOpen: false }),

  setDrawerOpen: (open) => set({ drawerOpen: open }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  clearUnread: () => set({ unreadCount: 0 }),

  dismissAlert: (step, index) =>
    set((state) => {
      const current = state.alerts[step] ?? [];
      const updated = current.filter((_, i) => i !== index);
      return {
        alerts: {
          ...state.alerts,
          [step]: updated,
        },
      };
    }),
}));
