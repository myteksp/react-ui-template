/**
 * Login Page (Presentation Layer)
 */

import { LoginForm } from '@/components/features/LoginForm';

export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <LoginForm />
    </div>
  );
};
