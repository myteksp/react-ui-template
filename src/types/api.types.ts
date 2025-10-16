/**
 * Common API Types
 *
 * Define your API request/response types here.
 * These should mirror your BFF's DTOs (similar to Spring Boot DTOs).
 */

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp?: string;
}

// Paginated response (similar to Spring's Page)
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Common error response
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
}

// Request status
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
