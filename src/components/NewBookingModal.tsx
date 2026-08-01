import React, { useState } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle2, Users, FileText, ArrowRight } from 'lucide-react';
import { Resource, ConflictCheckResult } from '../types';
import { apiService } from '../services/api';

interface NewBookingModalProps {
  resources: Resource[];
  preselectedResourceId?: string;
  preselectedDate?: string;
  preselectedTime?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
  resources,
  preselectedResourceId,
  preselectedDate,
  preselectedTime,
  onClose,
  onSuccess,
}) => {
  const [resourceId, setResourceId] = useState<string>(preselectedResourceId || (resources[0]?.id || ''));
  const [title, setTitle] = useState<string>('Team Strategy & Sync');
  const [date, setDate] = useState<string>(preselectedDate || new Date().toISOString().split('T')[0]);
  const [startTimeStr, setStartTimeStr] = useState<string>(preselectedTime || '14:00');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [attendeesCount, setAttendeesCount] = useState<number>(4);
  const [notes, setNotes] = useState<string>('AV equipment & whiteboard needed');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurrenceFreq, setRecurrenceFreq] = useState<string>('WEEKLY');

  const [loading, setLoading] = useState<boolean>(false);
  const [conflictResult, setConflictResult] = useState<ConflictCheckResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedResource = resources.find((r) => r.id === resourceId);

  // Calculate UTC ISO start and end strings
  const getISOStartEnd = () => {
    const startDateTime = new Date(`${date}T${startTimeStr}:00`);
    const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);
    return {
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
    };
  };

  const handleCheckConflict = async () => {
    if (!resourceId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const { startTime, endTime } = getISOStartEnd();
      const res = await apiService.checkConflict(resourceId, startTime, endTime);
      setConflictResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to check conflict');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceId) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const { startTime, endTime } = getISOStartEnd();
      const rrule = isRecurring ? `FREQ=${recurrenceFreq};COUNT=8` : undefined;

      await apiService.createBooking({
        resourceId,
        startTime,
        endTime,
        title,
        attendeesCount,
        notes,
        rrule,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.message?.includes('conflict')) {
        handleCheckConflict();
      }
      setErrorMsg(err.message || 'Failed to complete booking');
    } finally {
      setLoading(false);
    }
  };

  const selectAltSlot = (altStart: string) => {
    const d = new Date(altStart);
    setDate(d.toISOString().split('T')[0]);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    setStartTimeStr(`${hh}:${mm}`);
    setConflictResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Reserve Workspace Resource</h3>
              <p className="text-[11px] text-slate-500">Real-time conflict detection active</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">
            ✕
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Conflict Warning & One-Click Alternatives Box */}
          {conflictResult?.hasConflict && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Conflict Detected! Resource is booked during this time.</span>
              </div>
              <p className="text-amber-700 text-[11px]">
                Top available alternative time slots for this resource:
              </p>
              <div className="space-y-1.5">
                {conflictResult.alternativeSlots.map((slot, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => selectAltSlot(slot.startTime)}
                    className="w-full bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-semibold py-1.5 px-3 rounded-lg text-left flex items-center justify-between transition-colors"
                  >
                    <span>
                      {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (
                      {new Date(slot.startTime).toLocaleDateString()})
                    </span>
                    <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-md font-bold">
                      Select
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Select Resource */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Resource</label>
            <select
              value={resourceId}
              onChange={(e) => {
                setResourceId(e.target.value);
                setConflictResult(null);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-hidden focus:border-blue-600"
            >
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.type.toUpperCase()}) — {r.building} [Cap: {r.capacity}]
                </option>
              ))}
            </select>
          </div>

          {selectedResource?.requiresApproval && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 text-[11px] p-2.5 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Note: This resource requires Space Admin approval upon booking.</span>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reservation Title / Purpose</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q3 Executive Planning Session"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600"
            />
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setConflictResult(null);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={startTimeStr}
                onChange={(e) => {
                  setStartTimeStr(e.target.value);
                  setConflictResult(null);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600"
              />
            </div>
          </div>

          {/* Duration & Attendees Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
              <select
                value={durationMinutes}
                onChange={(e) => {
                  setDurationMinutes(Number(e.target.value));
                  setConflictResult(null);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600"
              >
                <option value={30}>30 Minutes</option>
                <option value={60}>1 Hour</option>
                <option value={90}>1.5 Hours</option>
                <option value={120}>2 Hours</option>
                <option value={240}>Half Day (4 hrs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Attendees Count</label>
              <input
                type="number"
                min={1}
                max={selectedResource?.capacity || 200}
                value={attendeesCount}
                onChange={(e) => setAttendeesCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600"
              />
            </div>
          </div>

          {/* Recurring Option Toggle */}
          <div className="border-t border-slate-100 pt-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500"
              />
              <span>Recurring Reservation (RRULE)</span>
            </label>

            {isRecurring && (
              <div className="mt-2.5 grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Frequency</label>
                  <select
                    value={recurrenceFreq}
                    onChange={(e) => setRecurrenceFreq(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg text-xs py-1.5 px-2"
                  >
                    <option value="DAILY">Every Day</option>
                    <option value="WEEKLY">Every Week</option>
                    <option value="MONTHLY">Every Month</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Duration</label>
                  <span className="text-xs font-semibold text-slate-700 block mt-1.5">8 occurrences</span>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Equipment Request</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please ensure 2 HDMI cables and whiteboard markers are available."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCheckConflict}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              Verify Conflict
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              <span>{loading ? 'Processing...' : 'Confirm Booking'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
