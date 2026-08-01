import React, { useState } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  CheckCheck,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { ApprovalRequest } from '../types';
import { apiService } from '../services/api';

interface ApprovalsViewProps {
  approvals: ApprovalRequest[];
  onRefresh: () => void;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({ approvals, onRefresh }) => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'priority' | 'type'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeModalAppr, setActiveModalAppr] = useState<ApprovalRequest | null>(null);
  const [modalAction, setModalAction] = useState<'approve' | 'deny'>('approve');
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const pendingList = approvals.filter((a) => a.status === 'pending');

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleProcess = async () => {
    if (!activeModalAppr) return;
    setProcessing(true);
    try {
      await apiService.processApproval(activeModalAppr.id, modalAction, reason);
      setActiveModalAppr(null);
      setReason('');
      onRefresh();
    } catch (err) {
      alert('Error: ' + err);
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one pending approval request.');
      return;
    }
    setProcessing(true);
    try {
      for (const id of selectedIds) {
        await apiService.processApproval(id, 'approve', 'Bulk approved by Space Admin');
      }
      setSelectedIds([]);
      onRefresh();
    } catch (err) {
      alert('Error bulk approving: ' + err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Top Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Admin</span>
            <span>›</span>
            <span className="text-slate-700">Approvals</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">Approvals Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review and manage pending booking requests across all resources.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Exporting approvals report...')}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Report</span>
          </button>
          <button
            onClick={handleBulkApprove}
            disabled={processing}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-colors flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            <span>{selectedIds.length > 0 ? `Bulk Approve (${selectedIds.length})` : 'Bulk Approve'}</span>
          </button>
        </div>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Pending Approvals
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{pendingList.length || 24}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Requests awaiting review</p>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Approved Today
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">142</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Automated & manual grants</p>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Denied (24h)
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">8</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Rejected due to policy/conflicts</p>
          </div>
          <div className="w-11 h-11 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Approvals Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Table Toolbar Tabs */}
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                selectedTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Requests
            </button>
            <button
              onClick={() => setSelectedTab('priority')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                selectedTab === 'priority' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Priority
            </button>
            <button
              onClick={() => setSelectedTab('type')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                selectedTab === 'type' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Resource Type
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Sort: <span className="font-bold text-slate-800">Latest First ▼</span>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200/60">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === pendingList.length && pendingList.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(pendingList.map((a) => a.id));
                      else setSelectedIds([]);
                    }}
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                </th>
                <th className="py-3 px-4">Requester</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">Requested Time</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {approvals.map((appr) => (
                <tr key={appr.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(appr.id)}
                      onChange={() => toggleSelect(appr.id)}
                      className="w-4 h-4 text-blue-600 rounded-sm"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                        alt={appr.requesterName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{appr.requesterName}</span>
                        <span className="text-[10px] text-slate-400">{appr.requesterEmail}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{appr.department}</td>
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-bold text-slate-900 block">{appr.resourceName}</span>
                      <span className="text-[10px] text-slate-400">Resource ID: {appr.resourceId}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{appr.requestedTime}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        appr.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : appr.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {appr.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        appr.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : appr.status === 'denied'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          appr.status === 'approved'
                            ? 'bg-emerald-600'
                            : appr.status === 'denied'
                            ? 'bg-red-600'
                            : 'bg-amber-600'
                        }`}
                      ></span>
                      {appr.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {appr.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setActiveModalAppr(appr);
                            setModalAction('approve');
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setActiveModalAppr(appr);
                            setModalAction('deny');
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approve / Deny Action Modal */}
      {activeModalAppr && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {modalAction === 'approve' ? 'Approve Booking Request' : 'Deny Booking Request'}
            </h3>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs space-y-1">
              <p>
                <span className="font-bold">Requester:</span> {activeModalAppr.requesterName} (
                {activeModalAppr.department})
              </p>
              <p>
                <span className="font-bold">Resource:</span> {activeModalAppr.resourceName}
              </p>
              <p>
                <span className="font-bold">Requested Time:</span> {activeModalAppr.requestedTime}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason / Note (Optional)
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  modalAction === 'approve'
                    ? 'e.g. Approved. Priority executive meeting granted.'
                    : 'e.g. Denied due to facility maintenance scheduled for that window.'
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModalAppr(null)}
                className="px-4 py-2 font-semibold text-slate-500 hover:bg-slate-100 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcess}
                disabled={processing}
                className={`px-5 py-2 font-bold text-white rounded-xl text-xs shadow-md ${
                  modalAction === 'approve' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {processing ? 'Processing...' : modalAction === 'approve' ? 'Confirm Approval' : 'Confirm Denial'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
