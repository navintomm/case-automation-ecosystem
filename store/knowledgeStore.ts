import { create } from 'zustand';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KnowledgeEntry {
  id: string;
  category: string;
  court: string;
  district: string;
  caseType: string;
  documentType?: string;
  title: string;
  recommendation: string;
  frequency: 'Always' | 'Frequent' | 'Occasional' | 'Rare';
  recordedBy: string;
  recordedAt: string;
  supportingDoc?: string;
}

interface KnowledgeState {
  entries: KnowledgeEntry[];
  activeFilter: string;
  searchQuery: string;

  // Actions
  addEntry: (entry: KnowledgeEntry) => void;
  editEntry: (id: string, updated: Partial<KnowledgeEntry>) => void;
  deleteEntry: (id: string) => void;
  setFilter: (filter: string) => void;
  setSearch: (query: string) => void;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockKnowledgeEntries: KnowledgeEntry[] = [
  {
    id: '1',
    category: 'Filing Defects',
    court: 'High Court of Kerala',
    district: 'Ernakulam',
    caseType: 'Writ Petition',
    title: 'Certified copy of impugned order must bear court seal',
    recommendation:
      'The registry has objected on multiple occasions where the certified copy did not carry the original court seal. Always verify the seal before filing.',
    frequency: 'Frequent',
    recordedBy: 'Adv. Priya Menon',
    recordedAt: '05.06.2026',
  },
  {
    id: '2',
    category: 'Court Practices',
    court: 'Family Court, Thrissur',
    district: 'Thrissur',
    caseType: 'Divorce Petition',
    title: 'Marriage certificate must be produced in original at first hearing',
    recommendation:
      'Family Court Thrissur requires the original marriage certificate to be produced at the first admission hearing. Certified copy alone is not accepted.',
    frequency: 'Always',
    recordedBy: 'Adv. Arun Nair',
    recordedAt: '01.06.2026',
  },
  {
    id: '3',
    category: 'Registry Objections',
    court: 'MACT, Thrissur',
    district: 'Thrissur',
    caseType: 'O.P. (MV) – Fatal Accident Claim',
    title: 'Photograph of deceased and legal heirs required at filing',
    recommendation:
      'MACT registry requires passport-size photographs of the deceased and all legal heirs to be attached to the petition at the time of filing. Missing photographs result in return.',
    frequency: 'Always',
    recordedBy: 'Admin',
    recordedAt: '20.05.2026',
  },
  {
    id: '4',
    category: 'Drafting Lessons',
    court: 'District Court, Ernakulam',
    district: 'Ernakulam',
    caseType: 'Execution Petition',
    title: 'Decree holder address must exactly match the original decree',
    recommendation:
      'Any variation in the address of the decree holder between the original decree and the execution petition leads to scrutiny objection. Copy the address verbatim.',
    frequency: 'Occasional',
    recordedBy: 'Adv. Priya Menon',
    recordedAt: '15.05.2026',
  },
  {
    id: '5',
    category: 'Office Practices',
    court: 'All Courts',
    district: 'Other',
    caseType: 'All',
    title: 'Supporting affidavit must always accompany interim injunction applications',
    recommendation:
      'Office practice requires that a supporting affidavit be drafted and filed along with every interim injunction application without exception, regardless of court practice.',
    frequency: 'Always',
    recordedBy: 'Admin',
    recordedAt: '10.04.2026',
  },
  {
    id: '6',
    category: 'Procedural Variations',
    court: 'District & Sessions Court, Kozhikode',
    district: 'Kozhikode',
    caseType: 'Bail Application',
    title: 'Bail applications must be filed in triplicate at Kozhikode Sessions',
    recommendation:
      'Unlike other Session Courts that accept duplicate copies, Kozhikode Sessions Court requires three copies of the bail application along with attested copies of the FIR and arrest memo.',
    frequency: 'Always',
    recordedBy: 'Adv. Arun Nair',
    recordedAt: '12.06.2026',
  },
];

// ─── Store ────────────────────────────────────────────────────────────────────

export const useKnowledgeStore = create<KnowledgeState>((set) => ({
  entries: [...mockKnowledgeEntries],
  activeFilter: 'All',
  searchQuery: '',

  addEntry: (entry) =>
    set((state) => ({
      entries: [entry, ...state.entries],
    })),

  editEntry: (id, updated) =>
    set((state) => ({
      entries: state.entries.map((e) => (e.id === id ? { ...e, ...updated } : e)),
    })),

  deleteEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
    })),

  setFilter: (filter) => set({ activeFilter: filter }),

  setSearch: (query) => set({ searchQuery: query }),
}));
