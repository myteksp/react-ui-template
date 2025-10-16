/**
 * MainLayout Component (Presentation Layer)
 *
 * Main application layout with header, sidebar, and content area.
 * Responsive design using Tailwind breakpoints.
 */

import type { ReactNode } from 'react';
import { useUiStore } from '@/stores/ui.store';

export interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { isSidebarOpen, toggleSidebar } = useUiStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">React Template</h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">Welcome back!</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-20
            w-64 bg-white border-r border-gray-200
            transform transition-transform duration-200 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="p-4 space-y-2">
            <a
              href="/dashboard"
              className="block px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
            >
              Dashboard
            </a>
            <a
              href="/users"
              className="block px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
            >
              Users
            </a>
            <a
              href="/settings"
              className="block px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
            >
              Settings
            </a>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
