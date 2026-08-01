import React, { useState } from 'react';
import {
  Building2,
  Clock,
  Globe,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  Lock,
  Sparkles,
  Shield,
  Layers,
} from 'lucide-react';
import { Organization } from '../types';
import { apiService } from '../services/api';

interface SettingsViewProps {
  organization: Organization | null;
  onRefresh: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ organization, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'rules' | 'integrations' | 'security'>('general');

  const [orgName, setOrgName] = useState(organization?.name || 'NexGen Solutions');
  const [timezone, setTimezone] = useState(organization?.timezone || '(GMT-08:00) Pacific Time');
  const [industry, setIndustry] = useState(organization?.industry || 'Technology & Software');
  const [currency, setCurrency] = useState(organization?.currency || 'USD ($)');

  const [businessHours, setBusinessHours] = useState([
    { day: 'Monday', enabled: true, startTime: '09:00 AM', endTime: '06:00 PM' },
    { day: 'Tue - Fri', enabled: true, startTime: '09:00 AM', endTime: '05:00 PM' },
  ]);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiService.updateOrganization({
        name: orgName,
        timezone,
        industry,
        currency,
      });
      alert('Organization settings saved successfully!');
      onRefresh();
    } catch (err) {
      alert('Failed to save settings: ' + err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organization Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your corporate identity, workspace rules, and third-party connections.
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-semibold text-slate-500">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'general' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>General</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'branding' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Branding</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'rules' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Booking Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'integrations' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Integrations</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'security' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security</span>
        </button>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-8 space-y-8 max-w-4xl">
        {/* Core Information Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Core Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-blue-600"
              >
                <option value="(GMT-08:00) Pacific Time">(GMT-08:00) Pacific Time</option>
                <option value="(GMT-05:00) Eastern Time">(GMT-05:00) Eastern Time</option>
                <option value="(GMT+00:00) London / UTC">(GMT+00:00) London / UTC</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-blue-600"
              >
                <option value="Technology & Software">Technology & Software</option>
                <option value="Higher Education & Research">Higher Education & Research</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Healthcare & BioTech">Healthcare & BioTech</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Workspace Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-blue-600"
              >
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Standard Business Hours Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900">Standard Business Hours</h3>
            <button
              onClick={() =>
                setBusinessHours([
                  ...businessHours,
                  { day: 'Saturday', enabled: false, startTime: '10:00 AM', endTime: '04:00 PM' },
                ])
              }
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add exception</span>
            </button>
          </div>

          <div className="space-y-3">
            {businessHours.map((bh, idx) => (
              <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bh.enabled}
                      onChange={(e) => {
                        const copy = [...businessHours];
                        copy[idx].enabled = e.target.checked;
                        setBusinessHours(copy);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <span className="font-bold text-slate-800">{bh.day}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 flex items-center gap-1 text-slate-700 font-semibold">
                    <span>{bh.startTime}</span>
                    <Clock className="w-3 h-3 text-slate-400" />
                  </div>
                  <span className="text-slate-400 font-medium">to</span>
                  <div className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 flex items-center gap-1 text-slate-700 font-semibold">
                    <span>{bh.endTime}</span>
                    <Clock className="w-3 h-3 text-slate-400" />
                  </div>
                </div>

                <button
                  onClick={() => setBusinessHours(businessHours.filter((_, i) => i !== idx))}
                  className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Save Action Bar */}
      <div className="flex items-center justify-end gap-3 max-w-4xl pt-4">
        <button
          onClick={() => onRefresh()}
          className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          Discard Changes
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
  );
};
