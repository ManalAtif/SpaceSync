import { UserRole } from '../types';

export function isTabAllowed(tabId: string, role: UserRole): boolean {
  if (role === 'member') {
    const memberAllowed = ['calendar', 'resources', 'bookings', 'profile', 'settings'];
    return memberAllowed.includes(tabId);
  }
  if (role === 'guest') {
    const guestAllowed = ['calendar', 'resources', 'bookings'];
    return guestAllowed.includes(tabId);
  }
  // super_admin and space_admin have access to all tabs
  return true;
}

export function getDefaultTabForRole(role: UserRole): string {
  if (role === 'member' || role === 'guest') {
    return 'resources';
  }
  return 'dashboard';
}
