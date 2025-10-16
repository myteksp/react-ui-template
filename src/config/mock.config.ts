/**
 * Mock Configuration
 *
 * Enable/disable mock mode for development without a backend
 */

export const MOCK_CONFIG = {
  // Enable mock mode when no backend is available
  enabled: import.meta.env.VITE_MOCK_MODE === 'true',
} as const;
