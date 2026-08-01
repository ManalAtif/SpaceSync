import React from 'react';
import {
  LayoutDashboard,
  Building2,
  BookmarkCheck,
  Calendar,
  CheckSquare,
  BarChart3,
  Users,
  Settings,
  Sparkles,
  RefreshCw,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isTabAllowed } from '../utils/rbac';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  pendingApprovalsCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  pendingApprovalsCount = 8,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { currentUser, currentRole } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resources', label: 'Resources', icon: Building2 },
    { id: 'bookings', label: 'Bookings', icon: BookmarkCheck },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: CheckSquare,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
    },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const visibleNavItems = navItems.filter((item) => isTabAllowed(item.id, currentRole));

  const handleNavClick = (tabId: string) => {
    onNavigate(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const content = (
    <div className="flex flex-col justify-between h-full min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm shadow-blue-500/20">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">SpaceSync</h1>
              <p className="text-[11px] font-medium text-slate-400 tracking-tight">Enterprise Resource Management</p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Card & Plan Banner */}
      <div className="p-3 space-y-3 mb-4 md:mb-0">
        {currentRole !== 'member' && (
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white p-3.5 rounded-xl shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Enterprise Plan</span>
            </div>
            <p className="text-[11px] text-blue-100/90 mt-1 leading-snug">
              Unlock advanced analytics & multi-site access across campuses.
            </p>
            <button
              onClick={() => handleNavClick('settings')}
              className="mt-2.5 w-full bg-white text-blue-700 hover:bg-blue-50 text-[11px] font-bold py-1.5 px-3 rounded-lg transition-colors text-center"
            >
              Manage Subscription
            </button>
          </div>
        )}

        {/* User Card */}
        <div
          onClick={() => handleNavClick('profile')}
          className="flex items-center gap-3 p-2.5 bg-white border border-slate-200/80 rounded-xl hover:bg-slate-100/60 cursor-pointer transition-colors shadow-2xs"
        >
          <img
            src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser?.name || 'User'}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{currentUser?.name || 'Alex Chen'}</p>
            <p className="text-[10px] font-medium text-slate-400 truncate capitalize">
              {currentRole === 'super_admin' ? 'Global Admin' : currentRole.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-50/90 border-r border-slate-200/80 flex-col justify-between min-h-screen sticky top-0 z-40 shrink-0">
        {content}
      </aside>

      {/* Mobile Slide-over Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative w-72 max-w-[80vw] bg-slate-50 border-r border-slate-200 h-full shadow-2xl z-50 overflow-y-auto">
            {content}
          </aside>
        </div>
      )}
    </>
  );
};

