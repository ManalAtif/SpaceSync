import {
  Organization,
  User,
  Resource,
  Booking,
  ApprovalRequest,
  AppNotification,
  ConflictCheckResult,
  AnalyticsSummary,
} from '../types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error ${res.status}`);
  }
  return res.json();
}

export const apiService = {
  // Reset / Seed
  seedDatabase: () => fetchJson<{ message: string }>(`${API_BASE}/seed`, { method: 'POST' }),

  // Organization
  getOrganization: () => fetchJson<Organization>(`${API_BASE}/organization`),
  updateOrganization: (updates: Partial<Organization>) =>
    fetchJson<{ message: string; organization: Organization }>(`${API_BASE}/organization`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // Resources
  getResources: (params?: { building?: string; type?: string; availability?: string; search?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchJson<Resource[]>(`${API_BASE}/resources${query ? `?${query}` : ''}`);
  },
  createResource: (data: Partial<Resource>) =>
    fetchJson<Resource>(`${API_BASE}/resources`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateResource: (id: string, updates: Partial<Resource>) =>
    fetchJson<Resource>(`${API_BASE}/resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteResource: (id: string) =>
    fetchJson<{ message: string; id: string }>(`${API_BASE}/resources/${id}`, {
      method: 'DELETE',
    }),
  bulkImportCSV: (csvContent: string) =>
    fetchJson<{ message: string; importedCount: number }>(`${API_BASE}/resources/bulk-import`, {
      method: 'POST',
      body: JSON.stringify({ csvContent }),
    }),

  // Bookings & Conflicts
  checkConflict: (resourceId: string, startTime: string, endTime: string, excludeBookingId?: string) =>
    fetchJson<ConflictCheckResult>(`${API_BASE}/bookings/check-conflict`, {
      method: 'POST',
      body: JSON.stringify({ resourceId, startTime, endTime, excludeBookingId }),
    }),
  getBookings: (params?: { resourceId?: string; status?: string; date?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchJson<Booking[]>(`${API_BASE}/bookings${query ? `?${query}` : ''}`);
  },
  createBooking: (data: {
    resourceId: string;
    startTime: string;
    endTime: string;
    title: string;
    requesterId?: string;
    requesterName?: string;
    requesterEmail?: string;
    department?: string;
    attendeesCount?: number;
    notes?: string;
    rrule?: string;
  }) =>
    fetchJson<{ booking: Booking; isApprovalRequired: boolean }>(`${API_BASE}/bookings`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  checkInBooking: (id: string) =>
    fetchJson<{ message: string; booking: Booking }>(`${API_BASE}/bookings/${id}/checkin`, {
      method: 'PUT',
    }),
  cancelBooking: (id: string) =>
    fetchJson<{ message: string; booking: Booking }>(`${API_BASE}/bookings/${id}/cancel`, {
      method: 'PUT',
    }),
  overrideBooking: (bookingToCancelId: string, newBooking: Partial<Booking>) =>
    fetchJson<{ message: string; createdBooking: Booking }>(`${API_BASE}/bookings/override`, {
      method: 'POST',
      body: JSON.stringify({ bookingToCancelId, newBooking }),
    }),

  // Approvals
  getApprovals: () => fetchJson<ApprovalRequest[]>(`${API_BASE}/approvals`),
  processApproval: (id: string, action: 'approve' | 'deny', reason?: string) =>
    fetchJson<{ message: string; approval: ApprovalRequest }>(`${API_BASE}/approvals/${id}/action`, {
      method: 'POST',
      body: JSON.stringify({ action, reason }),
    }),

  // Analytics
  getAnalytics: () => fetchJson<AnalyticsSummary>(`${API_BASE}/analytics`),

  // Users
  getUsers: () => fetchJson<User[]>(`${API_BASE}/users`),
  createUser: (data: Partial<User>) =>
    fetchJson<User>(`${API_BASE}/users`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateUser: (id: string, updates: Partial<User>) =>
    fetchJson<User>(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // Notifications
  getNotifications: () => fetchJson<AppNotification[]>(`${API_BASE}/notifications`),
  markNotificationRead: (id: string) =>
    fetchJson<{ message: string }>(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
    }),
};
