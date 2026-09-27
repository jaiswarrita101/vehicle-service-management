/**
 * Vehicle Service Management System (VSMS) - Job Card Management Module
 */

const STATUS_STAGES = [
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

function loadJobCardView() {
  const container = document.getElementById('job-card-main-container');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  let jobCardId = urlParams.get('id');
  const bookingId = urlParams.get('bookingId');
  
  let jobCard = null;
  if (jobCardId) {
    jobCard = window.DB.getJobCardById(jobCardId);
  }
  
  if (!jobCard && bookingId) {
    jobCard = window.DB.getJobCards().find(j => j.bookingId === bookingId);
  }

  // Automatic Fallback: If not found or no ID in URL, load the first available job card
  if (!jobCard) {
    const allJobs = window.DB.getJobCards();
    if (allJobs && allJobs.length > 0) {
      jobCard = allJobs[0];
    } else {
      // Auto-create standard demo job card if DB is empty
      jobCard = {
        jobCardId: 'JOB-2001',
        bookingId: 'BKG-1001',
        customerId: 'USR-001',
        customerName: 'John Doe',
        customerPhone: '+91 98765 43210',
        vehicleId: 'VEH-001',
        vehicleNo: 'MH-02-CB-4521',
        vehicleModel: 'Honda City ZX',
        vehicleType: 'Sedan',
        assignedTechId: 'USR-004',
        assignedTechName: 'Vikram Singh',
        reportedProblems: 'Slight squeak from rear suspension. Standard 10,000 km periodic service.',
        inspectionNotes: 'Initial inspection complete: Rear suspension bushing dry. AC refrigerant at 210g.',
        services: [
          { name: 'Standard Comprehensive Service', cost: 3499 },
          { name: 'Complete AC Inspection & Refrigerant Gas Refill', cost: 2499 }
        ],
        partsUsed: [
          { partId: 'PRT-001', name: 'Engine Oil (5W-30 Full Synthetic 4L)', quantity: 1, unitPrice: 1650, total: 1650 },
          { partId: 'PRT-002', name: 'OEM Oil Filter Cartridge', quantity: 1, unitPrice: 380, total: 380 }
        ],
        technicianNotes: 'Drained black engine oil. Replaced OEM oil filter with fresh gasket.',
        status: 'Repair/Service In Progress',
        estimatedCost: 5998,
        laborCharge: 1200,
        actualCost: 9228,
        createdAt: new Date().toISOString()
      };
      window.DB.saveJobCard(jobCard);
    }
  }

  const allJobCardsList = window.DB.getJobCards();
  const technicians = window.DB.getUsers().filter(u => u.role === 'technician');
  const inventoryParts = window.DB.getInventory();

  // Render Parts Used Table Rows
  const partsRows = (jobCard.partsUsed || []).map((p, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><b>${p.name}</b> <span class="text-muted">(${p.partId})</span></td>
      <td class="text-center">${p.quantity}</td>
      <td class="text-right">${formatCurrency(p.unitPrice)}</td>
      <td class="text-right font-bold">${formatCurrency(p.total)}</td>
    </tr>
  `).join('');

  const servicesRows = (jobCard.services || []).map((s, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><b>${s.name}</b></td>
      <td class="text-right font-bold">${formatCurrency(s.cost || s.price || 0)}</td>
    </tr>
  `).join('');

  // Status Stepper Nodes
  const currentStageIndex = STATUS_STAGES.indexOf(jobCard.status);
  const statusProgressPct = Math.max(0, Math.min(100, (currentStageIndex / (STATUS_STAGES.length - 1)) * 100));
  const nextStageName = currentStageIndex < STATUS_STAGES.length - 1 ? STATUS_STAGES[currentStageIndex + 1] : null;

  const stepperHtml = `
    <div class="tracking-stepper-container" style="margin-bottom: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <h4 style="margin: 0;"><i class="fa-solid fa-bars-progress text-accent"></i> Real-Time Service Lifecycle Progress</h4>
          <span class="text-muted" style="font-size: 0.8rem;">Current State: ${getStatusBadge(jobCard.status)}</span>
        </div>
        
        <!-- Fast-Track / Speedup Quick Actions Bar -->
        <div class="no-print" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${nextStageName ? `
            <button onclick="fastForwardStage('${jobCard.jobCardId}')" class="btn btn-primary btn-sm" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);">
              <i class="fa-solid fa-forward-step text-warning"></i> Fast-Forward Next Stage
            </button>
            <button onclick="startLiveAutoRepairSimulation('${jobCard.jobCardId}')" class="btn btn-secondary btn-sm" style="background: #1e293b; color: #38bdf8; border: 1px solid #334155;" title="Auto-advances every 2 seconds for live demo">
              <i class="fa-solid fa-play text-warning"></i> Auto-Simulate Live
            </button>
          ` : ''}
          <button onclick="applyServiceKit('${jobCard.jobCardId}')" class="btn btn-secondary btn-sm" title="Adds Oil + Filter kit in 1-click">
            <i class="fa-solid fa-bolt text-warning"></i> + Quick Service Kit
          </button>
          <button onclick="instantCompleteAndBill('${jobCard.jobCardId}')" class="btn btn-success btn-sm" style="background: linear-gradient(135deg, #059669 0%, #047857 100%);">
            <i class="fa-solid fa-flag-checkered"></i> ⚡ Instant Complete & Bill
          </button>
        </div>
      </div>
      
      <div class="stepper-timeline">
        <div class="stepper-timeline-progress" style="width: ${statusProgressPct}%;"></div>
        ${STATUS_STAGES.map((stg, i) => {
          let nodeClass = '';
          if (i < currentStageIndex) nodeClass = 'completed';
          else if (i === currentStageIndex) nodeClass = 'active';

          return `
            <div class="step-node ${nodeClass}">
              <div class="step-circle">
                ${i < currentStageIndex ? '<i class="fa-solid fa-check"></i>' : (i + 1)}
              </div>
              <div class="step-label">${stg}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  container.innerHTML = `
    ${stepperHtml}

    <div class="dashboard-grid-2">
      <!-- Left Column: Job Card Details -->
      <div>
        <div class="dashboard-card">
          <div class="dashboard-card-header" style="flex-wrap: wrap; gap: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <h3 style="margin: 0;"><i class="fa-solid fa-clipboard-list text-accent"></i> Job Card #${jobCard.jobCardId}</h3>
              <select onchange="window.location.href='job-card.html?id=' + this.value" class="form-control" style="width: auto; padding: 0.3rem 0.75rem; font-size: 0.85rem; font-weight: 700; border-color: var(--accent);">
                ${allJobCardsList.map(j => `
                  <option value="${j.jobCardId}" ${j.jobCardId === jobCard.jobCardId ? 'selected' : ''}>
                    Switch to #${j.jobCardId} (${j.vehicleModel} - ${j.status})
                  </option>
                `).join('')}
              </select>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button onclick="window.print()" class="btn btn-secondary btn-sm no-print">
                <i class="fa-solid fa-print"></i> Print Job Card
              </button>
            </div>
          </div>
          <div class="dashboard-card-body">
            <!-- Vehicle & Customer Quick Card -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; background: var(--bg-main); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; border: 1px solid var(--border-color);">
              <div>
                <span class="text-muted" style="font-size: 0.75rem; text-transform: uppercase;">Customer Information</span>
                <h4 style="margin: 0.25rem 0;">${jobCard.customerName}</h4>
                <p class="text-muted" style="margin: 0; font-size: 0.85rem;"><i class="fa-solid fa-phone"></i> ${jobCard.customerPhone || 'N/A'}</p>
                <p class="text-muted" style="margin: 0; font-size: 0.85rem;"><i class="fa-solid fa-bookmark"></i> Ref Booking: #${jobCard.bookingId || 'N/A'}</p>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <span class="text-muted" style="font-size: 0.75rem; text-transform: uppercase;">Vehicle Details</span>
                  <button type="button" class="btn btn-secondary btn-sm no-print" onclick="openEditVehicleModal('${jobCard.jobCardId}')" style="padding: 2px 8px; font-size: 0.75rem;">
                    <i class="fa-solid fa-pen-to-square"></i> Edit
                  </button>
                </div>
                <div style="margin: 0.25rem 0;"><span class="license-plate" id="jc-display-veh-no">${jobCard.vehicleNo}</span></div>
                <h4 style="margin: 0.25rem 0; font-size: 1.05rem;" id="jc-display-veh-model">${jobCard.vehicleModel}</h4>
                <span class="badge badge-info" id="jc-display-veh-type">${jobCard.vehicleType || 'Vehicle'}</span>
              </div>
            </div>

            <!-- Reported Issue & Inspection -->
            <div style="margin-bottom: 1.5rem;">
              <h4 style="font-size: 1rem; margin-bottom: 0.35rem;"><i class="fa-solid fa-triangle-exclamation text-warning"></i> Customer Reported Complaints</h4>
              <p style="background: #fff; border: 1px solid var(--border-color); padding: 0.85rem; border-radius: var(--radius-md); font-size: 0.9rem; color: var(--text-main);">
                ${jobCard.reportedProblems || 'Standard periodic inspection requested.'}
              </p>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <h4 style="font-size: 1rem; margin-bottom: 0.35rem;"><i class="fa-solid fa-microscope text-accent"></i> Initial Inspection Notes (Advisor/Tech)</h4>
              <textarea id="jc-inspection-notes" class="form-control" rows="3">${jobCard.inspectionNotes || ''}</textarea>
            </div>

            <!-- Services Section -->
            <div style="margin-bottom: 1.5rem;">
              <h4 style="font-size: 1rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-wrench text-accent"></i> Authorized Services</h4>
              <div class="table-responsive">
                <table class="vsms-table">
                  <thead>
                    <tr>
                      <th style="width: 40px;">#</th>
                      <th>Service Name</th>
                      <th class="text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${servicesRows || '<tr><td colspan="3" class="text-center text-muted">No specific services loaded</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Parts Used Section -->
            <div style="margin-bottom: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h4 style="font-size: 1rem; margin: 0;"><i class="fa-solid fa-gears text-primary"></i> Spare Parts Consumed</h4>
                <button class="btn btn-outline btn-sm no-print" onclick="openModal('add-part-modal')">
                  <i class="fa-solid fa-plus"></i> Add Spare Part
                </button>
              </div>
              <div class="table-responsive">
                <table class="vsms-table">
                  <thead>
                    <tr>
                      <th style="width: 40px;">#</th>
                      <th>Part Name & SKU</th>
                      <th class="text-center">Qty</th>
                      <th class="text-right">Unit Price</th>
                      <th class="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${partsRows || '<tr><td colspan="5" class="text-center text-muted">No spare parts recorded yet</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Technician Notes -->
            <div style="margin-bottom: 1.5rem;">
              <h4 style="font-size: 1rem; margin-bottom: 0.35rem;"><i class="fa-solid fa-pen-nib text-accent"></i> Work Carried Out & Mechanic Observations</h4>
              <textarea id="jc-technician-notes" class="form-control" rows="3" placeholder="Record specific repairs, torque specs, fluid levels...">${jobCard.technicianNotes || ''}</textarea>
            </div>

            <div class="no-print" style="display: flex; justify-content: flex-end; gap: 0.75rem;">
              <button class="btn btn-primary" onclick="saveJobCardNotes('${jobCard.jobCardId}')">
                <i class="fa-solid fa-floppy-disk"></i> Save Updates
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Technician Assignment & Status Controller -->
      <div>
        <!-- Status Progression Controller -->
        <div class="dashboard-card">
          <div class="dashboard-card-header">
            <h3><i class="fa-solid fa-sliders text-accent"></i> Service Status Action</h3>
          </div>
          <div class="dashboard-card-body">
            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label>Update Status Stage:</label>
              <select id="jc-status-select" class="form-control">
                ${STATUS_STAGES.map(st => `
                  <option value="${st}" ${st === jobCard.status ? 'selected' : ''}>${st}</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label>Assign Lead Technician:</label>
              <select id="jc-technician-select" class="form-control">
                <option value="">-- Select Technician --</option>
                ${technicians.map(t => `
                  <option value="${t.id}" ${t.id === jobCard.assignedTechId ? 'selected' : ''}>
                    ${t.name} (${t.specialization || 'Mechanic'})
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label>Labor Charges (₹):</label>
              <input type="number" id="jc-labor-input" class="form-control" value="${jobCard.laborCharge || 800}" step="50">
            </div>

            <button class="btn btn-primary btn-block" onclick="updateJobCardStatus('${jobCard.jobCardId}')">
              <i class="fa-solid fa-arrows-rotate"></i> Update Status & Assignment
            </button>

            <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid var(--border-color);">

            <!-- Invoice Generation Button -->
            ${jobCard.invoiceId ? `
              <a href="invoice.html?id=${jobCard.invoiceId}" class="btn btn-success btn-block btn-lg">
                <i class="fa-solid fa-receipt"></i> View Generated Invoice (#${jobCard.invoiceId})
              </a>
            ` : `
              <button class="btn btn-warning btn-block btn-lg" onclick="handleGenerateInvoice('${jobCard.jobCardId}')">
                <i class="fa-solid fa-file-invoice-dollar"></i> Generate Final Invoice
              </button>
            `}
          </div>
        </div>
      </div>
    </div>

    <!-- Modal to Add Spare Part into Job Card -->
    <div class="modal-backdrop" id="add-part-modal">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title"><i class="fa-solid fa-box-open text-accent"></i> Add Spare Part to Job Card</h3>
          <button class="modal-close" onclick="closeModal('add-part-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group" style="margin-bottom: 1rem;">
            <label>Select Part from OEM Inventory:</label>
            <select id="select-inventory-part" class="form-control">
              <option value="">-- Choose Spare Part --</option>
              ${inventoryParts.map(p => `
                <option value="${p.partId}" ${p.quantity === 0 ? 'disabled' : ''}>
                  ${p.name} (Stock: ${p.quantity} | ₹${p.unitPrice})
                </option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Quantity to Consume:</label>
            <input type="number" id="part-consume-qty" class="form-control" value="1" min="1" max="10">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal('add-part-modal')">Cancel</button>
          <button class="btn btn-primary" onclick="confirmAddPart('${jobCard.jobCardId}')">Add to Job & Deduct Stock</button>
        </div>
      </div>
    </div>

    <!-- Modal to Edit Vehicle Number & Details -->
    <div class="modal-backdrop" id="edit-vehicle-modal">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title"><i class="fa-solid fa-car text-accent"></i> Update Vehicle Information</h3>
          <button class="modal-close" onclick="closeModal('edit-vehicle-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group" style="margin-bottom: 1rem;">
            <label>Vehicle License Plate No. (Registration):</label>
            <input type="text" id="edit-jc-veh-no" class="form-control" value="${jobCard.vehicleNo || ''}" style="text-transform: uppercase; font-weight: 700; letter-spacing: 1px;" placeholder="e.g. MH-02-CB-4521">
          </div>
          <div class="form-group" style="margin-bottom: 1rem;">
            <label>Vehicle Make & Model:</label>
            <input type="text" id="edit-jc-veh-model" class="form-control" value="${jobCard.vehicleModel || ''}" placeholder="e.g. Honda City ZX">
          </div>
          <div class="form-group">
            <label>Vehicle Type:</label>
            <select id="edit-jc-veh-type" class="form-control">
              <option value="Hatchback" ${jobCard.vehicleType === 'Hatchback' ? 'selected' : ''}>Hatchback</option>
              <option value="Sedan" ${jobCard.vehicleType === 'Sedan' ? 'selected' : ''}>Sedan</option>
              <option value="SUV" ${jobCard.vehicleType === 'SUV' ? 'selected' : ''}>SUV</option>
              <option value="Luxury" ${jobCard.vehicleType === 'Luxury' ? 'selected' : ''}>Luxury</option>
              <option value="Electric" ${jobCard.vehicleType === 'Electric' ? 'selected' : ''}>Electric</option>
              <option value="Two Wheeler" ${jobCard.vehicleType === 'Two Wheeler' ? 'selected' : ''}>Two Wheeler</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal('edit-vehicle-modal')">Cancel</button>
          <button class="btn btn-primary" onclick="confirmUpdateVehicle('${jobCard.jobCardId}')">Save Vehicle Details</button>
        </div>
      </div>
    </div>
  `;
}

function openEditVehicleModal(jobCardId) {
  openModal('edit-vehicle-modal');
}

function confirmUpdateVehicle(jobCardId) {
  const job = window.DB.getJobCardById(jobCardId);
  if (!job) return;

  const newVehNo = document.getElementById('edit-jc-veh-no').value.trim().toUpperCase();
  const newVehModel = document.getElementById('edit-jc-veh-model').value.trim();
  const newVehType = document.getElementById('edit-jc-veh-type').value;

  if (!newVehNo) {
    showToast('Please enter a valid vehicle license plate number', 'danger');
    return;
  }

  job.vehicleNo = newVehNo;
  if (newVehModel) job.vehicleModel = newVehModel;
  if (newVehType) job.vehicleType = newVehType;
  window.DB.saveJobCard(job);

  // Synchronize with related booking
  if (job.bookingId) {
    const booking = window.DB.getBookingById(job.bookingId);
    if (booking) {
      booking.vehicleNo = newVehNo;
      if (newVehModel) booking.vehicleModel = newVehModel;
      if (newVehType) booking.vehicleType = newVehType;
      window.DB.saveBooking(booking);
    }
  }

  // Synchronize with related vehicle record
  if (job.vehicleId) {
    const veh = window.DB.getVehicleById(job.vehicleId);
    if (veh) {
      veh.vehicleNo = newVehNo;
      if (newVehModel) veh.model = newVehModel;
      if (newVehType) veh.type = newVehType;
      window.DB.saveVehicle(veh);
    }
  }

  closeModal('edit-vehicle-modal');
  showToast(`Vehicle updated to ${newVehNo} successfully!`, 'success');
  loadJobCardView();
}

function saveJobCardNotes(jobCardId) {
  const job = window.DB.getJobCardById(jobCardId);
  if (!job) return;

  const notes = document.getElementById('jc-technician-notes').value;
  const insp = document.getElementById('jc-inspection-notes').value;

  job.technicianNotes = notes;
  job.inspectionNotes = insp;
  window.DB.saveJobCard(job);
  showToast('Job card notes updated successfully', 'success');
}

function updateJobCardStatus(jobCardId) {
  const job = window.DB.getJobCardById(jobCardId);
  if (!job) return;

  const newStatus = document.getElementById('jc-status-select').value;
  const techId = document.getElementById('jc-technician-select').value;
  const labor = Number(document.getElementById('jc-labor-input').value) || 0;

  const tech = window.DB.getUserById(techId);
  if (tech) {
    job.assignedTechId = tech.id;
    job.assignedTechName = tech.name;
  }

  job.status = newStatus;
  job.laborCharge = labor;

  if (newStatus === 'Completed') {
    job.completedAt = new Date().toISOString();
  }

  window.DB.saveJobCard(job);

  // Sync booking status
  if (job.bookingId) {
    window.DB.updateBookingStatus(job.bookingId, newStatus);
  }

  showToast(`Job Card updated! Status: ${newStatus}`, 'success');
  loadJobCardView();
}

function confirmAddPart(jobCardId) {
  const select = document.getElementById('select-inventory-part');
  const qtyInput = document.getElementById('part-consume-qty');

  const partId = select ? select.value : '';
  const qty = Number(qtyInput ? qtyInput.value : 1);

  if (!partId) {
    showToast('Please select a spare part', 'warning');
    return;
  }

  const result = window.DB.addPartToJobCard(jobCardId, partId, qty);
  if (result.success) {
    closeModal('add-part-modal');
    showToast(`Added ${qty} unit(s) of ${result.part.name}. Inventory deducted automatically.`, 'success');
    loadJobCardView();
  } else {
    showToast(result.message || 'Error consuming spare part', 'danger');
  }
}

function handleGenerateInvoice(jobCardId) {
  const invoice = window.DB.generateInvoiceFromJobCard(jobCardId, 5); // 5% promotional discount
  if (invoice) {
    showToast(`Invoice #${invoice.invoiceId} generated successfully!`, 'success');
    setTimeout(() => {
      window.location.href = `invoice.html?id=${invoice.invoiceId}`;
    }, 600);
  } else {
    showToast('Could not generate invoice', 'danger');
  }
}

// =========================================================================
// SPEED-UP & FAST-TRACK REPAIR FUNCTIONS
// =========================================================================

/**
 * 1. Fast-Forwards the repair to the next lifecycle stage in 1 click
 */
function fastForwardStage(jobCardId) {
  const job = window.DB.getJobCardById(jobCardId);
  if (!job) return;

  const currentIndex = STATUS_STAGES.indexOf(job.status);
  if (currentIndex < STATUS_STAGES.length - 1) {
    const nextStatus = STATUS_STAGES[currentIndex + 1];
    job.status = nextStatus;
    if (nextStatus === 'Completed') {
      job.completedAt = new Date().toISOString();
    }
    window.DB.saveJobCard(job);

    if (job.bookingId) {
      window.DB.updateBookingStatus(job.bookingId, nextStatus);
    }

    showToast(`⚡ Fast-Forwarded to: "${nextStatus}"!`, 'success', 'Repair Progressed');
    loadJobCardView();
  } else {
    showToast('Service is already completed!', 'info');
  }
}

/**
 * 2. Applies standard OEM service kit (Oil + Filter + Fluid) in 1 click
 */
function applyServiceKit(jobCardId) {
  const job = window.DB.getJobCardById(jobCardId);
  if (!job) return;

  // Add Engine Oil (PRT-001) & Oil Filter (PRT-002)
  window.DB.addPartToJobCard(jobCardId, 'PRT-001', 1);
  window.DB.addPartToJobCard(jobCardId, 'PRT-002', 1);

  job.inspectionNotes = (job.inspectionNotes || '') + '\n[Fast-Track]: Applied standard 50-point OEM lubricant and filter renewal package.';
  job.technicianNotes = (job.technicianNotes || '') + '\n[Fast-Track]: Synthetic oil renewed. Fresh OEM cartridge installed with new O-ring.';
  window.DB.saveJobCard(job);

  showToast('⚡ Quick Service Kit Applied: Synthetic Oil + OEM Filter added and deducted from inventory!', 'success', 'Kit Installed');
  loadJobCardView();
}

/**
 * 3. 1-Click Instant Complete & Generate Invoice
 */
function instantCompleteAndBill(jobCardId) {
  const job = window.DB.getJobCardById(jobCardId);
  if (!job) return;

  // Apply service kit if no parts used yet
  if (!job.partsUsed || job.partsUsed.length === 0) {
    window.DB.addPartToJobCard(jobCardId, 'PRT-001', 1);
    window.DB.addPartToJobCard(jobCardId, 'PRT-002', 1);
  }

  job.status = 'Completed';
  job.completedAt = new Date().toISOString();
  job.technicianNotes = (job.technicianNotes || '') + '\n[Fast-Track Completed]: All multi-point checks passed. Road tested and ready for handover.';
  window.DB.saveJobCard(job);

  if (job.bookingId) {
    window.DB.updateBookingStatus(job.bookingId, 'Completed');
  }

  showToast('⚡ Repair 100% Completed! Generating Final Tax Invoice...', 'success');

  setTimeout(() => {
    handleGenerateInvoice(jobCardId);
  }, 500);
}

/**
 * 4. Automated Live Simulation Stepper (Simulates live workshop progress step-by-step every 2 seconds)
 */
let simulationTimer = null;
function startLiveAutoRepairSimulation(jobCardId) {
  if (simulationTimer) {
    clearInterval(simulationTimer);
    simulationTimer = null;
    showToast('Simulation stopped', 'info');
    return;
  }

  showToast('⚡ Live Automated Workshop Simulation Started! Advancing stages automatically...', 'info');

  simulationTimer = setInterval(() => {
    const job = window.DB.getJobCardById(jobCardId);
    if (!job) {
      clearInterval(simulationTimer);
      return;
    }

    const currentIndex = STATUS_STAGES.indexOf(job.status);
    if (currentIndex < STATUS_STAGES.length - 1) {
      fastForwardStage(jobCardId);
    } else {
      clearInterval(simulationTimer);
      simulationTimer = null;
      showToast('🎉 All repair stages completed successfully!', 'success');
    }
  }, 2200);
}
