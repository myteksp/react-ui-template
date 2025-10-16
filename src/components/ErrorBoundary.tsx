/**
 * Error Boundary Component
 *
 * Catches React errors and displays a fallback UI.
 * Uses react-error-boundary library.
 */

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Button, Card } from './ui';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-700 mb-4">
          An unexpected error occurred. Please try again or contact support if the problem
          persists.
        </p>
        <details className="mb-4">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
            Error details
          </summary>
          <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
            {error.message}
          </pre>
        </details>
        <Button onClick={resetErrorBoundary} variant="primary">
          Try again
        </Button>
      </Card>
    </div>
  );
};

export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset app state here if needed
        window.location.href = '/';
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};
