import React, { useState } from 'react';
import {
  Plus,
  Upload,
  Filter,
  Monitor,
  Projector,
  Wifi,
  Video,
  Power,
  Zap,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Resource, ResourceType, ResourceStatus } from '../types';
import { apiService } from '../services/api';

interface ResourcesViewProps {
  resources: Resource[];
  onRefresh: () => void;
  onOpenNewBookingWithResource: (resourceId: string) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  resources,
  onRefresh,
  onOpenNewBookingWithResource,
}) => {
  const [buildingFilter, setBuildingFilter] = useState('All Buildings');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('Any Status');
  const [searchQuery, setSearchQuery] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [csvImporting, setCsvImporting] = useState(false);

  // New Resource Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<ResourceType>('room');
  const [building, setBuilding] = useState('Tower A, 4th Floor');
  const [floorLocation, setFloorLocation] = useState('4th Floor');
  const [capacity, setCapacity] = useState(10);
  const [accessGroup, setAccessGroup] = useState('All Staff');
  const [requiresApproval, setRequiresApproval] = useState(false);

  const filteredResources = resources.filter((r) => {
    if (buildingFilter !== 'All Buildings' && !r.building.toLowerCase().includes(buildingFilter.toLowerCase())) {
      return false;
    }
    if (typeFilter !== 'All Types' && r.type !== typeFilter.toLowerCase()) {
      return false;
    }
    if (statusFilter !== 'Any Status' && r.status !== statusFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.building.toLowerCase().includes(q) ||
        r.accessGroup.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createResource({
        name: name || 'New Workspace Resource',
        type,
        building,
        floorLocation,
        capacity,
        accessGroup,
        requiresApproval,
        status: 'available',
        amenities: ['projector', 'whiteboard', 'video-conf'],
        photo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
      });
      setShowAddModal(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCSVImport = async () => {
    if (!csvText) return;
    setCsvImporting(true);
    try {
      await apiService.bulkImportCSV(csvText);
      setShowCSVModal(false);
      setCsvText('');
      onRefresh();
    } catch (err) {
      alert('Failed to import CSV: ' + err);
    } finally {
      setCsvImporting(false);
    }
  };

  const renderAmenityIcons = (amenities: string[]) => {
    return (
      <div className="flex items-center gap-1.5 text-slate-500">
        {amenities.includes('monitors') && <Monitor className="w-3.5 h-3.5" title="Monitors" />}
        {amenities.includes('projector') && <Projector className="w-3.5 h-3.5" title="Projector" />}
        {amenities.includes('video-conf') && <Video className="w-3.5 h-3.5" title="Video Conf" />}
        {amenities.includes('power-outlets') && <Power className="w-3.5 h-3.5" title="Power Outlets" />}
        {amenities.includes('av-system') && <Zap className="w-3.5 h-3.5" title="AV System" />}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Directory</span>
            <span>›</span>
            <span className="text-slate-700">Resources</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">Resource Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage and monitor {resources.length} workspace resources across 4 campus buildings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCSVModal(true)}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Bulk Import CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Resource</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources, tags or IDs..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600"
            />
          </div>

          {/* Building Filter */}
          <div>
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl px-3 py-2 focus:outline-hidden focus:border-blue-600"
            >
              <option value="All Buildings">BUILDING: All Buildings</option>
              <option value="Tower A">Tower A</option>
              <option value="Res. Park">Res. Park</option>
              <option value="North Hub">North Hub</option>
              <option value="Conference Center">Conference Center</option>
              <option value="Design Wing">Design Wing</option>
              <option value="Media Suite">Media Suite</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl px-3 py-2 focus:outline-hidden focus:border-blue-600"
            >
              <option value="All Types">RESOURCE TYPE: All Types</option>
              <option value="Room">Meeting Room</option>
              <option value="Desk">Desk / Pod</option>
              <option value="Equipment">Lab / Equipment</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Court">Sports Court</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl px-3 py-2 focus:outline-hidden focus:border-blue-600"
            >
              <option value="Any Status">AVAILABILITY: Any Status</option>
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Out_of_service">Out of Service</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">
            Showing {filteredResources.length} of {resources.length}
          </span>
        </div>
      </div>

      {/* Resources Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200/60">
              <tr>
                <th className="py-3.5 px-4">Photo</th>
                <th className="py-3.5 px-4">Resource Name</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Building</th>
                <th className="py-3.5 px-4">Capacity</th>
                <th className="py-3.5 px-4">Amenities</th>
                <th className="py-3.5 px-4">Access Group</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredResources.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <img
                      src={res.photo}
                      alt={res.name}
                      className="w-12 h-9 object-cover rounded-lg border border-slate-200 shadow-2xs"
                    />
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>
                      <span className="text-sm">{res.name}</span>
                      {res.requiresApproval && (
                        <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 font-bold px-1.5 py-0.5 rounded-md">
                          Requires Approval
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize">
                      {res.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-semibold text-slate-800">{res.building}</span>
                      <span className="block text-[10px] text-slate-400">{res.floorLocation}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{res.capacity} Person</td>
                  <td className="py-3.5 px-4">{renderAmenityIcons(res.amenities)}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                      {res.accessGroup}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        res.status === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : res.status === 'maintenance'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          res.status === 'available'
                            ? 'bg-emerald-600'
                            : res.status === 'maintenance'
                            ? 'bg-amber-600'
                            : 'bg-red-600'
                        }`}
                      ></span>
                      {res.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onOpenNewBookingWithResource(res.id)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                    >
                      Book Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add New Resource</h3>
            <form onSubmit={handleAddResource} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Resource Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Executive Boardroom Alpha"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="room">Room</option>
                    <option value="desk">Desk</option>
                    <option value="equipment">Equipment</option>
                    <option value="vehicle">Vehicle</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Building Location</label>
                <input
                  type="text"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Access Group</label>
                <select
                  value={accessGroup}
                  onChange={(e) => setAccessGroup(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="All Staff">All Staff</option>
                  <option value="R&D Team">R&D Team</option>
                  <option value="Product-Strategy">Product-Strategy</option>
                  <option value="Management">Management</option>
                  <option value="Fleet-Ops">Fleet-Ops</option>
                </select>
              </div>

              <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresApproval}
                  onChange={(e) => setRequiresApproval(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-xs"
                />
                <span>Requires Space Admin Approval</span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  Create Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Bulk Import Modal */}
      {showCSVModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Bulk Import Resources via CSV</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Paste CSV text format containing columns: <code>name, type, building, capacity, accessGroup</code>
            </p>

            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={`name,type,building,capacity,accessGroup\nConference Room B,room,Tower A,12,All Staff\nDesk #404,desk,North Hub,1,Open Access`}
              className="w-full font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCSVModal(false)}
                className="px-4 py-2 font-semibold text-slate-500 hover:bg-slate-100 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCSVImport}
                disabled={csvImporting}
                className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs"
              >
                {csvImporting ? 'Importing...' : 'Upload & Process CSV'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
