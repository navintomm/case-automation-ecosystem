import { create } from 'zustand';

export interface Matter {
  id: string;
  title: string;
  caseOwner: string;
  assignedStaff: string[];
  priority: 'Normal' | 'High' | 'Urgent';
  remarks: string;
  reference: string;
  status: 'Draft' | 'In Progress' | 'Awaiting Review' | 'Completed';
  currentStep: number;
  createdAt: string;
  updatedAt: string;
  documentType?: string;
  court?: string;
  parties?: string; // e.g. "Suresh Kumar vs State of Kerala"
}

interface MattersState {
  matters: Matter[];
  addMatter: (matter: Matter) => void;
  updateMatterStatus: (id: string, status: Matter['status'], step?: number) => void;
  getMatterById: (id: string) => Matter | undefined;
}

const mockMatters: Matter[] = [
  {
    id: '1',
    title: 'Suresh Kumar vs State of Kerala',
    documentType: 'Writ Petition',
    parties: 'Suresh Kumar vs State of Kerala',
    court: 'High Court',
    caseOwner: 'Adv. Priya Menon',
    assignedStaff: ['Ravi Menon'],
    priority: 'Normal',
    remarks: '',
    reference: 'REF-2026-001',
    status: 'In Progress',
    currentStep: 3,
    createdAt: '2026-06-14T10:00:00Z',
    updatedAt: '2026-06-15T14:00:00Z',
  },
  {
    id: '2',
    title: 'Rajesh P. vs State',
    documentType: 'Bail Application',
    parties: 'Rajesh P. vs State',
    court: 'Sessions Court, Thrissur',
    caseOwner: 'Adv. Priya Menon',
    assignedStaff: ['Anitha Krishnan'],
    priority: 'Urgent',
    remarks: 'Needs immediate filing',
    reference: 'BAIL-445',
    status: 'Awaiting Review',
    currentStep: 4,
    createdAt: '2026-06-12T09:00:00Z',
    updatedAt: '2026-06-13T16:00:00Z',
  },
  {
    id: '3',
    title: 'Meena Thomas vs XYZ Ltd.',
    documentType: 'Consumer Complaint',
    parties: 'Meena Thomas vs XYZ Ltd.',
    court: 'Consumer Commission',
    caseOwner: 'Adv. Priya Menon',
    assignedStaff: [],
    priority: 'Normal',
    remarks: '',
    reference: 'CC-09',
    status: 'Draft',
    currentStep: 1,
    createdAt: '2026-06-15T11:00:00Z',
    updatedAt: '2026-06-15T11:00:00Z',
  },
  {
    id: '4',
    title: 'Anjali R. vs Vijay R.',
    documentType: 'Divorce Petition',
    parties: 'Anjali R. vs Vijay R.',
    court: 'Family Court',
    caseOwner: 'Adv. Arun Nair',
    assignedStaff: ['Ravi Menon'],
    priority: 'Normal',
    remarks: 'Mutual consent',
    reference: 'FC-99',
    status: 'Completed',
    currentStep: 4,
    createdAt: '2026-05-10T10:00:00Z',
    updatedAt: '2026-05-25T14:00:00Z',
  },
];

export const useMattersStore = create<MattersState>((set, get) => ({
  matters: mockMatters,
  addMatter: (matter) =>
    set((state) => ({ matters: [matter, ...state.matters] })),
  updateMatterStatus: (id, status, step) =>
    set((state) => ({
      matters: state.matters.map((m) =>
        m.id === id
          ? { ...m, status, currentStep: step ?? m.currentStep, updatedAt: new Date().toISOString() }
          : m
      ),
    })),
  getMatterById: (id) => get().matters.find((m) => m.id === id),
}));
