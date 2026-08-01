import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Users,
  CheckSquare,
  TrendingUp,
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { Booking, ApprovalRequest } from '../types';

interface DashboardViewProps {
  bookings: Booking[];
  approvals: ApprovalRequest[];
  onNavigate: (tab: string) => void;
  onOpenNewBooking: () => void;
  onApproveRequest: (id: string, action: 'approve' | 'deny') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  bookings,
  approvals,
  onNavigate,
  onOpenNewBooking,
  onApproveRequest,
}) => {
  const [dateFilter, setDateFilter] = useState<'today' | '7d' | '30d' | 'custom'>('today');

  const pendingApprovals = approvals.filter((a) => a.status === 'pending');

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Date Range Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Welcome back, Alex. Here's what's happening across your resources today.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setDateFilter('today')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              dateFilter === 'today' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateFilter('7d')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              dateFilter === '7d' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 7d
          </button>
          <button
            onClick={() => setDateFilter('30d')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              dateFilter === '30d' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 30d
          </button>
          <button
            onClick={() => setDateFilter('custom')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              dateFilter === 'custom' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Custom Range
          </button>
        </div>
      </div>

      {/* Top Stats Grid (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Managed Resources */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">124</div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Managed Resources</p>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        {/* Today's Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12%</span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">42</div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Today's Bookings</p>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Real-time
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">312</div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Active Users</p>
          </div>
          <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></div>
          <div>
            <span className="text-[11px] font-semibold text-red-600 uppercase tracking-wider">Requires Action</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{pendingApprovals.length || 8}</div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Pending Approvals</p>
          </div>
          <div className="w-11 h-11 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Middle Row: Spline Chart & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resource Utilization Spline Graph (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Resource Utilization</h3>
                <p className="text-xs text-slate-500">Average usage across all campuses (24h period)</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span> Conference Rooms
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></span> Desk Pods
                </span>
              </div>
            </div>

            {/* SVG Spline Chart */}
            <div className="h-48 w-full mt-4 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                {/* Gridlines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />

                {/* Spline Path 1: Conference Rooms (Blue) */}
                <path
                  d="M 0,110 C 80,120 120,70 200,85 C 280,100 340,40 420,55 C 460,62.5 500,90 500,90"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3.5"
                />

                {/* Spline Path 2: Desk Pods (Emerald) */}
                <path
                  d="M 0,130 C 70,100 150,115 220,95 C 290,75 350,65 420,75 C 470,82.5 500,100 500,100"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
              </svg>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2 px-1">
                <span>08:00</span>
                <span>12:00</span>
                <span>16:00</span>
                <span>20:00</span>
                <span>00:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals Side Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Pending Approvals</h3>
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {pendingApprovals.length || 8} New
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {(pendingApprovals.length > 0 ? pendingApprovals.slice(0, 2) : [
                {
                  id: 'appr-demo-1',
                  requesterName: 'Sarah Jenkins',
                  department: 'External Guest Access',
                  resourceName: 'Executive Boardroom',
                  requestedTime: '2m ago',
                },
                {
                  id: 'appr-demo-2',
                  requesterName: 'Liam Taylor',
                  department: 'Executive Boardroom',
                  resourceName: 'Conf Room 402',
                  requestedTime: '15m ago',
                },
              ]).map((a: any) => (
                <div key={a.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{a.requesterName}</p>
                      <p className="text-[10px] text-slate-500">{a.department || a.resourceName}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{a.requestedTime || 'Just now'}</span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => onApproveRequest(a.id, 'approve')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1.5 rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onApproveRequest(a.id, 'deny')}
                      className="flex-1 bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 text-[11px] font-semibold py-1.5 rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('approvals')}
            className="mt-4 w-full border border-slate-200 text-blue-600 hover:bg-blue-50 text-xs font-bold py-2 rounded-xl transition-colors text-center flex items-center justify-center gap-1"
          >
            <span>Go to Approval Center</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Grid: Recent Bookings & Peak Hours / Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Bookings</h3>
            <button
              onClick={() => onNavigate('bookings')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200/60">
                <tr>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Requester</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {bookings.slice(0, 4).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center text-[10px]">
                          R
                        </div>
                        <div>
                          <span>{b.resourceName}</span>
                          <span className="block text-[10px] text-slate-400 font-normal">{b.building}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-slate-800">{b.requesterName}</span>
                        <span className="block text-[10px] text-slate-400">{b.department}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          b.status === 'confirmed' || b.status === 'checked_in'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {b.status === 'confirmed' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {b.status === 'checked_in' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {b.status === 'pending' && <Clock className="w-3 h-3 text-amber-600" />}
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600 p-1">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Peak Hours Heatmap & Notifications */}
        <div className="space-y-6">
          {/* Peak Hours Matrix */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Peak Hours</h3>
            <div className="grid grid-cols-6 gap-1.5 text-center text-[10px] font-semibold text-slate-400">
              <span></span>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
            </div>
            {['9AM', '11AM', '1PM', '3PM', '5PM'].map((timeLabel, rIdx) => (
              <div key={rIdx} className="grid grid-cols-6 gap-1.5 my-1 items-center">
                <span className="text-[10px] font-medium text-slate-400">{timeLabel}</span>
                {[0, 1, 2, 3, 4].map((cIdx) => {
                  const intensity = ((rIdx + cIdx) * 23) % 100;
                  return (
                    <div
                      key={cIdx}
                      className={`h-5 rounded-md transition-colors ${
                        intensity > 70
                          ? 'bg-blue-600'
                          : intensity > 40
                          ? 'bg-blue-400'
                          : intensity > 20
                          ? 'bg-blue-200'
                          : 'bg-slate-100'
                      }`}
                      title={`Occupancy: ${intensity}%`}
                    ></div>
                  );
                })}
              </div>
            ))}
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
              <span>Low Occupancy</span>
              <div className="h-2 w-24 bg-linear-to-r from-slate-100 via-blue-300 to-blue-600 rounded-full"></div>
              <span>High Peak</span>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
              <Bell className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></span>
                <div>
                  <p className="font-bold text-slate-800">System Update Completed</p>
                  <p className="text-[11px] text-slate-500">v2.41 deployed to terminal nodes.</p>
                  <span className="text-[10px] text-slate-400">1 hour ago</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5"></span>
                <div>
                  <p className="font-bold text-slate-800">New Resource Added</p>
                  <p className="text-[11px] text-slate-500">'Level 4 Maker Space' is live.</p>
                  <span className="text-[10px] text-slate-400">5 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
