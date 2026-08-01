# 🏢 SpaceSync — Enterprise Workspace & Resource Management Platform

![SpaceSync Platform](https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80)

**SpaceSync** is an enterprise-grade, full-stack Workspace & Resource Management Platform designed for modern organizations, corporate campuses, universities, and co-working hubs. It streamlines the reservation, allocation, and tracking of physical assets including conference rooms, hot desks, research labs, vehicles, equipment, and sports courts.

---

## 🌟 Key Features

### 🛡️ Strict Role-Based Access Control (RBAC)
- **Super Admin / Space Admin**: Full administrative control over all 9 platform views, including user directories, approval queues, global settings, and analytics.
- **Member (Employee)**: Clean, streamlined workspace tailored to daily productivity. Members have direct access to **Calendar**, **Resources**, **Bookings**, and **Profile**, while admin views (Dashboard, Approvals, Analytics, Users, Settings) are safely hidden.
- **Guest**: View-only access for visitors with enforced approval routing.

### 📝 Dual Registration Flow
- **Register Organization**: Bootstraps a new corporate tenant with `super_admin` privileges.
- **Register as Member**: Enables employees to sign up, select their specific department (Engineering, Design, Marketing, Operations, etc.), and immediately receive a `member` profile.

### 📱 Full Mobile & Tablet Responsiveness
- **Slide-over Mobile Drawer**: Clean touch navigation menu accessible from the header hamburger button on small screens.
- **Touch-Optimized Grids & Tables**: Horizontal scroll support and large 44px+ touch targets across interactive elements.

### 📅 Smart Interactive Weekly Calendar
- **Hourly Time-Grid**: Visual weekly schedule with category filtering (Desks, Rooms, Labs, Vehicles).
- **One-Click Slot Reservations**: Click any available hour cell to launch a pre-populated reservation modal.

### 🏢 Resource Directory & Bulk CSV Upload
- Directory featuring real-time availability badges, amenity tags, floor locations, capacity limits, and hourly rate calculations.
- **CSV Ingestion**: Bulk-import hundreds of campus resources instantly via CSV file upload.

### ⏱️ Automated Approvals & 10-Minute Check-In
- **Approval Queue**: Prioritized administrative queue for high-demand assets with bulk approval and rejection notes.
- **Check-in Triggers**: 10-minute check-in grace period to prevent ghost bookings and auto-release unused spaces.

### 📊 Advanced Analytics & Heatmaps
- Real-time tracking of peak utilization rates, hourly traffic distribution, average booking duration, and department-level resource consumption.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express.js, `tsx` (Dev), `esbuild` (Production ESM/CJS bundling)
- **State & Router**: React Context (`AuthContext`), RBAC Utility Router (`src/utils/rbac.ts`)
- **Data Architecture**: In-Memory Mock & Firestore Compatible REST Service Layer (`src/services/api.ts`)

---

## 📁 Project Structure

```
├── frontend.md               # Detailed frontend architecture & component guide
├── backend.md                # Detailed backend server, data models & API guide
├── server.ts                 # Express.js server entry point with Vite middleware
├── package.json              # Project dependencies & build scripts
├── src/
│   ├── App.tsx               # Main application coordinator & view router
│   ├── types.ts              # TypeScript types (User, Resource, Booking, etc.)
│   ├── context/
│   │   └── AuthContext.tsx   # Global authentication & role management context
│   ├── utils/
│   │   └── rbac.ts           # Role-Based Access Control validation helpers
│   ├── services/
│   │   └── api.ts            # REST API service client
│   ├── components/
│   │   ├── Header.tsx        # Top navigation header & mobile menu trigger
│   │   ├── Sidebar.tsx       # Desktop navigation sidebar & mobile slide-over drawer
│   │   ├── AuthModal.tsx     # Login & dual registration modal (Org vs Member)
│   │   ├── NewBookingModal.tsx # Interactive reservation wizard
│   │   └── LandingPage.tsx   # Public marketing landing page
│   └── views/
│       ├── DashboardView.tsx # Executive overview & metrics
│       ├── ResourcesView.tsx # Workspace resource directory & CSV import
│       ├── BookingsView.tsx  # Reservation tracking & check-in
│       ├── CalendarView.tsx  # Interactive weekly time-grid
│       ├── ApprovalsView.tsx # Admin approval queue
│       ├── AnalyticsView.tsx # Utilization heatmaps & statistics
│       ├── UsersView.tsx     # Organization user directory
│       ├── SettingsView.tsx  # Business hours & system settings
│       └── ProfileView.tsx   # User profile management
```

---

## 🚀 Installation & Local Setup

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/spacesync.git
cd spacesync
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The dev server will start at `http://localhost:3000` with hot-module reload and API endpoint handling.

### 4. Build for Production
To compile client assets and bundle the server into `dist/server.cjs`:
```bash
npm run build
```

### 5. Start Production Server
```bash
npm start
```

---

## 👥 Usage & Role Testing Guide

SpaceSync includes a **Quick Role Switcher** in the `AuthModal` to test different perspectives:

1. **Test as Super Admin (`Alex Chen`)**:
   - Access all 9 sidebar views.
   - Review pending approvals in **Approvals**, inspect analytics in **Analytics**, and manage campus users in **Users**.

2. **Test as Member (`Marcus Thorne`)**:
   - Notice the sidebar automatically hides admin options and presents only **Calendar**, **Resources**, **Bookings**, and **Profile**.
   - Create a booking for a meeting room or desk, and test the 10-minute check-in feature.

3. **Test Dual Registration**:
   - Open Sign In / Register -> Switch to **Register**.
   - Select **Register Organization** to create a new company tenant.
   - Select **Register as Member** to sign up as an employee with a selected department.

---

## 📜 Documentation

- For deep-dive frontend documentation, refer to [`frontend.md`](./frontend.md).
- For detailed backend API specifications and data models, refer to [`backend.md`](./backend.md).

---

## 📄 License

This project is open-source under the MIT License.
