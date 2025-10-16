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

export const userApi = {
  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/me');
    return response.data.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  /**
   * Get all users with pagination
   */
  getUsers: async (page: number = 0, size: number = 10): Promise<PageResponse<User>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<User>>>('/users', {
      params: { page, size },
    });
    return response.data.data;
  },

  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  /**
   * Update user
   */
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete user
   */
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
