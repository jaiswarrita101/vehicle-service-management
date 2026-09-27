/**
 * Vehicle Service Management System (VSMS) - Unified Dashboard Controllers
 */

// ==========================================
// 1. CUSTOMER DASHBOARD CONTROLLER
// ==========================================
function initCustomerDashboard() {
  const user = checkAuthGuard('customer');
  if (!user) return;

  renderDashboardHeader(user);

  const vehicles = window.DB.getVehicles(user.id);
  const bookings = window.DB.getBookings({ customerId: user.id });
  const invoices = window.DB.getInvoices({ customerId: user.id });
  const reminders = window.DB.getReminders(user.id);

  // 1. Update Metric Cards
  const activeCount = bookings.filter(b => b.status !== 'Completed' && b.status !== 'Cancelled').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;
  const pendingInvoices = invoices.filter(i => i.paymentStatus === 'Pending');
  const pendingPayTotal = pendingInvoices.reduce((sum, i) => sum + i.grandTotal, 0);

  const statVehicles = document.getElementById('stat-cust-vehicles');
  const statActive = document.getElementById('stat-cust-active');
  const statCompleted = document.getElementById('stat-cust-completed');
  const statPending = document.getElementById('stat-cust-pending-pay');

  if (statVehicles) statVehicles.textContent = vehicles.length;
  if (statActive) statActive.textContent = activeCount;
  if (statCompleted) statCompleted.textContent = completedCount;
  if (statPending) statPending.textContent = formatCurrency(pendingPayTotal);

  // 2. Render Reminders Banner
  renderCustomerReminders(reminders);

  // 3. Render Active Live Service Tracker
  const activeBooking = bookings.find(b => b.status !== 'Completed' && b.status !== 'Cancelled');
  renderCustomerActiveTracker(activeBooking);

  // 4. Render My Vehicles Grid
  renderVehicleGrid('cust-vehicles-container', user.id);

  // 5. Render Service History Table
  renderCustomerHistoryTable(bookings);

  // 6. Render Pending Invoices Section
  renderCustomerInvoices(invoices);
}

function renderCustomerReminders(reminders) {
  const container = document.getElementById('cust-reminders-container');
  if (!container) return;

  if (reminders.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = reminders.map(r => `
    <div class="reminder-card">
      <div class="reminder-content">
        <i class="fa-solid fa-triangle-exclamation reminder-icon"></i>
        <div>
          <h4 style="font-size: 0.95rem; margin-bottom: 0.15rem; color: #92400e;">${r.title}</h4>
          <p style="margin: 0; font-size: 0.85rem; color: #78350f;">${r.message} (Due by: <b>${formatDate(r.dueDate)}</b>)</p>
        </div>
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <a href="booking.html?vehicleId=${r.vehicleId}" class="btn btn-primary btn-sm">
          <i class="fa-solid fa-calendar-plus"></i> Book Now
        </a>
        <button class="btn btn-secondary btn-sm" onclick="dismissReminderAction('${r.id}')" title="Dismiss">
          &times;
        </button>
      </div>
    </div>
  `).join('');
}

function dismissReminderAction(remId) {
  window.DB.dismissReminder(remId);
  initCustomerDashboard();
  showToast('Reminder dismissed', 'info');
}

function renderCustomerActiveTracker(booking) {
  const container = document.getElementById('cust-active-tracker-container');
  if (!container) return;

  if (!booking) {
    container.innerHTML = `
      <div class="dashboard-card">
        <div class="dashboard-card-body text-center" style="padding: 2.5rem;">
          <i class="fa-solid fa-circle-check text-success" style="font-size: 3rem; margin-bottom: 0.75rem;"></i>
          <h3>No Ongoing Services Right Now</h3>
          <p class="text-muted">Your vehicles are in top mechanical condition. Need regular maintenance or checkup?</p>
          <a href="booking.html" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-calendar-plus"></i> Book New Service Appointment
          </a>
        </div>
      </div>
    `;
    return;
  }

  const stages = [
    'Booked',
    'Vehicle Received',
    'Inspection',
    'Job Card Created',
    'Technician Assigned',
    'Repair/Service In Progress',
    'Quality Check',
    'Ready for Delivery',
    'Completed'
  ];

  const currentIdx = stages.indexOf(booking.status);
  const pct = Math.max(0, Math.min(100, (currentIdx / (stages.length - 1)) * 100));

  container.innerHTML = `
    <div class="dashboard-card">
      <div class="dashboard-card-header">
        <h3><i class="fa-solid fa-truck-fast text-accent"></i> Live Service Progress: ${booking.vehicleModel} (${booking.vehicleNo})</h3>
        <div>Booking #${booking.bookingId} • ${getStatusBadge(booking.status)}</div>
      </div>
      <div class="dashboard-card-body">
        <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem; background: var(--bg-main); padding: 1rem; border-radius: var(--radius-md);">
          <div>
            <span class="text-muted" style="font-size: 0.75rem; text-transform: uppercase;">Scheduled Date</span>
            <div style="font-weight: 700;">${formatDate(booking.preferredDate)} at ${booking.timeSlot}</div>
          </div>
          <div>
            <span class="text-muted" style="font-size: 0.75rem; text-transform: uppercase;">Workshop Location</span>
            <div style="font-weight: 700;">${booking.serviceCenter}</div>
          </div>
          <div>
            <span class="text-muted" style="font-size: 0.75rem; text-transform: uppercase;">Estimated Total</span>
            <div style="font-weight: 800; color: var(--primary);">${formatCurrency(booking.estimatedCost)}</div>
          </div>
        </div>

        <div class="stepper-timeline" style="margin: 2rem 0;">
          <div class="stepper-timeline-progress" style="width: ${pct}%;"></div>
          ${stages.map((stg, i) => `
            <div class="step-node ${i < currentIdx ? 'completed' : (i === currentIdx ? 'active' : '')}">
              <div class="step-circle">
                ${i < currentIdx ? '<i class="fa-solid fa-check"></i>' : (i + 1)}
              </div>
              <div class="step-label">${stg}</div>
            </div>
          `).join('')}
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
          <a href="track-service.html?id=${booking.bookingId}" class="btn btn-outline btn-sm">
            <i class="fa-solid fa-location-crosshairs"></i> View Detailed Live Tracking
          </a>
          ${booking.invoiceId ? `
            <a href="invoice.html?id=${booking.invoiceId}" class="btn btn-success btn-sm">
              <i class="fa-solid fa-file-invoice-dollar"></i> View Invoice
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderCustomerHistoryTable(bookings) {
  const tbody = document.getElementById('cust-history-table-body');
  if (!tbody) return;

  if (bookings.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">No service history records yet</td></tr>';
    return;
  }

  tbody.innerHTML = bookings.map(b => `
    <tr>
      <td><b>#${b.bookingId}</b></td>
      <td>
        <span class="license-plate" style="font-size: 0.75rem;">${b.vehicleNo}</span>
        <div style="font-size: 0.85rem; font-weight: 600;">${b.vehicleModel}</div>
      </td>
      <td>${b.serviceNames.join(', ')}</td>
      <td>${formatDate(b.preferredDate)}</td>
      <td>${getStatusBadge(b.status)}</td>
      <td class="text-right">
        <div style="display: flex; gap: 0.35rem; justify-content: flex-end;">
          <a href="track-service.html?id=${b.bookingId}" class="btn btn-secondary btn-sm" title="Track / View Details">
            <i class="fa-solid fa-eye"></i>
          </a>
          ${b.invoiceId ? `
            <a href="invoice.html?id=${b.invoiceId}" class="btn btn-secondary btn-sm text-accent" title="Invoice">
              <i class="fa-solid fa-receipt"></i>
            </a>
          ` : ''}
          ${b.status !== 'Completed' && b.status !== 'Cancelled' ? `
            <button onclick="cancelAndFreeSlot('${b.bookingId}')" class="btn btn-secondary btn-sm text-danger" title="Cancel Booking & Free Slot">
              <i class="fa-solid fa-ban"></i>
            </button>
          ` : ''}
          <a href="booking.html?vehicleId=${b.vehicleId}" class="btn btn-primary btn-sm" title="Re-book Slot / Book Again">
            <i class="fa-solid fa-repeat"></i> Re-book
          </a>
        </div>
      </td>
    </tr>
  `).join('');
}

function cancelAndFreeSlot(bookingId) {
  if (confirm(`Are you sure you want to cancel booking #${bookingId} and free up the reserved workshop slot?`)) {
    window.DB.updateBookingStatus(bookingId, 'Cancelled');
    showToast(`Booking #${bookingId} cancelled. Time slot is now free!`, 'success');
    initCustomerDashboard();
  }
}

function renderCustomerInvoices(invoices) {
  const tbody = document.getElementById('cust-invoices-table-body');
  if (!tbody) return;

  if (invoices.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">No invoice records found</td></tr>';
    return;
  }

  tbody.innerHTML = invoices.map(inv => `
    <tr>
      <td><b>#${inv.invoiceId}</b></td>
      <td>${inv.vehicleModel} (${inv.vehicleNo})</td>
      <td>${formatDate(inv.createdAt)}</td>
      <td class="font-bold">${formatCurrency(inv.grandTotal)}</td>
      <td>${getStatusBadge(inv.paymentStatus)}</td>
      <td class="text-right">
        <a href="invoice.html?id=${inv.invoiceId}" class="btn ${inv.paymentStatus === 'Pending' ? 'btn-success' : 'btn-secondary'} btn-sm">
          ${inv.paymentStatus === 'Pending' ? '<i class="fa-solid fa-credit-card"></i> Pay Now' : '<i class="fa-solid fa-receipt"></i> View'}
        </a>
      </td>
    </tr>
  `).join('');
}

// ==========================================
// 2. SERVICE ADVISOR DASHBOARD CONTROLLER
// ==========================================
function initAdvisorDashboard() {
  const user = checkAuthGuard('advisor');
  if (!user) return;

  renderDashboardHeader(user);

  const bookings = window.DB.getBookings();
  const jobCards = window.DB.getJobCards();

  // Stats
  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = bookings.filter(b => b.preferredDate === today);
  const pendingArrivals = bookings.filter(b => b.status === 'Booked');
  const activeJobs = jobCards.filter(j => j.status !== 'Completed');

  const statToday = document.getElementById('stat-adv-today');
  const statArrivals = document.getElementById('stat-adv-arrivals');
  const statActiveJobs = document.getElementById('stat-adv-jobs');

  if (statToday) statToday.textContent = todaysAppointments.length;
  if (statArrivals) statArrivals.textContent = pendingArrivals.length;
  if (statActiveJobs) statActiveJobs.textContent = activeJobs.length;

  // Render Pending Appointments Table
  const apptTbody = document.getElementById('adv-appointments-table-body');
  if (apptTbody) {
    apptTbody.innerHTML = bookings.map(b => `
      <tr>
        <td><b>#${b.bookingId}</b></td>
        <td>
          <div style="font-weight: 700;">${b.customerName}</div>
          <span class="text-muted" style="font-size: 0.75rem;">${b.customerPhone}</span>
        </td>
        <td>
          <span class="license-plate" style="font-size: 0.75rem;">${b.vehicleNo}</span>
          <div style="font-size: 0.85rem;">${b.vehicleModel}</div>
        </td>
        <td>${b.preferredDate} (${b.timeSlot})</td>
        <td>${getStatusBadge(b.status)}</td>
        <td class="text-right">
          <div style="display: flex; gap: 0.4rem; justify-content: flex-end;">
            ${b.jobCardId ? `
              <a href="job-card.html?id=${b.jobCardId}" class="btn btn-secondary btn-sm text-accent">
                <i class="fa-solid fa-clipboard-list"></i> View Job Card (#${b.jobCardId})
              </a>
            ` : `
              <button class="btn btn-primary btn-sm" onclick="createJobCardFromBooking('${b.bookingId}')">
                <i class="fa-solid fa-file-circle-plus"></i> Create Job Card
              </button>
            `}
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Render Active Job Cards Table
  const jcTbody = document.getElementById('adv-jobcards-table-body');
  if (jcTbody) {
    jcTbody.innerHTML = jobCards.map(j => `
      <tr>
        <td><b>#${j.jobCardId}</b></td>
        <td>${j.customerName}</td>
        <td><span class="license-plate" style="font-size: 0.75rem;">${j.vehicleNo}</span></td>
        <td><b>${j.assignedTechName || '<span class="text-warning">Unassigned</span>'}</b></td>
        <td>${getStatusBadge(j.status)}</td>
        <td class="text-right">
          <a href="job-card.html?id=${j.jobCardId}" class="btn btn-secondary btn-sm">
            <i class="fa-solid fa-pen-to-square"></i> Manage Job
          </a>
        </td>
      </tr>
    `).join('');
  }
}

function createJobCardFromBooking(bookingId) {
  const booking = window.DB.getBookingById(bookingId);
  if (!booking) return;

  const newJobCard = {
    jobCardId: 'JOB-' + Math.floor(Math.random() * 8999 + 1000),
    bookingId: booking.bookingId,
    customerId: booking.customerId,
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    vehicleId: booking.vehicleId,
    vehicleNo: booking.vehicleNo,
    vehicleModel: booking.vehicleModel,
    vehicleType: booking.vehicleType,
    assignedTechId: 'USR-004',
    assignedTechName: 'Vikram Singh',
    reportedProblems: booking.additionalProblems || 'Standard Periodic Service',
    inspectionNotes: 'Initial inspection complete: Customer vehicle received in good exterior order.',
    services: booking.serviceNames.map(name => ({ name, cost: 1500 })),
    partsUsed: [],
    technicianNotes: 'Vehicle assigned to bay #2 for mechanical service.',
    status: 'Job Card Created',
    estimatedCost: booking.estimatedCost,
    laborCharge: 800,
    actualCost: booking.estimatedCost + 800,
    createdAt: new Date().toISOString()
  };

  window.DB.saveJobCard(newJobCard);
  booking.jobCardId = newJobCard.jobCardId;
  booking.status = 'Job Card Created';
  window.DB.saveBooking(booking);

  showToast(`Job Card #${newJobCard.jobCardId} created for ${booking.vehicleModel}`, 'success');
  setTimeout(() => {
    window.location.href = `job-card.html?id=${newJobCard.jobCardId}`;
  }, 500);
}

// ==========================================
// 3. TECHNICIAN DASHBOARD CONTROLLER
// ==========================================
function initTechnicianDashboard() {
  const user = checkAuthGuard('technician');
  if (!user) return;

  renderDashboardHeader(user);

  const jobCards = window.DB.getJobCards({ techId: user.id });

  // Stats
  const inProgress = jobCards.filter(j => j.status === 'Repair/Service In Progress').length;
  const qcPending = jobCards.filter(j => j.status === 'Quality Check' || j.status === 'Technician Assigned').length;
  const completed = jobCards.filter(j => j.status === 'Completed').length;

  const statAssigned = document.getElementById('stat-tech-assigned');
  const statProgress = document.getElementById('stat-tech-progress');
  const statQc = document.getElementById('stat-tech-qc');
  const statComp = document.getElementById('stat-tech-completed');

  if (statAssigned) statAssigned.textContent = jobCards.length;
  if (statProgress) statProgress.textContent = inProgress;
  if (statQc) statQc.textContent = qcPending;
  if (statComp) statComp.textContent = completed;

  const tbody = document.getElementById('tech-jobs-table-body');
  if (tbody) {
    if (jobCards.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">No active job cards assigned to your queue</td></tr>';
      return;
    }

    tbody.innerHTML = jobCards.map(j => `
      <tr>
        <td><b>#${j.jobCardId}</b></td>
        <td>
          <span class="license-plate" style="font-size: 0.75rem;">${j.vehicleNo}</span>
          <div style="font-size: 0.85rem; font-weight: 600;">${j.vehicleModel}</div>
        </td>
        <td style="max-width: 250px;">
          <div style="font-size: 0.85rem;">${j.reportedProblems}</div>
          <span class="text-muted" style="font-size: 0.75rem;">${(j.partsUsed || []).length} parts used</span>
        </td>
        <td>${getStatusBadge(j.status)}</td>
        <td>${formatDate(j.createdAt)}</td>
        <td class="text-right">
          <div style="display: flex; gap: 0.4rem; justify-content: flex-end;">
            <a href="job-card.html?id=${j.jobCardId}" class="btn btn-primary btn-sm">
              <i class="fa-solid fa-wrench"></i> Open Job Card
            </a>
          </div>
        </td>
      </tr>
    `).join('');
  }
}

// ==========================================
// 4. ADMIN DASHBOARD CONTROLLER
// ==========================================
function initAdminDashboard() {
  const user = checkAuthGuard('admin');
  if (!user) return;

  renderDashboardHeader(user);

  const stats = window.DB.getStats();

  // Populate Key Performance Indicators
  const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setTxt('admin-stat-customers', stats.totalCustomers);
  setTxt('admin-stat-vehicles', stats.totalVehicles);
  setTxt('admin-stat-bookings', stats.totalBookings);
  setTxt('admin-stat-revenue', formatCurrency(stats.totalRevenue));
  setTxt('admin-stat-active', stats.activeServices);
  setTxt('admin-stat-completed', stats.completedServices);
  setTxt('admin-stat-lowstock', stats.lowStockCount);

  // Render Administrative Tables
  renderAdminCustomersTable();
  renderAdminBookingsTable();
  renderAdminJobCardsTable();
  renderAdminInvoicesTable();

  // Render Charts on Canvas
  drawAdminBookingsChart();
  drawAdminCategoriesChart();
}

function renderAdminCustomersTable() {
  const tbody = document.getElementById('admin-customers-table-body');
  if (!tbody) return;
  const customers = window.DB.getUsers().filter(u => u.role === 'customer');

  tbody.innerHTML = customers.map(c => `
    <tr>
      <td><b>${c.id}</b></td>
      <td>
        <div style="font-weight: 700;">${c.name}</div>
        <span class="text-muted" style="font-size: 0.75rem;">${c.email}</span>
      </td>
      <td>${c.phone}</td>
      <td>${window.DB.getVehicles(c.id).length} Vehicles</td>
      <td>${formatDate(c.createdAt)}</td>
      <td><span class="badge badge-success">Active</span></td>
    </tr>
  `).join('');
}

function renderAdminBookingsTable() {
  const tbody = document.getElementById('admin-bookings-table-body');
  if (!tbody) return;
  const bookings = window.DB.getBookings();

  tbody.innerHTML = bookings.slice(0, 8).map(b => `
    <tr>
      <td><b>#${b.bookingId}</b></td>
      <td>${b.customerName}</td>
      <td><span class="license-plate" style="font-size: 0.75rem;">${b.vehicleNo}</span></td>
      <td>${b.preferredDate} (${b.timeSlot})</td>
      <td>${getStatusBadge(b.status)}</td>
      <td class="text-right">
        <a href="track-service.html?id=${b.bookingId}" class="btn btn-secondary btn-sm"><i class="fa-solid fa-eye"></i></a>
      </td>
    </tr>
  `).join('');
}

function renderAdminJobCardsTable() {
  const tbody = document.getElementById('admin-jobcards-table-body');
  if (!tbody) return;
  const jobs = window.DB.getJobCards();

  tbody.innerHTML = jobs.slice(0, 8).map(j => `
    <tr>
      <td><b>#${j.jobCardId}</b></td>
      <td>${j.customerName}</td>
      <td>${j.vehicleModel}</td>
      <td>${j.assignedTechName || 'Unassigned'}</td>
      <td>${getStatusBadge(j.status)}</td>
      <td class="text-right">
        <a href="job-card.html?id=${j.jobCardId}" class="btn btn-secondary btn-sm"><i class="fa-solid fa-clipboard-list"></i></a>
      </td>
    </tr>
  `).join('');
}

function renderAdminInvoicesTable() {
  const tbody = document.getElementById('admin-invoices-table-body');
  if (!tbody) return;
  const invoices = window.DB.getInvoices();

  tbody.innerHTML = invoices.slice(0, 8).map(i => `
    <tr>
      <td><b>#${i.invoiceId}</b></td>
      <td>${i.customerName}</td>
      <td><span class="license-plate" style="font-size: 0.75rem;">${i.vehicleNo}</span></td>
      <td class="font-bold">${formatCurrency(i.grandTotal)}</td>
      <td>${getStatusBadge(i.paymentStatus)}</td>
      <td class="text-right">
        <a href="invoice.html?id=${i.invoiceId}" class="btn btn-secondary btn-sm"><i class="fa-solid fa-file-invoice"></i></a>
      </td>
    </tr>
  `).join('');
}

// Chart Rendering Helpers (Vanilla HTML5 Canvas)
function drawAdminBookingsChart() {
  const canvas = document.getElementById('bookings-trend-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.parentElement.clientWidth || 500;
  const h = canvas.height = 240;

  // Monthly Data: Jan, Feb, Mar, Apr, May, Jun
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const values = [18, 25, 34, 28, 42, 58];
  const maxVal = 70;

  ctx.clearRect(0, 0, w, h);

  // Background Grid Lines
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = 30 + (i * 40);
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(w - 20, y);
    ctx.stroke();
  }

  // Draw Gradient Area & Line
  const stepX = (w - 80) / (months.length - 1);
  const points = values.map((val, idx) => ({
    x: 50 + (idx * stepX),
    y: h - 40 - (val / maxVal) * 160
  }));

  // Gradient fill
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(37, 99, 235, 0.35)');
  grad.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(points[0].x, h - 35);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, h - 35);
  ctx.closePath();
  ctx.fill();

  // Draw Line
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 3;
  ctx.beginPath();
  points.forEach((p, idx) => {
    if (idx === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();

  // Draw Dots & Labels
  points.forEach((p, idx) => {
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Month Label
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(months[idx], p.x, h - 15);

    // Value Label
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
    ctx.fillText(values[idx], p.x, p.y - 10);
  });
}

function drawAdminCategoriesChart() {
  const canvas = document.getElementById('categories-pie-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.parentElement.clientWidth || 300;
  const h = canvas.height = 240;

  const data = [
    { label: 'General Service', value: 45, color: '#2563eb' },
    { label: 'Engine & Tuning', value: 20, color: '#0ea5e9' },
    { label: 'Brakes & Tyres', value: 18, color: '#10b981' },
    { label: 'AC & Climate', value: 12, color: '#f59e0b' },
    { label: 'Detaling/Body', value: 5, color: '#8b5cf6' }
  ];

  ctx.clearRect(0, 0, w, h);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  let startAngle = -Math.PI / 2;
  const centerX = w / 2 - 40;
  const centerY = h / 2;
  const radius = 70;

  data.forEach(item => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;

    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fill();

    startAngle += sliceAngle;
  });

  // Inner cutout for donut chart
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.55, 0, Math.PI * 2);
  ctx.fill();

  // Legend
  const legendX = centerX + radius + 25;
  data.forEach((item, idx) => {
    const legendY = 45 + (idx * 30);
    ctx.fillStyle = item.color;
    ctx.fillRect(legendX, legendY, 12, 12);

    ctx.fillStyle = '#0f172a';
    ctx.font = '11px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${item.label} (${item.value}%)`, legendX + 18, legendY + 10);
  });
}

function renderDashboardHeader(user) {
  const nameElems = document.querySelectorAll('.dashboard-user-name');
  const roleElems = document.querySelectorAll('.dashboard-user-role');
  const avatarElems = document.querySelectorAll('.dashboard-user-avatar');

  nameElems.forEach(el => el.textContent = user.name);
  roleElems.forEach(el => el.textContent = user.role.toUpperCase());
  avatarElems.forEach(el => { if (user.avatar) el.src = user.avatar; });
}
