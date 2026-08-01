import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Shield, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [registerType, setRegisterType] = useState<'org' | 'member'>('org');
  const [email, setEmail] = useState('alex.chen@spacesync.io');
  const [password, setPassword] = useState('••••••••••••');
  const [orgName, setOrgName] = useState('SpaceSync Enterprise');
  const [fullName, setFullName] = useState('Alex Chen');
  const [department, setDepartment] = useState('Operations');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      if (registerType === 'org') {
        login({
          name: fullName || 'Alex Chen',
          email: email || 'alex.chen@spacesync.io',
          role: 'super_admin',
          orgId: 'org-spacesync-hq',
          department: 'Executive Operations',
          jobTitle: 'Organization Owner & Admin',
        });
      } else {
        login({
          name: fullName || 'Marcus Thorne',
          email: email || 'm.thorne@spacesync.io',
          role: 'member',
          orgId: 'org-spacesync-hq',
          department: department || 'Engineering',
          jobTitle: 'Team Member',
        });
      }
    } else {
      login({
        name: fullName || 'Alex Chen',
        email: email || 'alex.chen@spacesync.io',
        role: 'super_admin',
        orgId: 'org-spacesync-hq',
        department: 'Operations',
        jobTitle: 'Global Administrative Lead',
      });
    }
  };

  const quickLoginAs = (role: UserRole, name: string, email: string, jobTitle: string, dept: string) => {
    login({
      name,
      email,
      role,
      jobTitle,
      department: dept,
      avatarUrl:
        role === 'super_admin'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
          : role === 'space_admin'
          ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Branding Column */}
        <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 bg-white text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-md">
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold tracking-tight">SpaceSync</span>
            </div>

            <h2 className="text-3xl font-extrabold leading-tight">
              Streamline your <br />
              <span className="text-blue-200">workplace ecosystem.</span>
            </h2>

            <p className="text-xs text-blue-100/90 mt-4 leading-relaxed">
              Manage desks, meeting rooms, and team logistics through a unified enterprise resource management platform designed for the modern hybrid world.
            </p>

            <div className="mt-8 space-y-3">
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/40 rounded-lg flex items-center justify-center text-white">
                  🏢
                </div>
                <div>
                  <h4 className="text-xs font-bold">Campus Management</h4>
                  <p className="text-[10px] text-blue-100">Full real estate visibility</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/40 rounded-lg flex items-center justify-center text-white">
                  📅
                </div>
                <div>
                  <h4 className="text-xs font-bold">Smart Desk Booking</h4>
                  <p className="text-[10px] text-blue-100">Real-time availability & conflict check</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-blue-200/80 mt-6 z-10">
            Trusted by 500+ global enterprise facilities teams.
          </p>

          {/* Decorative Background Circles */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        {/* Right Form Column */}
        <div className="p-8 md:p-10 flex flex-col justify-between overflow-y-auto max-h-[90vh] md:max-h-none">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {isRegister
                    ? registerType === 'org'
                      ? 'Register your organization'
                      : 'Register as Member'
                    : 'Sign in to your organization'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Access your workspace and team resources.</p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Registration Type Switcher (Organization vs Member) */}
            {isRegister && (
              <div className="mb-5 bg-slate-100 p-1 rounded-xl grid grid-cols-2 gap-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setRegisterType('org')}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    registerType === 'org'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🏢 Register Organization</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterType('member')}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    registerType === 'member'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>👤 Register as Member</span>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && registerType === 'org' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Acme Corporation"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
              )}

              {isRegister && registerType === 'member' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Campus</label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. SpaceSync HQ San Francisco"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
              )}

              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Chen"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
              )}

              {isRegister && registerType === 'member' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-colors"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  {!isRegister && (
                    <a href="#" className="text-[11px] font-semibold text-blue-600 hover:underline">
                      Forgot Password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-all duration-150 flex items-center justify-center gap-2 text-xs"
              >
                <span>
                  {isRegister
                    ? registerType === 'org'
                      ? 'Register & Launch Workspace'
                      : 'Register Member Account'
                    : 'Sign In'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">OR CONTINUE WITH</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => quickLoginAs('super_admin', 'Alex Chen (Google)', 'alex.chen@spacesync.io', 'Global Admin', 'Operations')}
                className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-semibold transition-colors"
              >
                <span className="font-bold text-blue-500">G</span> Google
              </button>

              <button
                onClick={() => quickLoginAs('space_admin', 'Sarah Jenkins (MS)', 's.jenkins@spacesync.io', 'Space Admin', 'Marketing')}
                className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-semibold transition-colors"
              >
                <span className="font-bold text-emerald-600">M</span> Microsoft
              </button>
            </div>

            {/* Quick Role Shortcuts for Demo */}
            <div className="mt-5 p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
              <div className="text-[11px] font-bold text-blue-800 flex items-center gap-1 mb-2">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Quick Demo Accounts:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => quickLoginAs('super_admin', 'Alex Chen', 'alex.chen@spacesync.io', 'Global Administrative Lead', 'Operations')}
                  className="bg-white hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-semibold px-2.5 py-1 rounded-md transition-colors"
                >
                  Super Admin
                </button>
                <button
                  type="button"
                  onClick={() => quickLoginAs('space_admin', 'Sarah Jenkins', 's.jenkins@spacesync.io', 'Space Owner', 'Marketing')}
                  className="bg-white hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2.5 py-1 rounded-md transition-colors"
                >
                  Space Admin
                </button>
                <button
                  type="button"
                  onClick={() => quickLoginAs('member', 'Marcus Thorne', 'm.thorne@spacesync.io', 'Principal Engineer', 'Engineering')}
                  className="bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 text-[10px] font-semibold px-2.5 py-1 rounded-md transition-colors"
                >
                  Member
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            {isRegister ? 'Already have an organization?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="font-bold text-blue-600 hover:underline"
            >
              {isRegister ? 'Sign in instead' : 'Register your organization'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
