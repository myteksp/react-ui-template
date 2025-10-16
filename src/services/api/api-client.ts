/**
 * API Client (Data Access Layer)
 *
 * Centralized HTTP client using Axios.
 * Handles request/response interceptors, error handling, and authentication.
 *
 * Similar to your Spring Boot RestTemplate or WebClient.
 */

import axios from 'axios';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, APP_CONFIG } from '@/config/api.config';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  withCredentials: API_CONFIG.withCredentials,
  headers: API_CONFIG.headers,
});

/**
 * Request Interceptor
 * Add auth tokens, request IDs, or modify requests before sending
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authorization token if available
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    if (!APP_CONFIG.isProduction) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle responses, errors, and token refresh logic
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (!APP_CONFIG.isProduction) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  async (error: AxiosError<{ message?: string; error?: string }>) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - refresh token or redirect to login
    if (error.response?.status === 401 && originalRequest) {
      // Implement token refresh logic here if needed
      // For now, clear auth and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle other errors
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    console.error('[API Response Error]', {
      url: error.config?.url,
      status: error.response?.status,
      message: errorMessage,
    });

    // Return a more user-friendly error object
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      originalError: error,
    });
  }
);

export default apiClient;
