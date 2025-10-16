/**
 * API Configuration
 *
 * Configure your BFF (Backend for Frontend) endpoints here.
 * This allows easy switching between different environments or BFF services.
 */

export const API_CONFIG = {
  // Base URL for your BFF
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',

  // Request timeout in milliseconds
  timeout: 30000,

  // Whether to include credentials (cookies) in requests
  withCredentials: true,

  // Common headers for all requests
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

// Feature flags or environment-specific configurations
export const APP_CONFIG = {
  environment: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;
