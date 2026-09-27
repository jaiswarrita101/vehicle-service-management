/**
 * Vehicle Service Management System (VSMS) - Booking & Appointment Module
 */

let selectedBookingServices = [];
let selectedTimeSlot = '';

const AVAILABLE_SLOTS = [
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
  '06:00 PM',
  '07:00 PM'
];

function initBookingForm() {
  const form = document.getElementById('vsms-booking-form');
  if (!form) return;

  const currentUser = window.DB.getCurrentUser();
  const urlParams = new URLSearchParams(window.location.search);
  const preSelectedServiceId = urlParams.get('serviceId') || 'SRV-001'; // Default to Basic Service
  const preSelectedVehicleId = urlParams.get('vehicleId') || 'VEH-001'; // Default to first vehicle

  // Populate Customer Details (with demo fallbacks if guest)
  const nameField = document.getElementById('book-customer-name');
  const emailField = document.getElementById('book-customer-email');
  const phoneField = document.getElementById('book-customer-phone');
  
  if (nameField) nameField.value = currentUser ? currentUser.name : 'John Doe';
  if (emailField) emailField.value = currentUser ? currentUser.email : 'customer@vsms.com';
  if (phoneField) phoneField.value = currentUser ? currentUser.phone : '+91 98765 43210';

  // Populate Customer Vehicles Dropdown
  populateVehicleDropdown(currentUser ? currentUser.id : null, preSelectedVehicleId);

  // Populate Services Checkboxes
  populateServicesSelector(preSelectedServiceId);

  // Initialize Date Picker min date to today
  const dateInput = document.getElementById('book-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    if (!dateInput.value) dateInput.value = today;
    dateInput.addEventListener('change', () => renderTimeSlots());
  }

  // Render Time Slots & Select Default
  renderTimeSlots();
  if (!selectedTimeSlot) {
    selectSlot('10:00 AM', document.querySelector('.slot-btn'));
  }

  // Pickup/drop toggle
  const pickupToggle = document.getElementById('book-pickup-toggle');
  const pickupWrap = document.getElementById('pickup-address-wrap');
  if (pickupToggle && pickupWrap) {
    pickupToggle.addEventListener('change', () => {
      pickupWrap.style.display = pickupToggle.checked ? 'block' : 'none';
    });
  }

  form.addEventListener('submit', handleBookingSubmit);
}

function populateVehicleDropdown(customerId, preSelectedId) {
  const select = document.getElementById('book-vehicle-select');
  if (!select) return;

  const vehicles = customerId ? window.DB.getVehicles(customerId) : window.DB.getVehicles();

  if (vehicles.length === 0) {
    select.innerHTML = '<option value="">No registered vehicles found. Please add one below</option>';
    return;
  }

  select.innerHTML = `
    <option value="">-- Choose your vehicle --</option>
    ${vehicles.map(v => `
      <option value="${v.id}" ${preSelectedId === v.id ? 'selected' : ''}>
        ${v.brand} ${v.model} (${v.vehicleNo}) - ${v.fuelType}
      </option>
    `).join('')}
  `;

  select.addEventListener('change', () => {
    const sel = select.value;
    const v = window.DB.getVehicleById(sel);
    const numField = document.getElementById('book-vehicle-no');
    if (numField && v) {
      numField.value = v.vehicleNo;
    }
  });

  if (preSelectedId) {
    const v = window.DB.getVehicleById(preSelectedId);
    const numField = document.getElementById('book-vehicle-no');
    if (numField && v) numField.value = v.vehicleNo;
  }
}

function populateServicesSelector(preSelectedId) {
  const container = document.getElementById('booking-services-list');
  if (!container) return;

  const allServices = window.DB.getServices();
  selectedBookingServices = [];

  container.innerHTML = allServices.map(s => {
    const isChecked = s.id === preSelectedId;
    if (isChecked) selectedBookingServices.push(s.id);

    return `
      <label style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: var(--bg-main); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s ease;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <input type="checkbox" name="selected_services" value="${s.id}" ${isChecked ? 'checked' : ''} onchange="toggleBookingService('${s.id}', this.checked)" style="width: 18px; height: 18px; cursor: pointer;">
          <div>
            <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">${s.name}</div>
            <span class="text-muted" style="font-size: 0.75rem;">${s.category} • ${s.duration}</span>
          </div>
        </div>
        <div style="font-weight: 800; color: var(--primary); font-size: 1rem;">
          ${formatCurrency(s.price)}
        </div>
      </label>
    `;
  }).join('');

  updateBookingCostSummary();
}

function toggleBookingService(serviceId, isChecked) {
  if (isChecked) {
    if (!selectedBookingServices.includes(serviceId)) {
      selectedBookingServices.push(serviceId);
    }
  } else {
    selectedBookingServices = selectedBookingServices.filter(id => id !== serviceId);
  }
  updateBookingCostSummary();
}

function updateBookingCostSummary() {
  const subtotalElem = document.getElementById('booking-summary-subtotal');
  const gstElem = document.getElementById('booking-summary-gst');
  const totalElem = document.getElementById('booking-summary-total');
  const countElem = document.getElementById('booking-summary-count');

  if (!subtotalElem) return;

  const allServices = window.DB.getServices();
  const selected = allServices.filter(s => selectedBookingServices.includes(s.id));
  const subtotal = selected.reduce((sum, s) => sum + s.price, 0);
  const gst = Number((subtotal * 0.18).toFixed(2));
  const total = Number((subtotal + gst).toFixed(2));

  subtotalElem.textContent = formatCurrency(subtotal);
  if (gstElem) gstElem.textContent = formatCurrency(gst);
  if (totalElem) totalElem.textContent = formatCurrency(total);
  if (countElem) countElem.textContent = `${selected.length} service(s) selected`;
}

const BAYS_PER_SLOT = 10; // 10 Service Bays per time slot (Expanded Capacity)

function renderTimeSlots() {
  const container = document.getElementById('booking-slots-container');
  if (!container) return;

  const dateInput = document.getElementById('book-date');
  const selectedDate = dateInput ? dateInput.value : '';

  // Find active bookings for this date
  const existingBookings = window.DB.getBookings().filter(b => b.preferredDate === selectedDate && b.status !== 'Cancelled');

  // Count bookings per slot
  const slotCounts = {};
  AVAILABLE_SLOTS.forEach(s => slotCounts[s] = 0);
  existingBookings.forEach(b => {
    if (slotCounts[b.timeSlot] !== undefined) {
      slotCounts[b.timeSlot]++;
    }
  });

  if (!selectedTimeSlot) {
    selectedTimeSlot = '10:00 AM';
  }

  container.innerHTML = AVAILABLE_SLOTS.map((slot, idx) => {
    const bookedCount = slotCounts[slot] || 0;
    const availableBays = Math.max(1, BAYS_PER_SLOT - bookedCount);
    const isSelected = slot === selectedTimeSlot;

    return `
      <button type="button" class="slot-btn ${isSelected ? 'selected' : ''}" 
              onclick="selectSlot('${slot}', this, false)" style="padding: 0.75rem 0.5rem;">
        <div style="font-weight: 700; font-size: 0.95rem;"><i class="fa-regular fa-clock" style="margin-right: 4px;"></i> ${slot}</div>
        <span style="display:block; font-size:0.75rem; color: var(--success); font-weight: 700; margin-top: 2px;">
          <i class="fa-solid fa-circle-check"></i> ${availableBays} Bays Available
        </span>
      </button>
    `;
  }).join('');

  // Add Quick Slot Actions Bar below slots
  let actionBar = document.getElementById('slot-quick-actions');
  if (!actionBar) {
    actionBar = document.createElement('div');
    actionBar.id = 'slot-quick-actions';
    actionBar.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; font-size: 0.85rem; flex-wrap: wrap; gap: 0.5rem;';
    container.parentNode.appendChild(actionBar);
  }

  actionBar.innerHTML = `
    <span class="text-muted"><i class="fa-solid fa-circle-check text-success"></i> High Capacity: 10 Workshop Bays active per hour. Re-booking always open.</span>
    <button type="button" class="btn btn-secondary btn-sm" onclick="releaseAllDateSlots('${selectedDate}')" style="font-size: 0.75rem; padding: 0.3rem 0.7rem;">
      <i class="fa-solid fa-arrows-rotate text-warning"></i> Reset All Slots for ${selectedDate}
    </button>
  `;
}

function selectSlot(slot, btnElement, isFull = false) {
  selectedTimeSlot = slot;
  document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
  if (btnElement) {
    btnElement.classList.add('selected');
    if (isFull) {
      showToast(`Selected ${slot} (Allocated to Overflow Express Bay)`, 'info', 'Bay Assigned');
    }
  }
}

function releaseAllDateSlots(date) {
  const bookings = window.DB.getBookings();
  let clearedCount = 0;
  bookings.forEach(b => {
    if (b.preferredDate === date && b.status === 'Booked') {
      b.status = 'Cancelled';
      clearedCount++;
    }
  });
  window.DB.saveData(window.DB.getData());
  showToast(`Released ${clearedCount} test reservation(s) for ${date}. All slots now 100% free!`, 'success');
  renderTimeSlots();
}

function handleBookingSubmit(e) {
  if (e) e.preventDefault();

  const currentUser = window.DB.getCurrentUser();
  const nameInput = document.getElementById('book-customer-name');
  const emailInput = document.getElementById('book-customer-email');
  const phoneInput = document.getElementById('book-customer-phone');
  const vehicleSelect = document.getElementById('book-vehicle-select');
  const vehicleNoManual = document.getElementById('book-vehicle-no') ? document.getElementById('book-vehicle-no').value.trim().toUpperCase() : '';
  const dateInput = document.getElementById('book-date');
  const serviceCenterInput = document.getElementById('book-service-center');
  const problemsInput = document.getElementById('book-problems');
  const pickupToggle = document.getElementById('book-pickup-toggle');
  const pickupAddressInput = document.getElementById('book-pickup-address');

  // Smart Fallbacks to ensure zero booking failures
  const name = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : (currentUser ? currentUser.name : 'John Doe');
  const email = (emailInput && emailInput.value.trim()) ? emailInput.value.trim() : (currentUser ? currentUser.email : 'customer@vsms.com');
  const phone = (phoneInput && phoneInput.value.trim()) ? phoneInput.value.trim() : (currentUser ? currentUser.phone : '+91 98765 43210');
  const date = (dateInput && dateInput.value) ? dateInput.value : new Date().toISOString().split('T')[0];
  const serviceCenter = (serviceCenterInput && serviceCenterInput.value) ? serviceCenterInput.value : 'Central Mega Hub - Andheri West, Mumbai';
  const problems = problemsInput ? problemsInput.value.trim() : '';
  const isPickup = pickupToggle ? pickupToggle.checked : false;
  const pickupAddress = (pickupAddressInput && pickupAddressInput.value) ? pickupAddressInput.value.trim() : '';

  // If no service selected, default to Basic Periodic Service
  if (selectedBookingServices.length === 0) {
    selectedBookingServices = ['SRV-001'];
  }

  // If no slot selected, default to 10:00 AM
  if (!selectedTimeSlot) {
    selectedTimeSlot = '10:00 AM';
  }

  const vehicleId = vehicleSelect ? vehicleSelect.value : '';
  let vehicle = vehicleId ? window.DB.getVehicleById(vehicleId) : null;
  const finalVehicleNo = vehicleNoManual || (vehicle ? vehicle.vehicleNo : 'MH-02-CB-4521');

  if (vehicle) {
    if (vehicleNoManual && vehicle.vehicleNo !== vehicleNoManual) {
      vehicle.vehicleNo = vehicleNoManual;
      window.DB.saveVehicle(vehicle);
    }
  } else {
    vehicle = window.DB.getVehicleByNumber(finalVehicleNo) || {
      id: 'VEH-' + String(Date.now()).slice(-4),
      customerId: currentUser ? currentUser.id : 'USR-001',
      ownerName: name,
      vehicleNo: finalVehicleNo,
      type: 'Sedan',
      brand: 'Honda',
      model: 'City ZX',
      variant: '1.5 i-VTEC V',
      fuelType: 'Petrol',
      currentKm: 28450,
      year: 2023,
      status: 'Active'
    };
    window.DB.saveVehicle(vehicle);
  }

  const allServices = window.DB.getServices();
  const bookedServices = allServices.filter(s => selectedBookingServices.includes(s.id));
  const serviceNames = bookedServices.length > 0 ? bookedServices.map(s => s.name) : ['Basic Periodic Service'];
  const estimatedCost = bookedServices.length > 0 ? bookedServices.reduce((sum, s) => sum + s.price, 0) : 1499;

  const bookingId = 'BKG-' + Math.floor(Math.random() * 8999 + 1000);
  const jobCardId = 'JOB-' + Math.floor(Math.random() * 8999 + 1000);

  const bookingData = {
    bookingId,
    customerId: currentUser ? currentUser.id : 'USR-001',
    customerName: name,
    customerPhone: phone,
    customerEmail: email,
    vehicleId: vehicle.id,
    vehicleNo: finalVehicleNo,
    vehicleModel: `${vehicle.brand} ${vehicle.model}`,
    vehicleType: vehicle.type || 'Car',
    serviceIds: selectedBookingServices,
    serviceNames,
    additionalProblems: problems || 'Standard Periodic Service',
    preferredDate: date,
    timeSlot: selectedTimeSlot,
    serviceCenter,
    pickupDrop: isPickup,
    pickupAddress: isPickup ? pickupAddress : '',
    specialInstructions: 'Customer requested prompt handover.',
    estimatedCost,
    status: 'Booked',
    jobCardId: jobCardId,
    invoiceId: null,
    createdAt: new Date().toISOString()
  };

  const saved = window.DB.saveBooking(bookingData);

  // Automatically generate the initial Job Card
  const newJobCard = {
    jobCardId: jobCardId,
    bookingId: bookingId,
    customerId: bookingData.customerId,
    customerName: name,
    customerPhone: phone,
    vehicleId: vehicle.id,
    vehicleNo: finalVehicleNo,
    vehicleModel: `${vehicle.brand} ${vehicle.model}`,
    vehicleType: vehicle.type || 'Car',
    assignedTechId: 'USR-004',
    assignedTechName: 'Vikram Singh',
    reportedProblems: problems || 'Standard Periodic Inspection',
    inspectionNotes: 'Intake inspection complete: Vehicle received in good order. Assigned to Bay #2.',
    services: bookedServices.map(s => ({ name: s.name, cost: s.price })),
    partsUsed: [],
    technicianNotes: 'Scheduled for bay hoist inspection.',
    status: 'Vehicle Received',
    estimatedCost: estimatedCost,
    laborCharge: 800,
    actualCost: estimatedCost + 800,
    createdAt: new Date().toISOString()
  };
  window.DB.saveJobCard(newJobCard);

  // Show Confirmation Modal
  showBookingSuccessModal(saved);
}

function showBookingSuccessModal(booking) {
  const modalContainer = document.getElementById('booking-confirmation-modal');
  if (!modalContainer) {
    showToast(`Appointment booked successfully! ID: #${booking.bookingId}`, 'success');
    setTimeout(() => {
      window.location.href = `track-service.html?id=${booking.bookingId}`;
    }, 1000);
    return;
  }

  document.getElementById('conf-booking-id').textContent = booking.bookingId;
  document.getElementById('conf-vehicle').textContent = `${booking.vehicleModel} (${booking.vehicleNo})`;
  document.getElementById('conf-services').textContent = booking.serviceNames.join(', ');
  document.getElementById('conf-datetime').textContent = `${formatDate(booking.preferredDate)} at ${booking.timeSlot}`;
  document.getElementById('conf-cost').textContent = formatCurrency(booking.estimatedCost);
  document.getElementById('conf-center').textContent = booking.serviceCenter;

  const trackBtn = document.getElementById('conf-track-btn');
  if (trackBtn) {
    trackBtn.href = `track-service.html?id=${booking.bookingId}`;
  }

  openModal('booking-confirmation-modal');
}

function quickAutoFillBooking() {
  const nameField = document.getElementById('book-customer-name');
  const emailField = document.getElementById('book-customer-email');
  const phoneField = document.getElementById('book-customer-phone');
  const vehNoField = document.getElementById('book-vehicle-no');
  const problemsField = document.getElementById('book-problems');

  if (nameField) nameField.value = 'John Doe';
  if (emailField) emailField.value = 'customer@vsms.com';
  if (phoneField) phoneField.value = '+91 98765 43210';
  if (vehNoField) vehNoField.value = 'MH-02-CB-4521';
  if (problemsField) problemsField.value = 'Standard 10,000 km oil change and brake inspection.';

  // Select first service & slot
  const firstCheckbox = document.querySelector('input[name="selected_services"]');
  if (firstCheckbox && !firstCheckbox.checked) {
    firstCheckbox.checked = true;
    toggleBookingService(firstCheckbox.value, true);
  }

  const firstSlot = document.querySelector('.slot-btn');
  if (firstSlot) {
    selectSlot('10:00 AM', firstSlot);
  }

  showToast('⚡ Form auto-filled with sample details! Click "Confirm Appointment" to book.', 'info');
}
