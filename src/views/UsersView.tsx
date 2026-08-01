import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Edit2,
  CheckCircle2,
  Clock,
  Search,
  MoreVertical,
} from 'lucide-react';
import { User, UserRole } from '../types';
import { apiService } from '../services/api';

interface UsersViewProps {
  users: User[];
  onRefresh: () => void;
}

export const UsersView: React.FC<UsersViewProps> = ({ users, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [roleFilter, setRoleFilter] = useState('All Roles');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [department, setDepartment] = useState('Engineering');
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [accessGroup, setAccessGroup] = useState('All Staff');
  const [creating, setCreating] = useState(false);

  const filtered = users.filter((u) => {
    if (deptFilter !== 'All Departments' && u.department !== deptFilter) return false;
    if (roleFilter !== 'All Roles' && u.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.accessGroup.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await apiService.createUser({
        name,
        email,
        role,
        department,
        jobTitle,
        accessGroup,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
      setShowCreateModal(false);
      setName('');
      setEmail('');
      onRefresh();
    } catch (err) {
      alert('Error: ' + err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage employee access, roles, and organizational permissions.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create User</span>
        </button>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Users</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">1,284</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">↗ 12% from last month</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Now</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">412</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">● Real-time usage</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending Invites</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">18</div>
          <p className="text-[11px] text-slate-400 mt-1">✉ Awaiting verification</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Deactivated</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">42</div>
          <p className="text-[11px] text-slate-400 mt-1">⟳ Archive storage</p>
        </div>
      </div>

      {/* Filter Toolbar & Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name, email or access group..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl px-3 py-2"
            >
              <option value="All Departments">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Legal">Legal</option>
              <option value="Operations">Operations</option>
              <option value="Marketing">Marketing</option>
            </select>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl px-3 py-2"
            >
              <option value="All Roles">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="space_admin">Space Admin</option>
              <option value="member">Member</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200/60">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Access Group</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{u.name}</span>
                        <span className="text-[10px] text-slate-400">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{u.department}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800">{u.jobTitle}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                      {u.accessGroup}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{u.lastLogin || 'Recent'}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-slate-400">
                      <button className="hover:text-slate-600 p-1">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="hover:text-slate-600 p-1">
                        <Shield className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Team Member</h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Marcus Thorne"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m.thorne@company.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role Permission</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="member">Member</option>
                    <option value="space_admin">Space Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Access Group</label>
                  <select
                    value={accessGroup}
                    onChange={(e) => setAccessGroup(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="All Staff">All Staff</option>
                    <option value="Global-Cloud-Arch">Global-Cloud-Arch</option>
                    <option value="Product-Strategy">Product-Strategy</option>
                    <option value="Corporate-Compliance">Corporate-Compliance</option>
                    <option value="Fleet-Ops">Fleet-Ops</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  {creating ? 'Adding...' : 'Add User & Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
