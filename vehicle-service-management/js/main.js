/**
 * Vehicle Service Management System (VSMS) - Main UI & Global Utilities
 */

// Toast Notifications Helper
function showToast(message, type = 'info', title = '') {
  let container = document.getElementById('vsms-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'vsms-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: 'fa-circle-check',
    danger: 'fa-circle-xmark',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info'
  };

  const defaultTitles = {
    success: 'Success',
    danger: 'Error',
    warning: 'Attention',
    info: 'Notice'
  };

  toast.innerHTML = `
    <i class="fa-solid ${iconMap[type] || 'fa-bell'} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title || defaultTitles[type] || 'Notification'}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

// Modal Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// Format Currency
function formatCurrency(amount) {
  return '₹' + Number(amount || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
}

// Format Date
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

// Format Status Badge
function getStatusBadge(status) {
  const map = {
    'Booked': 'badge-primary',
    'Vehicle Received': 'badge-info',
    'Inspection': 'badge-warning',
    'Job Card Created': 'badge-info',
    'Technician Assigned': 'badge-primary',
    'Repair/Service In Progress': 'badge-warning badge-pulse',
    'Quality Check': 'badge-info',
    'Ready for Delivery': 'badge-success badge-pulse',
    'Completed': 'badge-success',
    'Cancelled': 'badge-danger',
    'Active': 'badge-success',
    'In Service': 'badge-warning',
    'In Stock': 'badge-success',
    'Low Stock': 'badge-warning badge-pulse',
    'Out of Stock': 'badge-danger',
    'Paid': 'badge-success',
    'Pending': 'badge-warning',
    'Partially Paid': 'badge-info'
  };

  const badgeClass = map[status] || 'badge-dark';
  return `<span class="badge ${badgeClass}">${status}</span>`;
}

// Render Global Navbar & Auth State
function initNavbar() {
  const navContainer = document.querySelector('.vsms-navbar');
  if (!navContainer) return;

  const currentUser = window.DB ? window.DB.getCurrentUser() : null;
  const navCta = document.querySelector('.nav-cta-group');

  if (navCta) {
    if (currentUser) {
      let dashboardUrl = 'customer-dashboard.html';
      if (currentUser.role === 'advisor') dashboardUrl = 'advisor-dashboard.html';
      else if (currentUser.role === 'technician') dashboardUrl = 'technician-dashboard.html';
      else if (currentUser.role === 'inventory') dashboardUrl = 'inventory-dashboard.html';
      else if (currentUser.role === 'admin') dashboardUrl = 'admin-dashboard.html';

      navCta.innerHTML = `
        <a href="${dashboardUrl}" class="btn btn-primary btn-sm">
          <i class="fa-solid fa-gauge-high"></i> Dashboard (${currentUser.name.split(' ')[0]})
        </a>
        <button onclick="logoutUser()" class="btn btn-secondary btn-sm" title="Logout">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      `;
    } else {
      navCta.innerHTML = `
        <a href="login.html" class="btn btn-outline btn-sm">
          <i class="fa-solid fa-right-to-bracket"></i> Login
        </a>
        <a href="register.html" class="btn btn-primary btn-sm">
          <i class="fa-solid fa-user-plus"></i> Register
        </a>
      `;
    }
  }

  // Mobile menu toggle
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }
}

// Logout handler
function logoutUser() {
  if (window.DB) {
    window.DB.logout();
    showToast('Logged out successfully', 'info');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 500);
  }
}

// Quick Search from Homepage
function handleQuickSearch(e) {
  e.preventDefault();
  const searchInput = document.getElementById('quick-search-input');
  const catSelect = document.getElementById('quick-category-select');
  const typeSelect = document.getElementById('quick-vehicletype-select');

  const params = new URLSearchParams();
  if (searchInput && searchInput.value) params.set('search', searchInput.value);
  if (catSelect && catSelect.value && catSelect.value !== 'All') params.set('category', catSelect.value);
  if (typeSelect && typeSelect.value && typeSelect.value !== 'All') params.set('vehicleType', typeSelect.value);

  window.location.href = 'services.html?' + params.toString();
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
});
