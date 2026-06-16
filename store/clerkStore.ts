import { create } from 'zustand';
import { format, addDays } from 'date-fns';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ClerkNote {
  text: string;
  timestamp: string;
}

export interface Task {
  id: string;
  documentType: string;
  court: string;
  primaryParty: string;
  priority: 'Normal' | 'High' | 'Urgent';
  deadline: string;
  instructions: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  allocatedBy: string;
  allocatedAt: string;
  notes: ClerkNote[];
}

export interface AllocationState {
  selectedClerkId: string;
  selectedClerkName: string;
  priority: 'Normal' | 'High' | 'Urgent';
  deadline: string;
  instructions: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockClerks = [
  { id: '1', name: 'Ravi Menon',       role: 'Senior Clerk' },
  { id: '2', name: 'Anitha Krishnan',  role: 'Filing Clerk' },
  { id: '3', name: 'Suresh Babu',      role: 'Junior Clerk' },
  { id: '4', name: 'Priya Nair',       role: 'Documentation Clerk' },
];

const mockTasks: Task[] = [
  {
    id: '1',
    documentType: 'Writ Petition',
    court: 'High Court',
    primaryParty: 'Suresh Kumar vs State of Kerala',
    priority: 'Urgent',
    deadline: '18.06.2026',
    instructions: 'Print 3 copies. File original. Attach vakalatnama.',
    status: 'Pending',
    allocatedBy: 'Adv. Priya Menon',
    allocatedAt: '14.06.2026',
    notes: [],
  },
  {
    id: '2',
    documentType: 'Bail Application',
    court: 'Sessions Court, Thrissur',
    primaryParty: 'Rajesh P. vs State',
    priority: 'High',
    deadline: '16.06.2026',
    instructions: 'Urgent filing. Coordinate with court clerk.',
    status: 'In Progress',
    allocatedBy: 'Adv. Arun Nair',
    allocatedAt: '13.06.2026',
    notes: [
      { text: 'Called court clerk — filing slot confirmed for 15.06.2026', timestamp: '13.06.2026 · 04:30 PM' },
    ],
  },
  {
    id: '3',
    documentType: 'Consumer Complaint',
    court: 'Consumer Commission, Ernakulam',
    primaryParty: 'Meena Thomas vs XYZ Ltd.',
    priority: 'Normal',
    deadline: '25.06.2026',
    instructions: 'Attach all invoices. 2 copies required.',
    status: 'Pending',
    allocatedBy: 'Adv. Priya Menon',
    allocatedAt: '14.06.2026',
    notes: [],
  },
  {
    id: '4',
    documentType: 'Divorce Petition',
    court: 'Family Court, Thrissur',
    primaryParty: 'Anjali R. vs Vijay R.',
    priority: 'Normal',
    deadline: '20.06.2026',
    instructions: 'File with marriage certificate copy.',
    status: 'Completed',
    allocatedBy: 'Adv. Arun Nair',
    allocatedAt: '10.06.2026',
    notes: [
      { text: 'Filed on 12.06.2026. Receipt attached.', timestamp: '12.06.2026 · 11:15 AM' },
    ],
  },
];

// ─── Store Interface ──────────────────────────────────────────────────────────

interface ClerkStoreState {
  // Clerk portal
  tasks: Task[];
  activeRole: 'advocate' | 'clerk' | 'admin' | null;

  // Allocation draft
  allocationDraft: AllocationState;

  // Allocated clerk display (set on success)
  allocatedClerkName: string | null;

  // Actions
  setActiveRole: (role: 'advocate' | 'clerk' | 'admin' | null) => void;
  setAllocationField: <K extends keyof AllocationState>(key: K, value: AllocationState[K]) => void;
  resetAllocationDraft: () => void;
  setAllocatedClerkName: (name: string | null) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  addNoteToTask: (id: string, note: ClerkNote) => void;
}

const defaultAllocationDraft: AllocationState = {
  selectedClerkId: '',
  selectedClerkName: '',
  priority: 'Normal',
  deadline: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
  instructions: '',
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useClerkStore = create<ClerkStoreState>((set) => ({
  tasks: mockTasks,
  activeRole: null,
  allocationDraft: { ...defaultAllocationDraft },
  allocatedClerkName: null,

  setActiveRole: (role) => set({ activeRole: role }),

  setAllocationField: (key, value) =>
    set((state) => ({
      allocationDraft: { ...state.allocationDraft, [key]: value },
    })),

  resetAllocationDraft: () =>
    set({ allocationDraft: { ...defaultAllocationDraft } }),

  setAllocatedClerkName: (name) => set({ allocatedClerkName: name }),

  updateTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    })),

  addNoteToTask: (id, note) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, notes: [...t.notes, note] } : t
      ),
    })),
}));
