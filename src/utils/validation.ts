// Form validation utilities

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (Thai format)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+66|0)[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
};

// Amount validation
export const validateAmount = (amount: number, min: number = 0, max?: number): boolean => {
  if (amount <= min) return false;
  if (max && amount > max) return false;
  return true;
};

// Required field validation
export const validateRequired = (value: string | number | null | undefined): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

// Payment form validation
export interface PaymentFormData {
  amount?: number;
  paymentMethod?: string;
  acceptTerms?: boolean;
}

export const validatePaymentForm = (data: PaymentFormData): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.amount || data.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

  if (!data.paymentMethod) {
    errors.paymentMethod = 'Please select a payment method';
  }

  if (!data.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms and conditions';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Credit card validation (basic)
export const validateCreditCard = (cardNumber: string): boolean => {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');

  // Check if only digits
  if (!/^\d+$/.test(cleaned)) return false;

  // Check length (13-19 digits)
  if (cleaned.length < 13 || cleaned.length > 19) return false;

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// CVV validation
export const validateCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};

// Expiry date validation (MM/YY format)
export const validateExpiryDate = (expiry: string): boolean => {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = parseInt(match[1], 10);
  const year = parseInt('20' + match[2], 10);

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const expiryDate = new Date(year, month - 1);

  return expiryDate > now;
};

// Generic form validator
export const createValidator = <T extends Record<string, any>>(
  rules: Record<keyof T, (value: any) => string | null>
) => {
  return (data: T): ValidationResult => {
    const errors: Record<string, string> = {};

    for (const field in rules) {
      const error = rules[field](data[field]);
      if (error) {
        errors[field] = error;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
};
