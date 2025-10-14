// Fix: Added TAX_RATE constant to resolve module import error.
export const TAX_RATE = 0.21;

// Improvement: Centralized PINs for different user roles.
export type UserRole = 'ADMIN' | 'MANAGER';

export const PINS: { [key: string]: UserRole } = {
  '0001': 'ADMIN',
  '9999': 'MANAGER',
};
