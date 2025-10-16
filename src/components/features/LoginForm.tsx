/**
 * LoginForm Component (Presentation Layer)
 *
 * Example feature component that demonstrates:
 * - Using UI components from the UI layer
 * - Using business logic from hooks (use-cases)
 * - Form handling and validation
 * - Loading and error states
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Input, Card } from '@/components/ui';
import { useAuth } from '@/hooks/use-cases/useAuth';
import { ValidationService } from '@/services/domain/validation.service';

export const LoginForm = () => {
  const { login, isLoggingIn } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [serverError, setServerError] = useState('');

  const validateForm = (): boolean => {
    const newErrors = {
      email: '',
      password: '',
    };

    if (!ValidationService.isRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!ValidationService.isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!ValidationService.isRequired(formData.password)) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    try {
      await login(formData);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : 'Login failed. Please try again.'
      );
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
          disabled={isLoggingIn}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          required
          disabled={isLoggingIn}
        />

        {serverError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{serverError}</p>
          </div>
        )}

        <Button type="submit" variant="primary" fullWidth isLoading={isLoggingIn}>
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Card>
  );
};
