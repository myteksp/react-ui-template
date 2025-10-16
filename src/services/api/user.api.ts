/**
 * User API Repository (Data Access Layer)
 *
 * This is your "Repository" layer - handles all HTTP calls related to users.
 * Similar to Spring Boot's @Repository or REST client.
 *
 * Each domain should have its own API file (user.api.ts, product.api.ts, etc.)
 */

import apiClient from './api-client';
import type { User, LoginRequest, LoginResponse } from '@/types/user.types';
import type { ApiResponse, PageResponse } from '@/types/api.types';
import { MOCK_CONFIG } from '@/config/mock.config';
import { mockCurrentUser, mockUsers, mockLoginResponse, simulateDelay } from './mock/user.mock';

export const userApi = {
  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<User> => {
    // Mock mode for development without backend
    if (MOCK_CONFIG.enabled) {
      await simulateDelay();
      return mockCurrentUser;
    }

    const response = await apiClient.get<ApiResponse<User>>('/users/me');
    return response.data.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User> => {
    if (MOCK_CONFIG.enabled) {
      await simulateDelay();
      const user = mockUsers.find((u) => u.id === id);
      if (!user) throw new Error('User not found');
      return user;
    }

    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  /**
   * Get all users with pagination
   */
  getUsers: async (page: number = 0, size: number = 10): Promise<PageResponse<User>> => {
    if (MOCK_CONFIG.enabled) {
      await simulateDelay();
      return {
        content: mockUsers.slice(page * size, (page + 1) * size),
        totalElements: mockUsers.length,
        totalPages: Math.ceil(mockUsers.length / size),
        size,
        number: page,
      };
    }

    const response = await apiClient.get<ApiResponse<PageResponse<User>>>('/users', {
      params: { page, size },
    });
    return response.data.data;
  },

  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    if (MOCK_CONFIG.enabled) {
      await simulateDelay();
      // Simple mock validation
      if (credentials.email && credentials.password) {
        return mockLoginResponse;
      }
      throw new Error('Invalid credentials');
    }

    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    if (MOCK_CONFIG.enabled) {
      await simulateDelay();
      return;
    }

    await apiClient.post('/auth/logout');
  },

  /**
   * Update user
   */
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    if (MOCK_CONFIG.enabled) {
      await simulateDelay();
      const user = mockUsers.find((u) => u.id === id);
      if (!user) throw new Error('User not found');
      return { ...user, ...data };
    }

    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete user
   */
  deleteUser: async (id: string): Promise<void> => {
    if (MOCK_CONFIG.enabled) {
      await simulateDelay();
      return;
    }

    await apiClient.delete(`/users/${id}`);
  },
};
