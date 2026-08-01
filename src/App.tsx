import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { NewBookingModal } from './components/NewBookingModal';

import { DashboardView } from './views/DashboardView';
import { ResourcesView } from './views/ResourcesView';
import { BookingsView } from './views/BookingsView';
import { CalendarView } from './views/CalendarView';
import { ApprovalsView } from './views/ApprovalsView';
import { AnalyticsView } from './views/AnalyticsView';
import { UsersView } from './views/UsersView';
import { SettingsView } from './views/SettingsView';
import { ProfileView } from './views/ProfileView';

import { Resource, Booking, ApprovalRequest, User, AnalyticsSummary } from './types';
import { apiService } from './services/api';
import { isTabAllowed, getDefaultTabForRole } from './utils/rbac';

function MainAppContent() {
  const {
    showLandingPage,
    showAuthModal,
    setShowLandingPage,
    setShowAuthModal,
    refreshData,
    organization,
    currentRole,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Application Data States
  const [resources, setResources] = useState<Resource[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  // New Booking Modal preset state
  const [showNewBookingModal, setShowNewBookingModal] = useState<boolean>(false);
  const [preselectedResource, setPreselectedResource] = useState<string | undefined>(undefined);
  const [preselectedDate, setPreselectedDate] = useState<string | undefined>(undefined);
  const [preselectedTime, setPreselectedTime] = useState<string | undefined>(undefined);

  // Enforce Role-Based Access Control (RBAC) on active tab change or role change
  useEffect(() => {
    if (!isTabAllowed(activeTab, currentRole)) {
      setActiveTab(getDefaultTabForRole(currentRole));
    }
  }, [currentRole, activeTab]);

  const fetchAllData = async () => {
    try {
      const [resList, bkList, apprList, usrList, anaData] = await Promise.all([
        apiService.getResources(),
        apiService.getBookings(),
        apiService.getApprovals(),
        apiService.getUsers(),
        apiService.getAnalytics(),
      ]);
      setResources(resList);
      setBookings(bkList);
      setApprovals(apprList);
      setUsers(usrList);
      setAnalytics(anaData);
    } catch (err) {
      console.warn('Error fetching workspace data:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [activeTab]);

  const handleOpenNewBookingWithResource = (resId: string) => {
    setPreselectedResource(resId);
    setPreselectedDate(undefined);
    setPreselectedTime(undefined);
    setShowNewBookingModal(true);
  };

  const handleOpenNewBookingWithTime = (date: string, time: string) => {
    setPreselectedResource(undefined);
    setPreselectedDate(date);
    setPreselectedTime(time);
    setShowNewBookingModal(true);
  };

  const handleApproveRequest = async (id: string, action: 'approve' | 'deny') => {
    try {
      await apiService.processApproval(id, action, `${action === 'approve' ? 'Approved' : 'Denied'} by Space Admin`);
      fetchAllData();
      refreshData();
    } catch (err) {
      alert('Action error: ' + err);
    }
  };

  if (showLandingPage) {
    return (
      <LandingPage
        onGetStarted={() => {
          setShowLandingPage(false);
          setShowAuthModal(true);
        }}
        onLogin={() => {
          setShowLandingPage(false);
          setShowAuthModal(true);
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      {/* Left Navigation Sidebar & Mobile Drawer */}
      <Sidebar
        activeTab={activeTab}
        onNavigate={(tab) => setActiveTab(tab)}
        pendingApprovalsCount={approvals.filter((a) => a.status === 'pending').length}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenNewBooking={() => setShowNewBookingModal(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && isTabAllowed('dashboard', currentRole) && (
            <DashboardView
              bookings={bookings}
              approvals={approvals}
              onNavigate={(t) => setActiveTab(t)}
              onOpenNewBooking={() => setShowNewBookingModal(true)}
              onApproveRequest={handleApproveRequest}
            />
          )}

          {activeTab === 'resources' && isTabAllowed('resources', currentRole) && (
            <ResourcesView
              resources={resources}
              onRefresh={fetchAllData}
              onOpenNewBookingWithResource={handleOpenNewBookingWithResource}
            />
          )}

          {activeTab === 'bookings' && isTabAllowed('bookings', currentRole) && (
            <BookingsView
              bookings={bookings}
              onRefresh={fetchAllData}
              onOpenNewBooking={() => setShowNewBookingModal(true)}
            />
          )}

          {activeTab === 'calendar' && isTabAllowed('calendar', currentRole) && (
            <CalendarView
              bookings={bookings}
              resources={resources}
              onOpenNewBookingWithTime={handleOpenNewBookingWithTime}
            />
          )}

          {activeTab === 'approvals' && isTabAllowed('approvals', currentRole) && (
            <ApprovalsView approvals={approvals} onRefresh={fetchAllData} />
          )}

          {activeTab === 'analytics' && isTabAllowed('analytics', currentRole) && (
            <AnalyticsView analytics={analytics} />
          )}

          {activeTab === 'users' && isTabAllowed('users', currentRole) && (
            <UsersView users={users} onRefresh={fetchAllData} />
          )}

          {activeTab === 'settings' && isTabAllowed('settings', currentRole) && (
            <SettingsView organization={organization} onRefresh={fetchAllData} />
          )}

          {activeTab === 'profile' && isTabAllowed('profile', currentRole) && (
            <ProfileView onRefresh={fetchAllData} />
          )}
        </main>
      </div>

      {/* Modals */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {showNewBookingModal && (
        <NewBookingModal
          resources={resources}
          preselectedResourceId={preselectedResource}
          preselectedDate={preselectedDate}
          preselectedTime={preselectedTime}
          onClose={() => setShowNewBookingModal(false)}
          onSuccess={() => {
            fetchAllData();
            refreshData();
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
