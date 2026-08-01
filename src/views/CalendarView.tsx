import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Users,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Booking, Resource } from '../types';

interface CalendarViewProps {
  bookings: Booking[];
  resources: Resource[];
  onOpenNewBookingWithTime: (date: string, time: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  bookings,
  resources,
  onOpenNewBookingWithTime,
}) => {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [currentMonth, setCurrentMonth] = useState('October 2023');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'meeting_rooms',
    'study_spaces',
    'event_halls',
    'shared_desks',
  ]);

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const hours = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];

  const days = [
    { dayName: 'MON', dayNum: '14' },
    { dayName: 'TUE', dayNum: '15' },
    { dayName: 'WED', dayNum: '16' },
    { dayName: 'THU', dayNum: '17' },
    { dayName: 'FRI', dayNum: '18' },
    { dayName: 'SAT', dayNum: '19' },
    { dayName: 'SUN', dayNum: '20' },
  ];

  // Static sample calendar event blocks matching screenshot
  const sampleEvents = [
    {
      dayIdx: 1, // TUE
      hourIdx: 1, // 09:00 AM
      span: 1.5,
      title: 'Boardroom Alpha',
      subtitle: 'Marketing Sync • Sarah Jenkins',
      bg: 'bg-blue-100 border-l-4 border-blue-600 text-blue-900',
    },
    {
      dayIdx: 3, // THU
      hourIdx: 1, // 09:00 AM
      span: 1,
      title: 'Main Lobby',
      subtitle: 'Client Reception • Global Ent.',
      bg: 'bg-red-100 border-l-4 border-red-500 text-red-900',
    },
    {
      dayIdx: 2, // WED
      hourIdx: 3, // 11:00 AM
      span: 1.5,
      title: 'Quiet Pod #4',
      subtitle: 'Deep Work Session • Michael R.',
      bg: 'bg-emerald-100 border-l-4 border-emerald-600 text-emerald-900',
    },
    {
      dayIdx: 4, // FRI
      hourIdx: 2, // 10:00 AM
      span: 2,
      title: 'Conference Hall B',
      subtitle: 'Annual Review • All Staff',
      bg: 'bg-indigo-100 border-l-4 border-indigo-600 text-indigo-900',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Top Calendar Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Global Booking Calendar</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time interactive schedule grid across all campuses and departments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Today + Arrows */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
            <button className="px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg">
              Today
            </button>
            <button className="p-1 text-slate-500 hover:bg-slate-100 rounded-lg">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 text-slate-500 hover:bg-slate-100 rounded-lg">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-sm font-bold text-slate-800">{currentMonth}</span>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                viewMode === 'day' ? 'bg-blue-600 text-white' : 'text-slate-600'
              }`}
            >
              DAY
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                viewMode === 'week' ? 'bg-blue-600 text-white' : 'text-slate-600'
              }`}
            >
              WEEK
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                viewMode === 'month' ? 'bg-blue-600 text-white' : 'text-slate-600'
              }`}
            >
              MONTH
            </button>
          </div>

          <button
            onClick={() => onOpenNewBookingWithTime(new Date().toISOString().split('T')[0], '10:00')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Filter Sidebar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
          {/* Mini Month Grid */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-3">
              <span>October 2023</span>
              <div className="flex gap-1 text-slate-400">
                <button className="p-1 hover:text-slate-600">‹</button>
                <button className="p-1 hover:text-slate-600">›</button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-700 mt-2">
              <span className="text-slate-300">25</span>
              <span className="text-slate-300">26</span>
              <span className="text-slate-300">27</span>
              <span className="text-slate-300">28</span>
              <span className="text-slate-300">29</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
              <span>9</span>
              <span>10</span>
              <span>11</span>
              <span>12</span>
              <span>13</span>
              <span className="bg-blue-600 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center mx-auto">14</span>
              <span>15</span>
              <span>16</span>
              <span>17</span>
              <span>18</span>
              <span>19</span>
              <span>20</span>
              <span>21</span>
              <span>22</span>
              <span>23</span>
            </div>
          </div>

          {/* Categories Checkboxes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">CATEGORIES</h4>
            <div className="space-y-2.5 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes('meeting_rooms')}
                    onChange={() => toggleCategory('meeting_rooms')}
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                  <span className="font-semibold text-slate-700">Meeting Rooms</span>
                </div>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  12
                </span>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes('study_spaces')}
                    onChange={() => toggleCategory('study_spaces')}
                    className="w-4 h-4 text-emerald-600 rounded-sm"
                  />
                  <span className="font-semibold text-slate-700">Study Spaces</span>
                </div>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  08
                </span>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes('event_halls')}
                    onChange={() => toggleCategory('event_halls')}
                    className="w-4 h-4 text-red-600 rounded-sm"
                  />
                  <span className="font-semibold text-slate-700">Event Halls</span>
                </div>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  03
                </span>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes('shared_desks')}
                    onChange={() => toggleCategory('shared_desks')}
                    className="w-4 h-4 text-slate-600 rounded-sm"
                  />
                  <span className="font-semibold text-slate-700">Shared Desks</span>
                </div>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  45
                </span>
              </label>
            </div>
          </div>

          {/* Syncing Indicator */}
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-xs">
            <span className="font-bold text-blue-900 block">Syncing with Teams</span>
            <p className="text-[11px] text-blue-700 mt-0.5">AI Smart-Scheduling is active for your group (+12 synced).</p>
          </div>
        </div>

        {/* Right Calendar Grid (3 Cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <div className="min-w-[650px]">
              {/* Calendar Days Header */}
              <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50 text-center py-3 text-xs font-bold text-slate-700">
                <div className="text-slate-400 font-normal">GMT-8</div>
                {days.map((d, i) => (
                  <div key={i} className={d.dayNum === '15' ? 'text-blue-600 font-extrabold' : ''}>
                    <span className="block text-[10px] text-slate-400 font-semibold">{d.dayName}</span>
                    <span className="text-sm">{d.dayNum}</span>
                  </div>
                ))}
              </div>

              {/* Hourly Rows */}
              <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[600px]">
                {hours.map((h, hIdx) => (
                  <div key={hIdx} className="grid grid-cols-8 min-h-[52px] relative group hover:bg-slate-50/50">
                    {/* Time Label Column */}
                    <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 border-r border-slate-100">
                      {h}
                    </div>

                    {/* 7 Day Slots */}
                    {days.map((d, dIdx) => {
                      // Check if an event falls in this cell
                      const ev = sampleEvents.find((e) => e.dayIdx === dIdx && e.hourIdx === hIdx);

                      return (
                        <div
                          key={dIdx}
                          onClick={() =>
                            onOpenNewBookingWithTime(
                              `2023-10-${d.dayNum}`,
                              h.replace(' AM', '').replace(' PM', '')
                            )
                          }
                          className="border-r border-slate-100 p-1 relative cursor-pointer hover:bg-blue-50/30 transition-colors"
                        >
                          {ev && (
                            <div
                              className={`p-2 rounded-lg ${ev.bg} shadow-2xs text-[11px] font-semibold overflow-hidden z-10`}
                            >
                              <p className="font-bold leading-tight">{ev.title}</p>
                              <p className="text-[10px] opacity-80 truncate mt-0.5">{ev.subtitle}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
