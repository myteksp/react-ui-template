/**
 * UI Store (Client State Management)
 *
 * Zustand store for client-side UI state.
 * Use this for application state that doesn't come from the server.
 *
 * Examples: theme, sidebar open/closed, modals, notifications, etc.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Sidebar
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;

  // Modal
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

/**
 * UI Store
 *
 * Using persist middleware to save theme preference to localStorage
 */
export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      // Theme state
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      // Sidebar state
      isSidebarOpen: true,
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      // Modal state
      isModalOpen: false,
      modalContent: null,
      openModal: (content) => set({ isModalOpen: true, modalContent: content }),
      closeModal: () => set({ isModalOpen: false, modalContent: null }),
    }),
    {
      name: 'ui-storage', // localStorage key
      partialize: (state) => ({ theme: state.theme }), // Only persist theme
    }
  )
);
