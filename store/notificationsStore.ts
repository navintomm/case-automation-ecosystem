import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'deadline' | 'task' | 'overdue' | 'approval' | 'system';
  title: string;
  sub: string;
  time: string;
  read: boolean;
  navigateTo?: string;
}

interface NotificationsState {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'deadline', title: 'Filing deadline today', sub: 'Bail Application — Rajesh P. vs State', time: '2 hours ago', read: false },
  { id: '2', type: 'task', title: 'Task completed by Ravi Menon', sub: 'Printed 3 copies of Writ Petition', time: '3 hours ago', read: false },
  { id: '3', type: 'overdue', title: 'Task overdue', sub: 'File Consumer Complaint — was due yesterday', time: '1 day ago', read: false },
  { id: '4', type: 'approval', title: 'Draft ready for review', sub: 'Consumer Complaint — Meena Thomas vs XYZ Ltd.', time: '2 days ago', read: true },
  { id: '5', type: 'system', title: 'Smart Verification completed', sub: '3 issues found in Writ Petition matter', time: '2 days ago', read: true },
];

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: mockNotifications,
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  getUnreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
