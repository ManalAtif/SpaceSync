import React, { useState } from 'react';
import {
  BookmarkCheck,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Plus,
  Calendar,
  Building2,
  User,
} from 'lucide-react';
import { Booking } from '../types';
import { apiService } from '../services/api';

interface BookingsViewProps {
  bookings: Booking[];
  onRefresh: () => void;
  onOpenNewBooking: () => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  onRefresh,
  onOpenNewBooking,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filtered = bookings.filter((b) => {
    if (statusFilter !== 'All' && b.status !== statusFilter.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.resourceName.toLowerCase().includes(q) ||
        b.requesterName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCheckIn = async (id: string) => {
    setActionLoading(id);
    try {
      await apiService.checkInBooking(id);
      onRefresh();
    } catch (err) {
      alert('Error: ' + err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking reservation?')) return;
    setActionLoading(id);
    try {
      await apiService.cancelBooking(id);
      onRefresh();
    } catch (err) {
      alert('Error: ' + err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Resource Bookings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View active reservations, perform 10-minute check-ins, or manage booking cancellations.
          </p>
        </div>

        <button
          onClick={onOpenNewBooking}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, resource or requester..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['All', 'Confirmed', 'Checked_in', 'Pending', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition-colors capitalize ${
                  statusFilter === st ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-slate-400 font-semibold">Total: {filtered.length} Bookings</span>
      </div>

      {/* Bookings List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200/60">
              <tr>
                <th className="py-3.5 px-4">Reservation Title</th>
                <th className="py-3.5 px-4">Resource</th>
                <th className="py-3.5 px-4">Requester</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>
                      <span className="text-sm">{b.title}</span>
                      {b.isRecurring && (
                        <span className="ml-2 text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-md">
                          Recurring RRULE
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-bold text-slate-800">{b.resourceName}</span>
                      <span className="block text-[10px] text-slate-400">{b.building}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-semibold text-slate-800">{b.requesterName}</span>
                      <span className="block text-[10px] text-slate-400">{b.department}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div>
                      <span className="font-semibold">{new Date(b.startTime).toLocaleDateString()}</span>
                      <span className="block text-[10px] text-slate-400">
                        {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        b.status === 'confirmed' || b.status === 'checked_in'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => handleCheckIn(b.id)}
                          disabled={actionLoading === b.id}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg text-xs transition-colors"
                        >
                          I'm Here (Check In)
                        </button>
                      )}

                      {b.status !== 'cancelled' && b.status !== 'denied' && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          disabled={actionLoading === b.id}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-semibold px-3 py-1 rounded-lg text-xs transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
