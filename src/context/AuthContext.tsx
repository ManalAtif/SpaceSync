import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AppNotification, Organization } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole;
  currentCampus: string;
  searchQuery: string;
  notifications: AppNotification[];
  organization: Organization | null;
  isAuthenticated: boolean;
  showAuthModal: boolean;
  showLandingPage: boolean;
  setSearchQuery: (q: string) => void;
  setCurrentCampus: (campus: string) => void;
  switchRole: (role: UserRole) => void;
  login: (user: Partial<User>) => void;
  logout: () => void;
  setShowAuthModal: (show: boolean) => void;
  setShowLandingPage: (show: boolean) => void;
  refreshData: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const defaultUser: User = {
  id: 'usr-1',
  orgId: 'org-spacesync-hq',
  email: 'alex.chen@spacesync.io',
  name: 'Alex Chen',
  role: 'super_admin',
  department: 'Operations',
  jobTitle: 'Global Administrative Lead',
  phone: '+1 (555) 902-1234',
  accessGroup: 'Global-Cloud-Arch',
  status: 'active',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  lastLogin: 'Just now',
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(defaultUser);
  const [currentRole, setCurrentRole] = useState<UserRole>('super_admin');
  const [currentCampus, setCurrentCampus] = useState<string>('HQ - San Francisco');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showLandingPage, setShowLandingPage] = useState<boolean>(false);

  const refreshData = async () => {
    try {
      const org = await apiService.getOrganization();
      setOrganization(org);
      const notifs = await apiService.getNotifications();
      setNotifications(notifs);
    } catch (err) {
      console.warn('API sync warning:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (currentUser) {
      setCurrentUser({ ...currentUser, role });
    }
  };

  const login = (userData: Partial<User>) => {
    const u: User = {
      id: userData.id || `usr-${Date.now()}`,
      orgId: userData.orgId || 'org-spacesync-hq',
      email: userData.email || 'user@spacesync.io',
      name: userData.name || 'Workspace User',
      role: userData.role || 'member',
      department: userData.department || 'Operations',
      jobTitle: userData.jobTitle || 'Team Member',
      phone: userData.phone || '+1 (555) 000-0000',
      accessGroup: userData.accessGroup || 'All Staff',
      status: 'active',
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      lastLogin: 'Just now',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(u);
    setCurrentRole(u.role);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setShowLandingPage(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setShowLandingPage(true);
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!currentUser) return;
    try {
      const updated = await apiService.updateUser(currentUser.id, updates);
      setCurrentUser(updated);
    } catch {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        currentCampus,
        searchQuery,
        notifications,
        organization,
        isAuthenticated,
        showAuthModal,
        showLandingPage,
        setSearchQuery,
        setCurrentCampus,
        switchRole,
        login,
        logout,
        setShowAuthModal,
        setShowLandingPage,
        refreshData,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
