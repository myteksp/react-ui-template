/**
 * React Query Configuration
 *
 * Configure React Query (TanStack Query) for server state management.
 * This replaces Redux for API data in modern React apps.
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time before cached data is considered stale
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Time before inactive queries are garbage collected
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)

      // Retry failed requests
      retry: 1,

      // Refetch on window focus in production
      refetchOnWindowFocus: false,

      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations
      retry: 0,
    },
  },
});
