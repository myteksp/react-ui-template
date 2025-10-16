/**
 * User Query Hooks (Business Logic Layer)
 *
 * React Query hooks for user-related data fetching.
 * These hooks handle loading states, caching, and automatic refetching.
 *
 * Think of these as your "Service" layer methods that components call.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/services/api/user.api';
import type { User, LoginRequest } from '@/types/user.types';

// Query keys - centralized for consistency
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (page: number, size: number) => [...userKeys.lists(), { page, size }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  current: () => [...userKeys.all, 'current'] as const,
};

/**
 * Fetch current authenticated user
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: userApi.getCurrentUser,
    staleTime: 10 * 60 * 1000, // 10 minutes - user data doesn't change often
  });
};

/**
 * Fetch user by ID
 */
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUserById(id),
    enabled: !!id, // Only run if ID is provided
  });
};

/**
 * Fetch paginated users
 */
export const useUsers = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: userKeys.list(page, size),
    queryFn: () => userApi.getUsers(page, size),
  });
};

/**
 * Login mutation
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => userApi.login(credentials),
    onSuccess: (data) => {
      // Store token
      localStorage.setItem('auth_token', data.token);

      // Update current user cache
      queryClient.setQueryData(userKeys.current(), data.user);
    },
  });
};

/**
 * Logout mutation
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.logout,
    onSuccess: () => {
      // Clear token
      localStorage.removeItem('auth_token');

      // Clear all user-related cache
      queryClient.removeQueries({ queryKey: userKeys.all });

      // Redirect to login
      window.location.href = '/login';
    },
  });
};

/**
 * Update user mutation
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      userApi.updateUser(id, data),
    onSuccess: (updatedUser) => {
      // Update the specific user in cache
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);

      // Invalidate user lists to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

/**
 * Delete user mutation
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};
