# SpaceSync - Frontend Architecture Documentation

## Overview

**SpaceSync** is a modern, enterprise-grade Workspace & Resource Management Single Page Application (SPA) built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**.

The interface is designed for high visual clarity, rapid interactions, and full mobile responsiveness. It features strict **Role-Based Access Control (RBAC)** to ensure users only access views relevant to their permissions.

---

## Technical Stack & Libraries

- **Framework**: React 18 with functional components and TypeScript
- **Bundler & Tooling**: Vite 6, `tsx`, `esbuild`
- **Styling**: Tailwind CSS v4 with utility-first responsive classes (`sm:`, `md:`, `lg:`)
- **Iconography**: `lucide-react`
- **State Management**: React Context (`AuthContext`) + Component Local State
- **Type Safety**: Centralized TypeScript definitions (`src/types.ts`)

---

## Application Layout & Structure

```
src/
├── App.tsx                    # Core application wrapper, RBAC enforcement, view switcher
├── main.tsx                   # React root entry point
├── index.css                  # Global Tailwind CSS imports
├── types.ts                   # Centralized TypeScript interfaces and type aliases
├── context/
│   └── AuthContext.tsx        # Global auth session, current user, role, and organization state
├── utils/
│   └── rbac.ts                # Permission validation logic per user role
├── services/
│   └── api.ts                 # API client service layer for backend data interaction
├── components/
│   ├── Header.tsx             # Sticky top header with search, campus selector, role badge, mobile toggle
│   ├── Sidebar.tsx            # Desktop sidebar navigation & mobile drawer overlay
│   ├── LandingPage.tsx        # Public marketing landing page & feature overview
│   ├── AuthModal.tsx          # Dual signup ("Register Organization" vs "Register Member") & login modal
│   └── NewBookingModal.tsx    # Interactive reservation creation wizard with conflict validation
└── views/
    ├── DashboardView.tsx      # Executive overview: statistics, pending approvals, quick booking
    ├── ResourcesView.tsx      # Workspace directory: filterable list of desks, rooms, equipment, CSV import
    ├── BookingsView.tsx       # Reservation manager: check-in triggers, cancelation handlers, search
    ├── CalendarView.tsx       # Interactive weekly time-grid with category toggles & slot selection
    ├── ApprovalsView.tsx      # Admin review queue: priority tags, bulk approvals, rejection notes
    ├── AnalyticsView.tsx      # Analytics dashboard: peak hour heatmaps, department breakdown, usage stats
    ├── UsersView.tsx          # User management: user directory, role permissions, invite flow
    ├── SettingsView.tsx       # Corporate settings: business hours, currency, timezone, integrations
    └── ProfileView.tsx        # User profile: personal details, job title, department, avatar
```

---

## Role-Based Access Control (RBAC)

SpaceSync enforces strict view-level access controls via `src/utils/rbac.ts`.

### Available User Roles

1. **Super Admin / Space Admin (`super_admin`, `space_admin`)**:
   - Access to **All 9 Views**: Dashboard, Resources, Bookings, Calendar, Approvals, Analytics, Users, Settings, Profile.
   - Can approve/deny booking requests, bulk-import resources, create users, and modify corporate settings.

2. **Member (`member`)**:
   - Access restricted strictly to **4 Core Views**:
     - 📅 **Calendar**: View global resource schedules and select time slots.
     - 🏢 **Resources**: Browse room/desk directory and initiate bookings.
     - 🔖 **Bookings**: Manage personal reservations and perform 10-minute check-in.
     - 👤 **Profile**: Update personal profile details and preferences.
   - Restricted from: *Dashboard*, *Approvals*, *Analytics*, *Users*, and *Settings*.

3. **Guest (`guest`)**:
   - View-only access to Calendar, Resources, and Bookings with mandatory approval requirements.

---

## Registration & Authentication Flows

The `AuthModal` component provides two distinct onboarding flows:

1. **Register Organization (Super Admin)**:
   - Registers a new corporate workspace entity.
   - Automatically grants `super_admin` permissions to the creator.
   - Sets up initial business hours and campus buildings.

2. **Register as Member (Employee)**:
   - Registers an individual user account associated with an existing organization or campus.
   - Allows department selection (Engineering, Design, Marketing, Operations, etc.).
   - Automatically assigns `member` role permissions upon creation.

---

## Mobile Responsiveness & Touch Optimization

The frontend is optimized for touch devices and narrow viewports:
- **Mobile Menu Drawer**: Replaces the desktop sidebar with a smooth slide-over drawer triggered from the header hamburger button (`Menu`).
- **Scrollable Data Tables**: Data grids and calendar time-grids are wrapped in `overflow-x-auto` containers with touch momentum scrolling.
- **Responsive Layout Grids**: Flex and grid containers automatically adapt from single-column on mobile (`grid-cols-1`) to multi-column on desktop (`md:grid-cols-3`, `lg:grid-cols-4`).
- **Touch Targets**: Buttons, inputs, and checkboxes feature minimum 44px tap target heights.
