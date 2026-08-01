import React, { useState } from 'react';
import {
  Search,
  Calendar as CalendarIcon,
  Bell,
  ChevronDown,
  Building2,
  UserCheck,
  Shield,
  CheckCircle2,
  Clock,
  Sparkles,
  Menu,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface HeaderProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenNewBooking?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNavigate,
  onOpenNewBooking,
  onToggleMobileSidebar,
}) => {
  const {
    currentUser,
    currentRole,
    currentCampus,
    searchQuery,
    notifications,
    setSearchQuery,
    setCurrentCampus,
    switchRole,
    logout,
  } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showCampusMenu, setShowCampusMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const campuses = [
    'HQ - San Francisco',
    'HQ Global',
    'HQ - New York',
    'NexGen Solutions (Austin)',
    'London Innovation Center',
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
    super_admin: { label: 'Super Admin', badge: 'Global Admin', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    space_admin: { label: 'Space Admin', badge: 'Space Owner', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
    member: { label: 'Member', badge: 'Member', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    guest: { label: 'Guest', badge: 'Visitor Link', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between shadow-xs gap-2">
      {/* Mobile Hamburger Button + Search Input Bar */}
      <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg shrink-0 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            id="global-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search resources, bookings...`}
            className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-lg pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden transition-all duration-150"
          />
        </div>
      </div>

      {/* Right Tools & Profile */}
      <div className="flex items-center gap-3">
        {/* Date Shortcut Pill */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-medium">
          <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            id="notifications-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Notifications</h4>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 text-xs transition-colors">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 text-blue-600">
                        {n.type === 'booking_confirmed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">{n.title}</p>
                        <p className="text-slate-500 mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Campus Switcher Dropdown */}
        <div className="relative">
          <button
            id="campus-switcher-btn"
            onClick={() => setShowCampusMenu(!showCampusMenu)}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="max-w-[120px] truncate">{currentCampus}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showCampusMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Select Campus Location
              </div>
              {campuses.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCurrentCampus(c);
                    setShowCampusMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                    currentCampus === c ? 'font-semibold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{c}</span>
                  {currentCampus === c && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Role Switcher Pill */}
        <div className="relative">
          <button
            id="role-switcher-btn"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${roleLabels[currentRole].color} transition-colors`}
            title="Switch User Role for Testing"
          >
            <Shield className="w-3 h-3" />
            <span>{roleLabels[currentRole].badge}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Switch Role Context
              </div>
              {(['super_admin', 'space_admin', 'member', 'guest'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                    currentRole === r ? 'font-semibold text-blue-600' : 'text-slate-700'
                  }`}
                >
                  <span>{roleLabels[r].label}</span>
                  {currentRole === r && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile Avatar Button */}
        <div className="relative pl-1 border-l border-slate-200">
          <button
            id="user-profile-header-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200"
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800">{currentUser?.name}</p>
                <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
                  {currentUser?.jobTitle}
                </span>
              </div>
              <button
                onClick={() => {
                  onNavigate('profile');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-slate-400" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => {
                  onNavigate('settings');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-400" />
                <span>Org Settings</span>
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <button
                onClick={() => {
                  logout();
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
