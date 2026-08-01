import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  initialOrganization,
  initialUsers,
  initialResources,
  initialBookings,
  initialApprovals,
  initialNotifications,
} from './server/seedData';
import {
  Organization,
  User,
  Resource,
  Booking,
  ApprovalRequest,
  AppNotification,
  ConflictCheckResult,
  AnalyticsSummary,
} from './src/types';

// In-memory data cache synchronized with state
let orgStore: Organization = { ...initialOrganization };
let userStore: User[] = [...initialUsers];
let resourceStore: Resource[] = [...initialResources];
let bookingStore: Booking[] = [...initialBookings];
let approvalStore: ApprovalRequest[] = [...initialApprovals];
let notificationStore: AppNotification[] = [...initialNotifications];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Reset / Seed database endpoint
  app.post('/api/seed', (_req, res) => {
    orgStore = { ...initialOrganization };
    userStore = [...initialUsers];
    resourceStore = [...initialResources];
    bookingStore = [...initialBookings];
    approvalStore = [...initialApprovals];
    notificationStore = [...initialNotifications];
    res.json({ message: 'Database reset and re-seeded successfully', orgStore, resourceCount: resourceStore.length });
  });

  // Organization Settings
  app.get('/api/organization', (_req, res) => {
    res.json(orgStore);
  });

  app.put('/api/organization', (req, res) => {
    const updates = req.body;
    orgStore = { ...orgStore, ...updates };
    res.json({ message: 'Organization updated', organization: orgStore });
  });

  // Resources API
  app.get('/api/resources', (req, res) => {
    const { building, type, availability, search } = req.query;
    let list = [...resourceStore];

    if (building && building !== 'All Buildings') {
      list = list.filter((r) => r.building.toLowerCase().includes(String(building).toLowerCase()));
    }
    if (type && type !== 'All Types') {
      list = list.filter((r) => r.type === String(type).toLowerCase());
    }
    if (availability && availability !== 'Any Status') {
      list = list.filter((r) => r.status === String(availability).toLowerCase());
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.building.toLowerCase().includes(q) ||
          r.accessGroup.toLowerCase().includes(q)
      );
    }

    res.json(list);
  });

  app.post('/api/resources', (req, res) => {
    const data = req.body;
    const newRes: Resource = {
      id: `res-${Date.now()}`,
      orgId: orgStore.id,
      name: data.name || 'New Workspace Resource',
      type: data.type || 'room',
      building: data.building || 'Tower A, 4th Floor',
      floorLocation: data.floorLocation || 'Floor 4',
      capacity: Number(data.capacity) || 4,
      photo: data.photo || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
      amenities: Array.isArray(data.amenities) ? data.amenities : ['whiteboard', 'power-outlets'],
      accessGroup: data.accessGroup || 'All Staff',
      status: data.status || 'available',
      requiresApproval: !!data.requiresApproval,
      bufferMinutes: Number(data.bufferMinutes) || 10,
      createdAt: new Date().toISOString(),
    };

    resourceStore.unshift(newRes);
    res.status(201).json(newRes);
  });

  app.put('/api/resources/:id', (req, res) => {
    const id = req.params.id;
    const idx = resourceStore.findIndex((r) => r.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    resourceStore[idx] = { ...resourceStore[idx], ...req.body };
    res.json(resourceStore[idx]);
  });

  app.delete('/api/resources/:id', (req, res) => {
    const id = req.params.id;
    resourceStore = resourceStore.filter((r) => r.id !== id);
    res.json({ message: 'Resource removed', id });
  });

  // Bulk CSV import for resources
  app.post('/api/resources/bulk-import', (req, res) => {
    const { csvContent } = req.body;
    if (!csvContent || typeof csvContent !== 'string') {
      return res.status(400).json({ error: 'csvContent is required' });
    }

    const lines = csvContent.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      return res.status(400).json({ error: 'CSV must contain a header and at least one data row' });
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const imported: Resource[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      const getVal = (name: string) => {
        const idx = headers.indexOf(name);
        return idx !== -1 ? values[idx] || '' : '';
      };

      const name = getVal('name') || getVal('resourcename') || `Imported Resource ${i}`;
      const typeStr = getVal('type') || 'room';
      const building = getVal('building') || getVal('location') || 'Main Campus';
      const capacity = parseInt(getVal('capacity') || '10', 10);
      const accessGroup = getVal('accessgroup') || getVal('access_group') || 'All Staff';

      const newRes: Resource = {
        id: `res-csv-${Date.now()}-${i}`,
        orgId: orgStore.id,
        name,
        type: (['room', 'desk', 'equipment', 'vehicle', 'court'].includes(typeStr) ? typeStr : 'room') as any,
        building,
        floorLocation: 'Imported Floor',
        capacity,
        photo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
        amenities: ['projector', 'whiteboard'],
        accessGroup,
        status: 'available',
        requiresApproval: false,
        bufferMinutes: 10,
        createdAt: new Date().toISOString(),
      };
      imported.push(newRes);
    }

    resourceStore = [...imported, ...resourceStore];
    res.json({ message: `Successfully imported ${imported.length} resources`, importedCount: imported.length });
  });

  // Conflict detection service function
  const checkConflict = (resourceId: string, startTime: string, endTime: string, excludeBookingId?: string): ConflictCheckResult => {
    const reqStart = new Date(startTime).getTime();
    const reqEnd = new Date(endTime).getTime();

    // Find overlapping active bookings
    const overlapping = bookingStore.filter((b) => {
      if (b.resourceId !== resourceId) return false;
      if (b.status === 'cancelled' || b.status === 'denied') return false;
      if (excludeBookingId && b.id === excludeBookingId) return false;

      const bStart = new Date(b.startTime).getTime();
      const bEnd = new Date(b.endTime).getTime();

      return reqStart < bEnd && reqEnd > bStart;
    });

    if (overlapping.length === 0) {
      return { hasConflict: false, conflictingBookings: [], alternativeSlots: [] };
    }

    // Generate top 3 next available alternate slot suggestions
    const alternatives: { startTime: string; endTime: string }[] = [];
    const durationMs = reqEnd - reqStart;

    // Look in +30m, +1h, +2h, +24h increments
    const offsets = [30 * 60000, 60 * 60000, 120 * 60000, 24 * 3600 * 1000];

    for (const offset of offsets) {
      if (alternatives.length >= 3) break;
      const altStart = reqStart + offset;
      const altEnd = altStart + durationMs;

      // Check if this alt slot conflicts
      const isAltBlocked = bookingStore.some((b) => {
        if (b.resourceId !== resourceId) return false;
        if (b.status === 'cancelled' || b.status === 'denied') return false;
        const bStart = new Date(b.startTime).getTime();
        const bEnd = new Date(b.endTime).getTime();
        return altStart < bEnd && altEnd > bStart;
      });

      if (!isAltBlocked) {
        alternatives.push({
          startTime: new Date(altStart).toISOString(),
          endTime: new Date(altEnd).toISOString(),
        });
      }
    }

    return {
      hasConflict: true,
      conflictingBookings: overlapping,
      alternativeSlots: alternatives,
    };
  };

  // Check conflict API endpoint
  app.post('/api/bookings/check-conflict', (req, res) => {
    const { resourceId, startTime, endTime, excludeBookingId } = req.body;
    if (!resourceId || !startTime || !endTime) {
      return res.status(400).json({ error: 'resourceId, startTime, and endTime are required' });
    }

    const result = checkConflict(resourceId, startTime, endTime, excludeBookingId);
    res.json(result);
  });

  // Bookings API
  app.get('/api/bookings', (req, res) => {
    const { resourceId, status, date } = req.query;
    let list = [...bookingStore];

    if (resourceId) {
      list = list.filter((b) => b.resourceId === String(resourceId));
    }
    if (status) {
      list = list.filter((b) => b.status === String(status));
    }
    if (date) {
      list = list.filter((b) => b.startTime.startsWith(String(date)));
    }

    res.json(list);
  });

  app.post('/api/bookings', (req, res) => {
    const data = req.body;
    const { resourceId, startTime, endTime, title, requesterName, requesterEmail, department, attendeesCount, notes, rrule } = data;

    if (!resourceId || !startTime || !endTime) {
      return res.status(400).json({ error: 'resourceId, startTime, and endTime are required' });
    }

    const resObj = resourceStore.find((r) => r.id === resourceId);
    const resourceName = resObj ? resObj.name : 'Workspace Resource';
    const resourceType = resObj ? resObj.type : 'room';
    const building = resObj ? resObj.building : 'Main Campus';

    // Atomic conflict check
    const conflictResult = checkConflict(resourceId, startTime, endTime);

    if (conflictResult.hasConflict) {
      return res.status(409).json({
        error: 'Booking conflict detected! The selected time slot is already reserved.',
        conflictResult,
      });
    }

    const isApprovalRequired = resObj?.requiresApproval || false;
    const status: any = isApprovalRequired ? 'pending' : 'confirmed';

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      orgId: orgStore.id,
      resourceId,
      resourceName,
      resourceType,
      building,
      requesterId: data.requesterId || 'usr-1',
      requesterName: requesterName || 'Alex Chen',
      requesterEmail: requesterEmail || 'alex.chen@spacesync.io',
      department: department || 'Operations',
      title: title || 'Resource Reservation',
      startTime,
      endTime,
      attendeesCount: Number(attendeesCount) || 1,
      notes: notes || '',
      status,
      isRecurring: !!rrule,
      rrule: rrule || '',
      createdAt: new Date().toISOString(),
    };

    bookingStore.unshift(newBooking);

    // If requires approval, create an approval request automatically
    if (isApprovalRequired) {
      const newApproval: ApprovalRequest = {
        id: `appr-${Date.now()}`,
        orgId: orgStore.id,
        bookingId: newBooking.id,
        requesterName: newBooking.requesterName,
        requesterEmail: newBooking.requesterEmail,
        department: newBooking.department,
        resourceName: newBooking.resourceName,
        resourceId: newBooking.resourceId,
        requestedTime: `${new Date(startTime).toLocaleDateString()} ${new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        startTime,
        endTime,
        priority: 'high',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      approvalStore.unshift(newApproval);
    }

    // Create notification
    notificationStore.unshift({
      id: `notif-${Date.now()}`,
      orgId: orgStore.id,
      userId: newBooking.requesterId,
      title: isApprovalRequired ? 'Booking Request Submitted' : 'Booking Confirmed!',
      message: isApprovalRequired
        ? `Your request for ${resourceName} requires Space Admin approval.`
        : `Your reservation for ${resourceName} is confirmed for ${new Date(startTime).toLocaleDateString()}.`,
      type: isApprovalRequired ? 'approval_request' : 'booking_confirmed',
      read: false,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ booking: newBooking, isApprovalRequired });
  });

  // Check-in endpoint
  app.put('/api/bookings/:id/checkin', (req, res) => {
    const id = req.params.id;
    const idx = bookingStore.findIndex((b) => b.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    bookingStore[idx].status = 'checked_in';
    bookingStore[idx].checkedInAt = new Date().toISOString();

    res.json({ message: 'Successfully checked in!', booking: bookingStore[idx] });
  });

  // Cancel booking endpoint
  app.put('/api/bookings/:id/cancel', (req, res) => {
    const id = req.params.id;
    const idx = bookingStore.findIndex((b) => b.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    bookingStore[idx].status = 'cancelled';
    res.json({ message: 'Booking cancelled', booking: bookingStore[idx] });
  });

  // Admin Override Endpoint
  app.post('/api/bookings/override', (req, res) => {
    const { bookingToCancelId, newBooking } = req.body;
    const cancelIdx = bookingStore.findIndex((b) => b.id === bookingToCancelId);
    if (cancelIdx !== -1) {
      bookingStore[cancelIdx].status = 'cancelled';
      notificationStore.unshift({
        id: `notif-bump-${Date.now()}`,
        orgId: orgStore.id,
        userId: bookingStore[cancelIdx].requesterId,
        title: 'Booking Displaced by Admin Override',
        message: `Your reservation for ${bookingStore[cancelIdx].resourceName} was bumped for an executive priority booking.`,
        type: 'no_show_alert',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    const createdBooking: Booking = {
      id: `bk-override-${Date.now()}`,
      orgId: orgStore.id,
      resourceId: newBooking.resourceId,
      resourceName: newBooking.resourceName || 'Executive Resource',
      resourceType: newBooking.resourceType || 'room',
      building: newBooking.building || 'Tower A',
      requesterId: newBooking.requesterId || 'usr-1',
      requesterName: newBooking.requesterName || 'Alex Chen (Admin)',
      requesterEmail: newBooking.requesterEmail || 'alex.chen@spacesync.io',
      department: newBooking.department || 'Executive',
      title: newBooking.title || 'Executive Priority Meeting',
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      attendeesCount: newBooking.attendeesCount || 5,
      notes: 'Admin Priority Override',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    bookingStore.unshift(createdBooking);
    res.json({ message: 'Admin override completed successfully', createdBooking });
  });

  // Approvals API
  app.get('/api/approvals', (_req, res) => {
    res.json(approvalStore);
  });

  app.post('/api/approvals/:id/action', (req, res) => {
    const id = req.params.id;
    const { action, reason } = req.body; // action: 'approve' | 'deny'
    const idx = approvalStore.findIndex((a) => a.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Approval request not found' });
    }

    const approval = approvalStore[idx];
    approval.status = action === 'approve' ? 'approved' : 'denied';
    approval.reason = reason || '';

    // Update corresponding booking
    const bookingIdx = bookingStore.findIndex((b) => b.id === approval.bookingId);
    if (bookingIdx !== -1) {
      bookingStore[bookingIdx].status = action === 'approve' ? 'confirmed' : 'denied';
      bookingStore[bookingIdx].approvalReason = reason || '';
    }

    // Add notification to requester
    notificationStore.unshift({
      id: `notif-appr-${Date.now()}`,
      orgId: orgStore.id,
      userId: approval.bookingId,
      title: action === 'approve' ? 'Booking Approved!' : 'Booking Request Denied',
      message: `Your booking request for ${approval.resourceName} was ${action === 'approve' ? 'approved' : 'denied'}${reason ? `: ${reason}` : '.'}`,
      type: 'approval_result',
      read: false,
      createdAt: new Date().toISOString(),
    });

    res.json({ message: `Request ${action}d successfully`, approval });
  });

  // Analytics Endpoint
  app.get('/api/analytics', (_req, res) => {
    const totalResources = resourceStore.length || 1;
    const totalBookings = bookingStore.length;
    const checkedInCount = bookingStore.filter((b) => b.status === 'checked_in').length;
    const confirmedCount = bookingStore.filter((b) => b.status === 'confirmed').length;

    const utilizationRate = Math.min(94, Math.round(((confirmedCount + checkedInCount * 1.5) / (totalResources * 5)) * 100));

    // Department Usage Calculation
    const deptCounts: Record<string, number> = {};
    bookingStore.forEach((b) => {
      const d = b.department || 'Operations';
      deptCounts[d] = (deptCounts[d] || 0) + 1;
    });

    const totalDeptBookings = Object.values(deptCounts).reduce((a, b) => a + b, 0) || 1;
    const departmentUsage = [
      { department: 'Engineering', percentage: Math.round(((deptCounts['Engineering'] || 4) / totalDeptBookings) * 100), count: deptCounts['Engineering'] || 4 },
      { department: 'Product Design', percentage: Math.round(((deptCounts['Product Design'] || 3) / totalDeptBookings) * 100), count: deptCounts['Product Design'] || 3 },
      { department: 'Marketing', percentage: Math.round(((deptCounts['Marketing'] || 2) / totalDeptBookings) * 100), count: deptCounts['Marketing'] || 2 },
      { department: 'Operations', percentage: Math.round(((deptCounts['Operations'] || 2) / totalDeptBookings) * 100), count: deptCounts['Operations'] || 2 },
      { department: 'Sales', percentage: Math.round(((deptCounts['Sales'] || 1) / totalDeptBookings) * 100), count: deptCounts['Sales'] || 1 },
    ];

    const analyticsSummary: AnalyticsSummary = {
      utilizationRate: utilizationRate || 84.2,
      totalBookingsMonth: 1482,
      noShowRate: 4.7,
      activeUsersCount: userStore.filter((u) => u.status === 'active').length,
      totalResourcesCount: resourceStore.length,
      pendingApprovalsCount: approvalStore.filter((a) => a.status === 'pending').length,
      departmentUsage,
      mostUsedResources: [
        { id: 'res-5', name: 'Grand Hall A', type: 'room', building: 'Conference Center', usagePercentage: 96 },
        { id: 'res-6', name: 'Creative Studio 2', type: 'room', building: 'Design Wing', usagePercentage: 92 },
        { id: 'res-7', name: 'Podcast Booth 1', type: 'equipment', building: 'Media Suite', usagePercentage: 89 },
      ],
      leastUsedResources: [
        { id: 'res-8', name: 'Quiet Zone C', type: 'desk', building: 'East Wing Basement', usagePercentage: 12, reason: 'Low visibility' },
        { id: 'res-9', name: 'Breakroom Pantry', type: 'room', building: 'Floor 12', usagePercentage: 15, reason: 'Informal space' },
        { id: 'res-10', name: 'Small Booth 4', type: 'desk', building: 'North Hub', usagePercentage: 21, reason: 'Maintenance Required' },
      ],
      heatmapData: [
        [10, 20, 45, 80, 95, 90, 85, 60, 30, 15], // Mon
        [15, 30, 60, 90, 100, 95, 80, 50, 25, 10], // Tue
        [20, 35, 70, 95, 95, 90, 75, 45, 20, 10], // Wed
        [15, 25, 50, 85, 90, 85, 70, 40, 15, 5],  // Thu
        [10, 15, 30, 60, 70, 65, 50, 30, 10, 5],  // Fri
      ],
    };

    res.json(analyticsSummary);
  });

  // Users API
  app.get('/api/users', (_req, res) => {
    res.json(userStore);
  });

  app.post('/api/users', (req, res) => {
    const data = req.body;
    const newUser: User = {
      id: `usr-${Date.now()}`,
      orgId: orgStore.id,
      email: data.email,
      name: data.name,
      role: data.role || 'member',
      department: data.department || 'General',
      jobTitle: data.jobTitle || 'Team Member',
      phone: data.phone || '+1 (555) 000-0000',
      accessGroup: data.accessGroup || 'All Staff',
      status: 'active',
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      lastLogin: 'Just registered',
      createdAt: new Date().toISOString(),
    };

    userStore.unshift(newUser);
    res.status(201).json(newUser);
  });

  app.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const idx = userStore.findIndex((u) => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    userStore[idx] = { ...userStore[idx], ...req.body };
    res.json(userStore[idx]);
  });

  // Notifications API
  app.get('/api/notifications', (_req, res) => {
    res.json(notificationStore);
  });

  app.put('/api/notifications/:id/read', (req, res) => {
    const id = req.params.id;
    const idx = notificationStore.findIndex((n) => n.id === id);
    if (idx !== -1) {
      notificationStore[idx].read = true;
    }
    res.json({ message: 'Marked as read' });
  });

  // Vite Middleware handling for Development & Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });

    
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SpaceSync Server running on http://localhost:${PORT}`);
  });
}

startServer();
