export type UserRole = 'super_admin' | 'space_admin' | 'member' | 'guest';

export type ResourceType = 'room' | 'desk' | 'equipment' | 'vehicle' | 'court' | 'other';

export type ResourceStatus = 'available' | 'maintenance' | 'out_of_service';

export type BookingStatus = 'confirmed' | 'pending' | 'denied' | 'cancelled' | 'checked_in';

export type ApprovalPriority = 'high' | 'medium' | 'low';

export interface User {
  id: string;
  orgId: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  jobTitle: string;
  phone: string;
  accessGroup: string;
  status: 'active' | 'pending' | 'inactive';
  avatarUrl?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  orgId: string;
  name: string;
  type: ResourceType;
  building: string;
  floorLocation: string;
  capacity: number;
  photo: string;
  amenities: string[];
  accessGroup: string;
  status: ResourceStatus;
  requiresApproval: boolean;
  bufferMinutes: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  orgId: string;
  resourceId: string;
  resourceName: string;
  resourceType: ResourceType;
  building: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  department: string;
  title: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  attendeesCount: number;
  notes?: string;
  status: BookingStatus;
  isRecurring?: boolean;
  rrule?: string;
  seriesId?: string;
  approvalReason?: string;
  checkedInAt?: string;
  createdAt: string;
}

export interface ApprovalRequest {
  id: string;
  orgId: string;
  bookingId: string;
  requesterName: string;
  requesterEmail: string;
  department: string;
  resourceName: string;
  resourceId: string;
  requestedTime: string;
  startTime: string;
  endTime: string;
  priority: ApprovalPriority;
  status: 'pending' | 'approved' | 'denied';
  reason?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  timezone: string;
  currency: string;
  businessHours: {
    day: string;
    enabled: boolean;
    startTime: string;
    endTime: string;
  }[];
  createdAt: string;
}

export interface AppNotification {
  id: string;
  orgId: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking_confirmed' | 'reminder_24h' | 'reminder_10m' | 'approval_request' | 'approval_result' | 'checkin_nudge' | 'no_show_alert';
  read: boolean;
  createdAt: string;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingBookings: Booking[];
  alternativeSlots: { startTime: string; endTime: string }[];
}

export interface AnalyticsSummary {
  utilizationRate: number;
  totalBookingsMonth: number;
  noShowRate: number;
  activeUsersCount: number;
  totalResourcesCount: number;
  pendingApprovalsCount: number;
  departmentUsage: { department: string; percentage: number; count: number }[];
  mostUsedResources: { id: string; name: string; type: string; building: string; usagePercentage: number }[];
  leastUsedResources: { id: string; name: string; type: string; building: string; usagePercentage: number; reason: string }[];
  heatmapData: number[][]; // 5 days x 10 hours
}
