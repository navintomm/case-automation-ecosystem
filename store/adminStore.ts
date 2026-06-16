import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  role: 'Administrator' | 'Advocate' | 'Staff' | 'Clerk';
  email: string;
  employeeId?: string;
  mobile?: string;
  lastActive: string;
  status: 'Active' | 'Inactive' | 'Suspended';
}

interface AdminState {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deactivateUser: (id: string) => void;
  updateUserStatus: (id: string, status: User['status']) => void;
}

const mockUsers: User[] = [
  { id: '1', name: 'Adv. Priya Menon', role: 'Advocate', email: 'priya@case.law', lastActive: 'Today', status: 'Active' },
  { id: '2', name: 'Adv. Arun Nair', role: 'Advocate', email: 'arun@case.law', lastActive: 'Yesterday', status: 'Active' },
  { id: '3', name: 'Ravi Menon', role: 'Staff', email: 'ravi@case.law', lastActive: 'Today', status: 'Active' },
  { id: '4', name: 'Anitha Krishnan', role: 'Staff', email: 'anitha@case.law', lastActive: '2 days ago', status: 'Active' },
  { id: '5', name: 'Admin', role: 'Administrator', email: 'admin@case.law', lastActive: 'Today', status: 'Active' },
];

export const useAdminStore = create<AdminState>((set) => ({
  users: mockUsers,
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (id, updates) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    })),
  deactivateUser: (id) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, status: 'Inactive' } : u)),
    })),
  updateUserStatus: (id, status) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, status } : u)),
    })),
}));
