/**
 * Vehicle Service Management System (VSMS) - Vehicle Management Module
 */

function renderVehicleGrid(containerId, customerId = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const vehicles = window.DB.getVehicles(customerId);

  if (vehicles.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #fff; border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
        <i class="fa-solid fa-car-side" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
        <h4>No vehicles registered yet</h4>
        <p class="text-muted">Add your car, bike or scooter to easily book services and receive maintenance alerts.</p>
        <button class="btn btn-primary btn-sm" onclick="openAddVehicleModal()">
          <i class="fa-solid fa-plus"></i> Add New Vehicle
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = vehicles.map(v => {
    return `
      <div class="vehicle-profile-card">
        <div class="vehicle-img-header">
          <img src="${v.image || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80'}" alt="${v.brand} ${v.model}">
          <div class="vehicle-type-tag"><i class="fa-solid fa-${v.type.toLowerCase() === 'bike' || v.type.toLowerCase() === 'scooter' ? 'motorcycle' : 'car'}"></i> ${v.type}</div>
        </div>
        <div class="vehicle-card-details">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <span class="license-plate">${v.vehicleNo}</span>
            ${getStatusBadge(v.status || 'Active')}
          </div>
          <h3 style="font-size: 1.15rem; margin-bottom: 0.25rem;">${v.brand} ${v.model}</h3>
          <p class="text-muted" style="font-size: 0.85rem; margin-bottom: 0.5rem;">${v.variant} (${v.year})</p>

          <div class="vehicle-card-specs">
            <div class="spec-item">
              <span>Fuel Type</span>
              <span><i class="fa-solid fa-gas-pump"></i> ${v.fuelType}</span>
            </div>
            <div class="spec-item">
              <span>Odometer</span>
              <span><i class="fa-solid fa-gauge"></i> ${Number(v.currentKm).toLocaleString()} KM</span>
            </div>
            <div class="spec-item">
              <span>Last Service</span>
              <span><i class="fa-regular fa-calendar-check"></i> ${formatDate(v.lastServiceDate)}</span>
            </div>
            <div class="spec-item">
              <span>Next Due</span>
              <span class="text-warning"><i class="fa-regular fa-clock"></i> ${formatDate(v.nextServiceDue)}</span>
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem; margin-top: auto;">
            <a href="booking.html?vehicleId=${v.id}" class="btn btn-primary btn-sm btn-block">
              <i class="fa-solid fa-calendar-plus"></i> Book Service
            </a>
            <button class="btn btn-secondary btn-sm" onclick="editVehicle('${v.id}')" title="Edit Vehicle">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn btn-secondary btn-sm text-danger" onclick="confirmDeleteVehicle('${v.id}')" title="Delete">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openAddVehicleModal(vehicleId = null) {
  const modal = document.getElementById('vehicle-modal');
  if (!modal) return;

  const titleElem = document.getElementById('vehicle-modal-title');
  const form = document.getElementById('vehicle-form');

  if (vehicleId) {
    const v = window.DB.getVehicleById(vehicleId);
    if (!v) return;
    titleElem.textContent = 'Edit Vehicle Profile';
    document.getElementById('veh-id').value = v.id;
    document.getElementById('veh-no').value = v.vehicleNo;
    document.getElementById('veh-type').value = v.type;
    document.getElementById('veh-brand').value = v.brand;
    document.getElementById('veh-model').value = v.model;
    document.getElementById('veh-variant').value = v.variant;
    document.getElementById('veh-year').value = v.year;
    document.getElementById('veh-fuel').value = v.fuelType;
    document.getElementById('veh-km').value = v.currentKm;
    document.getElementById('veh-color').value = v.color;
  } else {
    titleElem.textContent = 'Add New Vehicle';
    form.reset();
    document.getElementById('veh-id').value = '';
    document.getElementById('veh-year').value = 2023;
  }

  openModal('vehicle-modal');
}

function handleVehicleFormSubmit(e) {
  e.preventDefault();
  const currentUser = window.DB.getCurrentUser();
  const id = document.getElementById('veh-id').value;
  const vehicleNo = document.getElementById('veh-no').value.toUpperCase().trim();
  const type = document.getElementById('veh-type').value;
  const brand = document.getElementById('veh-brand').value.trim();
  const model = document.getElementById('veh-model').value.trim();
  const variant = document.getElementById('veh-variant').value.trim();
  const year = Number(document.getElementById('veh-year').value);
  const fuelType = document.getElementById('veh-fuel').value;
  const currentKm = Number(document.getElementById('veh-km').value);
  const color = document.getElementById('veh-color').value.trim();

  if (!vehicleNo || !brand || !model) {
    showToast('Please fill all mandatory vehicle details', 'warning');
    return;
  }

  // Auto assign vehicle image based on type
  let image = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80';
  if (type === 'SUV') image = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80';
  else if (type === 'Bike') image = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80';
  else if (type === 'Scooter') image = 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80';
  else if (type === 'Hatchback') image = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80';

  const nextDue = new Date();
  nextDue.setMonth(nextDue.getMonth() + 6);

  const vehicleObj = {
    id: id || undefined,
    customerId: currentUser ? currentUser.id : 'USR-001',
    ownerName: currentUser ? currentUser.name : 'John Doe',
    vehicleNo,
    type,
    brand,
    model,
    variant: variant || 'Standard Variant',
    year: year || 2023,
    fuelType,
    currentKm: currentKm || 10000,
    color: color || 'Metallic Silver',
    lastServiceDate: new Date().toISOString().split('T')[0],
    nextServiceDue: nextDue.toISOString().split('T')[0],
    image,
    status: 'Active'
  };

  window.DB.saveVehicle(vehicleObj);
  closeModal('vehicle-modal');
  showToast(id ? 'Vehicle details updated' : 'New vehicle registered successfully!', 'success');

  // Re-render
  if (typeof loadCustomerDashboard === 'function') {
    loadCustomerDashboard();
  } else {
    renderVehicleGrid('my-vehicles-grid', currentUser ? currentUser.id : null);
  }
}

function editVehicle(id) {
  openAddVehicleModal(id);
}

function confirmDeleteVehicle(id) {
  if (confirm('Are you sure you want to remove this vehicle profile?')) {
    window.DB.deleteVehicle(id);
    showToast('Vehicle removed', 'info');
    const currentUser = window.DB.getCurrentUser();
    renderVehicleGrid('my-vehicles-grid', currentUser ? currentUser.id : null);
  }
}
