/**
 * Validation Service (Business Logic Layer)
 *
 * Contains reusable validation logic.
 * Can be used in forms, hooks, or anywhere validation is needed.
 */

export class ValidationService {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   * At least 8 characters, 1 uppercase, 1 lowercase, 1 number
   */
  static isValidPassword(password: string): boolean {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return minLength && hasUppercase && hasLowercase && hasNumber;
  }

  /**
   * Get password strength message
   */
  static getPasswordStrengthMessage(password: string): string {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain a number';
    return 'Password is strong';
  }

  /**
   * Validate phone number (simple US format)
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate required field
   */
  static isRequired(value: unknown): boolean {
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined;
  }

  /**
   * Validate min length
   */
  static minLength(value: string, min: number): boolean {
    return value.length >= min;
  }

  /**
   * Validate max length
   */
  static maxLength(value: string, max: number): boolean {
    return value.length <= max;
  }
}
