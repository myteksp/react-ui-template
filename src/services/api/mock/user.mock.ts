/**
 * Mock User Data
 *
 * Used when VITE_MOCK_MODE=true to simulate API responses
 */

import type { User, LoginResponse } from '@/types/user.types';

export const mockCurrentUser: User = {
  id: '1',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User',
  role: 'USER',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: '2',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'guest@example.com',
    firstName: 'Guest',
    lastName: 'User',
    role: 'GUEST',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockLoginResponse: LoginResponse = {
  user: mockCurrentUser,
  token: 'mock-jwt-token-12345',
};

// Simulate network delay
export const simulateDelay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));
