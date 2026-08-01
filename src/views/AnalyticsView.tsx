import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Flame,
  AlertCircle,
  Building2,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { AnalyticsSummary } from '../types';

interface AnalyticsViewProps {
  analytics: AnalyticsSummary | null;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics }) => {
  const [range, setRange] = useState<'today' | '7d' | '30d' | 'custom'>('30d');

  const utilRate = analytics?.utilizationRate || 84.2;
  const growth = analytics?.totalBookingsMonth || 1482;
  const noShow = analytics?.noShowRate || 4.7;

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time resource utilization and occupancy insights across all campuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setRange('today')}
              className={`px-3 py-1.5 rounded-lg ${
                range === 'today' ? 'bg-blue-600 text-white' : 'text-slate-600'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setRange('7d')}
              className={`px-3 py-1.5 rounded-lg ${
                range === '7d' ? 'bg-blue-600 text-white' : 'text-slate-600'
              }`}
            >
              7d
            </button>
            <button
              onClick={() => setRange('30d')}
              className={`px-3 py-1.5 rounded-lg ${
                range === '30d' ? 'bg-blue-600 text-white' : 'text-slate-600'
              }`}
            >
              30d
            </button>
            <button
              onClick={() => setRange('custom')}
              className={`px-3 py-1.5 rounded-lg ${
                range === 'custom' ? 'bg-blue-600 text-white' : 'text-slate-600'
              }`}
            >
              Custom
            </button>
          </div>

          <button
            onClick={() => alert('Exporting PDF/CSV analytics report...')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Resource Utilization */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +5.4%
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Resource Utilization
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{utilRate}%</div>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${utilRate}%` }}></div>
          </div>
        </div>

        {/* Booking Growth */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12.8%
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Booking Growth
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{growth}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Bookings made this period</p>
          </div>
        </div>

        {/* No-show Rate */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 rotate-180" /> -2.1%
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              No-show Rate
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{noShow}%</div>
            <p className="text-[11px] text-slate-400 mt-0.5">70 users penalized for missed check-in</p>
          </div>
        </div>
      </div>

      {/* Main Middle Row: Peak Hours Heatmap & Department Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Peak Booking Hours Heatmap (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Peak Booking Hours</h3>
              <p className="text-xs text-slate-500">Occupancy density by day and time</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-slate-100 rounded-xs"></span> LOW
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-600 rounded-xs"></span> PEAK
              </span>
            </div>
          </div>

          <div className="space-y-2 mt-6">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, dIdx) => (
              <div key={dIdx} className="flex items-center gap-3">
                <span className="w-8 text-xs font-bold text-slate-600">{day}</span>
                <div className="flex-1 grid grid-cols-11 gap-1.5">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hIdx) => {
                    const heat = ((dIdx + 1) * (hIdx + 1) * 17) % 100;
                    return (
                      <div
                        key={hIdx}
                        className={`h-7 rounded-md transition-all hover:scale-105 ${
                          heat > 75
                            ? 'bg-blue-600'
                            : heat > 50
                            ? 'bg-blue-400'
                            : heat > 25
                            ? 'bg-blue-200'
                            : 'bg-slate-100'
                        }`}
                        title={`${day} hour ${8 + hIdx}:00 — Occupancy ${heat}%`}
                      ></div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 pt-2 pl-11">
              <span>8AM</span>
              <span>10AM</span>
              <span>12PM</span>
              <span>2PM</span>
              <span>4PM</span>
              <span>6PM</span>
            </div>
          </div>
        </div>

        {/* Department Usage Allocation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">Department Usage</h3>
          <p className="text-xs text-slate-500 mb-6">Allocation by business unit</p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Engineering</span>
                <span>38%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Design</span>
                <span>24%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Marketing</span>
                <span>18%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Operations</span>
                <span>12%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Sales</span>
                <span>8%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: '8%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Most Used vs Least Used Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Used Resources */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Most Used Resources</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Grand Hall A</p>
                <p className="text-[11px] text-slate-400">Conference Center</p>
              </div>
              <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                96% <span className="text-[10px] font-medium text-slate-400 block">Avg Daily</span>
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Creative Studio 2</p>
                <p className="text-[11px] text-slate-400">Design Wing</p>
              </div>
              <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                92% <span className="text-[10px] font-medium text-slate-400 block">Avg Daily</span>
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Podcast Booth 1</p>
                <p className="text-[11px] text-slate-400">Media Suite</p>
              </div>
              <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                89% <span className="text-[10px] font-medium text-slate-400 block">Avg Daily</span>
              </span>
            </div>
          </div>
        </div>

        {/* Least Used Resources */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">Least Used Resources</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Quiet Zone C</p>
                <p className="text-[11px] text-slate-400">East Wing Basement</p>
              </div>
              <span className="text-sm font-extrabold text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                12% <span className="text-[10px] font-medium text-slate-400 block">Avg Daily</span>
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Breakroom Pantry</p>
                <p className="text-[11px] text-slate-400">Floor 12</p>
              </div>
              <span className="text-sm font-extrabold text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                15% <span className="text-[10px] font-medium text-slate-400 block">Avg Daily</span>
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Small Booth 4</p>
                <p className="text-[11px] text-amber-600">Maintenance Required</p>
              </div>
              <span className="text-sm font-extrabold text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                21% <span className="text-[10px] font-medium text-slate-400 block">Avg Daily</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
