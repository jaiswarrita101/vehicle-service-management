/**
 * Vehicle Service Management System (VSMS) - Inventory Management Module
 */

function renderInventoryTable(containerId = 'inventory-table-body', filter = {}) {
  const tbody = document.getElementById(containerId);
  if (!tbody) return;

  const parts = window.DB.getInventory(filter);

  // Update counter badges
  const totalPartsElem = document.getElementById('stat-total-parts');
  const lowStockElem = document.getElementById('stat-low-stock');
  const outOfStockElem = document.getElementById('stat-out-stock');

  if (totalPartsElem) totalPartsElem.textContent = parts.length;
  if (lowStockElem) lowStockElem.textContent = parts.filter(p => p.stockStatus === 'Low Stock').length;
  if (outOfStockElem) outOfStockElem.textContent = parts.filter(p => p.stockStatus === 'Out of Stock').length;

  if (parts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center" style="padding: 2.5rem;">
          <i class="fa-solid fa-boxes-stacked" style="font-size: 2.5rem; color: var(--text-light); margin-bottom: 0.5rem; display:block;"></i>
          <b>No inventory parts match the selected criteria</b>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = parts.map((p, idx) => {
    return `
      <tr>
        <td><b>${p.partId}</b></td>
        <td>
          <div style="font-weight: 700;">${p.name}</div>
          <span class="text-muted" style="font-size: 0.75rem;">Supplier: ${p.supplier || 'OEM Genuine'}</span>
        </td>
        <td><span class="badge badge-primary">${p.category}</span></td>
        <td style="font-size: 0.85rem;">${p.compatibleVehicles}</td>
        <td class="text-center">
          <b style="font-size: 1.05rem; ${p.quantity <= p.minStock ? 'color: var(--danger);' : ''}">${p.quantity}</b>
          <span class="text-muted" style="font-size: 0.7rem; display:block;">(Min: ${p.minStock})</span>
        </td>
        <td class="text-right font-bold">${formatCurrency(p.unitPrice)}</td>
        <td>${getStatusBadge(p.stockStatus)}</td>
        <td class="text-right">
          <div style="display: flex; gap: 0.35rem; justify-content: flex-end;">
            <button class="btn btn-secondary btn-sm" onclick="quickRestock('${p.partId}')" title="Quick Restock +10 units">
              <i class="fa-solid fa-plus text-success"></i> +10
            </button>
            <button class="btn btn-secondary btn-sm" onclick="editPartModal('${p.partId}')" title="Edit Part">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-secondary btn-sm text-danger" onclick="deletePartConfirm('${p.partId}')" title="Delete">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function initInventoryManager() {
  const searchInput = document.getElementById('inv-search');
  const catFilter = document.getElementById('inv-category-filter');
  const statusFilter = document.getElementById('inv-status-filter');

  function applyInvFilters() {
    const filter = {
      search: searchInput ? searchInput.value.trim() : '',
      category: catFilter ? catFilter.value : 'All',
      stockStatus: statusFilter ? statusFilter.value : 'All'
    };
    renderInventoryTable('inventory-table-body', filter);
  }

  if (searchInput) searchInput.addEventListener('input', applyInvFilters);
  if (catFilter) catFilter.addEventListener('change', applyInvFilters);
  if (statusFilter) statusFilter.addEventListener('change', applyInvFilters);

  renderInventoryTable('inventory-table-body');
}

function openAddPartModal(partId = null) {
  const modal = document.getElementById('part-modal');
  if (!modal) return;

  const form = document.getElementById('part-form');
  const title = document.getElementById('part-modal-title');

  if (partId) {
    const part = window.DB.getPartById(partId);
    if (!part) return;
    title.textContent = 'Edit Spare Part';
    document.getElementById('part-id').value = part.partId;
    document.getElementById('part-name').value = part.name;
    document.getElementById('part-category').value = part.category;
    document.getElementById('part-vehicles').value = part.compatibleVehicles;
    document.getElementById('part-qty').value = part.quantity;
    document.getElementById('part-min-stock').value = part.minStock;
    document.getElementById('part-price').value = part.unitPrice;
    document.getElementById('part-supplier').value = part.supplier || '';
  } else {
    title.textContent = 'Add New Spare Part';
    form.reset();
    document.getElementById('part-id').value = '';
    document.getElementById('part-qty').value = 20;
    document.getElementById('part-min-stock').value = 8;
  }

  openModal('part-modal');
}

function handlePartFormSubmit(e) {
  e.preventDefault();

  const partId = document.getElementById('part-id').value;
  const name = document.getElementById('part-name').value.trim();
  const category = document.getElementById('part-category').value;
  const compatibleVehicles = document.getElementById('part-vehicles').value.trim();
  const quantity = Number(document.getElementById('part-qty').value);
  const minStock = Number(document.getElementById('part-min-stock').value);
  const unitPrice = Number(document.getElementById('part-price').value);
  const supplier = document.getElementById('part-supplier').value.trim();

  if (!name || !category || isNaN(quantity) || isNaN(unitPrice)) {
    showToast('Please fill all mandatory fields properly', 'warning');
    return;
  }

  const partObj = {
    partId: partId || undefined,
    name,
    category,
    compatibleVehicles: compatibleVehicles || 'Universal Fitment',
    quantity,
    minStock,
    unitPrice,
    supplier: supplier || 'OEM Supplier'
  };

  window.DB.savePart(partObj);
  closeModal('part-modal');
  showToast(partId ? 'Spare part details updated' : 'New spare part added to inventory', 'success');
  renderInventoryTable('inventory-table-body');
}

function quickRestock(partId) {
  const part = window.DB.getPartById(partId);
  if (part) {
    const updated = window.DB.updateStock(partId, part.quantity + 10);
    showToast(`Restocked +10 units for ${updated.name}. Total: ${updated.quantity}`, 'success');
    renderInventoryTable('inventory-table-body');
  }
}

function editPartModal(partId) {
  openAddPartModal(partId);
}

function deletePartConfirm(partId) {
  if (confirm(`Are you sure you want to delete SKU #${partId}?`)) {
    window.DB.deletePart(partId);
    showToast('Spare part deleted from database', 'info');
    renderInventoryTable('inventory-table-body');
  }
}
