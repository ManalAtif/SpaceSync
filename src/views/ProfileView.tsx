import React, { useState } from 'react';
import { Camera, Edit3, Shield, Bell, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileViewProps {
  onRefresh: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onRefresh }) => {
  const { currentUser, updateUserProfile } = useAuth();

  const [fullName, setFullName] = useState(currentUser?.name || 'Alex Chen');
  const [email, setEmail] = useState(currentUser?.email || 'alex.chen@spacesync.io');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 902-1234');
  const [department, setDepartment] = useState(currentUser?.department || 'Operations');
  const [jobTitle, setJobTitle] = useState(currentUser?.jobTitle || 'Global Administrative Lead');

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile({
        name: fullName,
        email,
        phone,
        department,
        jobTitle,
      });
      alert('Profile updated successfully!');
      onRefresh();
    } catch (err) {
      alert('Failed to update profile: ' + err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Top Banner & Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
              alt={fullName}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-50 border-2 border-white shadow-md"
            />
            <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full shadow-md transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{fullName}</h1>
            <p className="text-xs text-slate-500 font-medium">Global Admin</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="bg-blue-100 text-blue-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                ENTERPRISE
              </span>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                {department}
              </span>
            </div>
          </div>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-colors flex items-center gap-2">
          <Edit3 className="w-4 h-4" />
          <span>Edit Public Profile</span>
        </button>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sub-nav */}
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'profile' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'notifications' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'security' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </button>
        </div>

        {/* Right Form Card (3 Cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Profile Information</h3>
            <p className="text-xs text-slate-500 mt-0.5">Update your personal details and organizational role.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800"
                >
                  <option value="Operations">Operations</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => onRefresh()}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
