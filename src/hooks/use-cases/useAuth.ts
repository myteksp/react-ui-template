/**
 * Authentication Use Case Hook (Business Logic Layer)
 *
 * Contains authentication business logic.
 * Components call this hook instead of directly calling API hooks.
 *
 * This is where you put complex logic, validations, and orchestration.
 */

import { useNavigate } from 'react-router-dom';
import { useLogin, useLogout, useCurrentUser } from '../queries/useUser';
import type { LoginRequest } from '@/types/user.types';

export const useAuth = () => {
  const navigate = useNavigate();

  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const { mutateAsync: loginMutation, isPending: isLoggingIn } = useLogin();
  const { mutateAsync: logoutMutation, isPending: isLoggingOut } = useLogout();

  /**
   * Login with credentials
   */
  const login = async (credentials: LoginRequest) => {
    try {
      const response = await loginMutation(credentials);
      navigate('/dashboard');
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    try {
      await logoutMutation();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = !!currentUser && !!localStorage.getItem('auth_token');

  /**
   * Check if user has specific role
   */
  const hasRole = (role: string) => {
    return currentUser?.role === role;
  };

  return {
    currentUser,
    isLoadingUser,
    isLoggingIn,
    isLoggingOut,
    isAuthenticated,
    login,
    logout,
    hasRole,
  };
};
