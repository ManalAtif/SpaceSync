# SpaceSync - Backend Architecture & API Documentation

## Overview

The backend architecture of **SpaceSync** is powered by a **Node.js + Express.js** server setup (`server.ts`) operating seamlessly alongside **Vite** in development and compiled into a standalone, optimized CommonJS bundle (`dist/server.cjs`) for production.

---

## Server Architecture & Execution Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                        Node.js Server                       │
│                         (server.ts)                         │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
     [Development Mode]             [Production Mode]
               │                              │
    Mounts Vite Middleware            Serves Static Build
  (Hot Module Replacement &          Files from dist/ Directory
    TypeScript JIT via tsx)         (via Express Static Middleware)
```

### Key Scripts (`package.json`)

- **`dev`**: `tsx server.ts` (Executes backend TypeScript server directly with instant reloading).
- **`build`**: `vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs` (Bundles client SPA assets and compiles server into a single `dist/server.cjs` file).
- **`start`**: `node dist/server.cjs` (Launches the standalone CommonJS server).

---

## Data Models & TypeScript Types (`src/types.ts`)

### Core Entities

```typescript
export type UserRole = 'super_admin' | 'space_admin' | 'member' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  jobTitle: string;
  orgId: string;
}

export interface Resource {
  id: string;
  name: string;
  type: 'desk' | 'meeting_room' | 'lab' | 'parking' | 'sports_court' | 'vehicle';
  category: string;
  capacity: number;
  building: string;
  floor: string;
  roomNumber?: string;
  amenities: string[];
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  requiresApproval: boolean;
  hourlyRate?: number;
  imageUrl?: string;
}

export interface Booking {
  id: string;
  resourceId: string;
  resourceName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userDepartment: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'checked_in' | 'completed';
  purpose: string;
  attendeesCount: number;
  createdAt: string;
}

export interface ApprovalRequest {
  id: string;
  bookingId: string;
  resourceName: string;
  requestedBy: string;
  userDepartment: string;
  date: string;
  timeSlot: string;
  purpose: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AnalyticsSummary {
  totalBookingsThisMonth: number;
  activeUsersCount: number;
  peakUtilizationRate: number;
  avgBookingDurationHours: number;
  popularResources: { name: string; bookingsCount: number; percentage: number }[];
  usageByDepartment: { department: string; percentage: number; count: number }[];
  utilizationByHour: { hour: string; rate: number }[];
}
```

---

## API Service Layer & Endpoints

The system exposes RESTful HTTP APIs handled in `src/services/api.ts` and Express endpoints.

### Resource Management
- **`GET /api/resources`**: Fetches all space resources (rooms, desks, labs, vehicles).
- **`POST /api/resources`**: Creates a new resource entry.
- **`POST /api/resources/import`**: Accepts bulk CSV datasets to batch-import resources with automated field mapping.

### Booking & Reservation Management
- **`GET /api/bookings`**: Returns all reservations filtered by campus/user.
- **`POST /api/bookings`**: Submits a new booking request. Performs real-time conflict validation against existing confirmed/pending bookings.
- **`POST /api/bookings/:id/checkin`**: Marks a reservation as `checked_in` (simulating 10-minute check-in grace period).
- **`POST /api/bookings/:id/cancel`**: Cancels an active or pending booking.

### Approval Workflow
- **`GET /api/approvals`**: Retrieves pending approval requests for Space/Super Admins.
- **`POST /api/approvals/:id/approve`**: Approves a pending booking request and updates reservation status to `confirmed`.
- **`POST /api/approvals/:id/reject`**: Denies a pending booking request.

### User Directory & Analytics
- **`GET /api/users`**: Lists organization members, roles, and assigned departments.
- **`GET /api/analytics`**: Provides aggregated metrics including peak utilization rates, hourly traffic heatmaps, and department consumption statistics.

---

## Business Logic & Security Features

1. **Conflict Avoidance Engine**:
   - Before confirming a booking, the system verifies overlaps across `resourceId`, `date`, `startTime`, and `endTime`.
   - Prevents double-booking of physical spaces.

2. **Automated Check-in System**:
   - Reservations require user check-in within a 10-minute window of start time.
   - Unclaimed reservations can be auto-released back into the available pool.

3. **CSV Parsing & Bulk Ingestion**:
   - Ingests bulk CSV uploads with client-side parsing and backend validation for quick onboarding of multi-building campuses.
