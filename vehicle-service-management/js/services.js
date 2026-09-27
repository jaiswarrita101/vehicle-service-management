/**
 * Vehicle Service Management System (VSMS) - Service Catalogue Module
 */

function renderServiceCards(containerId, servicesList, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const displayList = limit ? servicesList.slice(0, limit) : servicesList;

  if (displayList.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #fff; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <i class="fa-solid fa-car-tunnel" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
        <h3>No services found</h3>
        <p class="text-muted">Try adjusting your filters or search keywords.</p>
        <button class="btn btn-outline btn-sm" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = displayList.map(s => {
    const badgeHtml = s.badge ? `<span class="badge badge-primary service-card-badge">${s.badge}</span>` : '';
    const ratingStars = '<i class="fa-solid fa-star"></i>'.repeat(Math.floor(s.rating));

    return `
      <div class="service-card" data-id="${s.id}">
        <div class="service-card-img-wrap">
          <img src="${s.image}" alt="${s.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80'">
          ${badgeHtml}
          <div class="service-card-cat"><i class="fa-solid fa-wrench"></i> ${s.category}</div>
        </div>
        <div class="service-card-body">
          <h3 class="service-card-title">${s.name}</h3>
          <p class="service-card-desc">${s.shortDesc}</p>
          <div class="service-card-meta">
            <span><i class="fa-regular fa-clock"></i> ${s.duration}</span>
            <span><span class="rating-stars">${ratingStars}</span> <b>${s.rating}</b> (${s.reviewsCount})</span>
          </div>
          <div class="service-card-price-row">
            <div class="service-price">${formatCurrency(s.price)} <span>+ taxes</span></div>
            <div class="text-muted" style="font-size: 0.75rem;"><i class="fa-solid fa-car-side"></i> ${s.vehicleTypes.join(', ')}</div>
          </div>
          <div class="service-card-actions">
            <a href="booking.html?serviceId=${s.id}" class="btn btn-primary btn-sm">
              <i class="fa-solid fa-calendar-check"></i> Book Now
            </a>
            <a href="service-details.html?id=${s.id}" class="btn btn-secondary btn-sm" title="View Details">
              <i class="fa-solid fa-circle-info"></i> Details
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Service Filter Manager for services.html
function initServiceCatalogue() {
  const container = document.getElementById('services-grid-container');
  if (!container) return;

  // Read URL query params
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search') || '';
  const catParam = urlParams.get('category') || 'All';
  const typeParam = urlParams.get('vehicleType') || 'All';

  // Set initial filter input values
  const searchInput = document.getElementById('filter-search');
  const catSelect = document.getElementById('filter-category');
  const typeSelect = document.getElementById('filter-vehicle-type');
  const sortSelect = document.getElementById('filter-sort');
  const priceRange = document.getElementById('filter-price-range');
  const priceValue = document.getElementById('price-range-value');

  if (searchInput) searchInput.value = searchParam;
  if (catSelect) catSelect.value = catParam;
  if (typeSelect) typeSelect.value = typeParam;

  function applyFilters() {
    const filters = {
      search: searchInput ? searchInput.value.trim() : '',
      category: catSelect ? catSelect.value : 'All',
      vehicleType: typeSelect ? typeSelect.value : 'All',
      maxPrice: priceRange ? priceRange.value : null,
      sortBy: sortSelect ? sortSelect.value : 'popularity'
    };

    if (priceValue && priceRange) {
      priceValue.textContent = 'Up to ' + formatCurrency(priceRange.value);
    }

    const filtered = window.DB.getServices(filters);
    renderServiceCards('services-grid-container', filtered);

    const countElem = document.getElementById('services-count');
    if (countElem) countElem.textContent = `${filtered.length} Services available`;

    // Update active state of filter pills if present
    document.querySelectorAll('.filter-pill').forEach(pill => {
      if (pill.dataset.category === filters.category) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  // Attach event listeners
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (catSelect) catSelect.addEventListener('change', applyFilters);
  if (typeSelect) typeSelect.addEventListener('change', applyFilters);
  if (sortSelect) sortSelect.addEventListener('change', applyFilters);
  if (priceRange) priceRange.addEventListener('input', applyFilters);

  // Category pills click handler
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.dataset.category || 'All';
      if (catSelect) catSelect.value = cat;
      applyFilters();
    });
  });

  applyFilters();
}

function resetFilters() {
  const searchInput = document.getElementById('filter-search');
  const catSelect = document.getElementById('filter-category');
  const typeSelect = document.getElementById('filter-vehicle-type');
  const sortSelect = document.getElementById('filter-sort');
  const priceRange = document.getElementById('filter-price-range');

  if (searchInput) searchInput.value = '';
  if (catSelect) catSelect.value = 'All';
  if (typeSelect) typeSelect.value = 'All';
  if (sortSelect) sortSelect.value = 'popularity';
  if (priceRange) priceRange.value = 10000;

  initServiceCatalogue();
}

// Service Details Page Loader
function loadServiceDetails() {
  const detailContainer = document.getElementById('service-detail-view');
  if (!detailContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const serviceId = urlParams.get('id') || 'SRV-001';
  const service = window.DB.getServiceById(serviceId);

  if (!service) {
    detailContainer.innerHTML = `
      <div class="text-center" style="padding: 4rem;">
        <h2>Service not found</h2>
        <p class="text-muted">The requested service could not be located.</p>
        <a href="services.html" class="btn btn-primary">Browse All Services</a>
      </div>
    `;
    return;
  }

  // Set document title
  document.title = `${service.name} | VSMS`;

  const partsDetails = (service.requiredParts || []).map(pid => {
    const part = window.DB.getPartById(pid);
    return part ? `<li><i class="fa-solid fa-cube text-accent"></i> ${part.name} (₹${part.unitPrice})</li>` : `<li><i class="fa-solid fa-cube text-accent"></i> OEM Genuine Spare Part</li>`;
  }).join('');

  const includedItems = (service.includedWork || []).map(item => `
    <li style="display: flex; align-items: flex-start; gap: 0.65rem; margin-bottom: 0.75rem;">
      <i class="fa-solid fa-circle-check text-success" style="margin-top: 0.25rem;"></i>
      <span>${item}</span>
    </li>
  `).join('');

  detailContainer.innerHTML = `
    <div class="dashboard-grid-2" style="margin-top: 2rem;">
      <div>
        <div class="dashboard-card">
          <div style="height: 340px; position: relative; overflow: hidden;">
            <img src="${service.image}" alt="${service.name}" style="width: 100%; height: 100%; object-fit: cover;">
            <div style="position: absolute; bottom: 15px; left: 15px;">
              <span class="badge badge-primary">${service.category}</span>
              ${service.badge ? `<span class="badge badge-success" style="margin-left: 5px;">${service.badge}</span>` : ''}
            </div>
          </div>
          <div class="dashboard-card-body">
            <h1 style="font-size: 2rem; margin-bottom: 0.75rem;">${service.name}</h1>
            <div class="service-card-meta" style="margin-bottom: 1.5rem;">
              <span><i class="fa-regular fa-clock"></i> Estimated Duration: <b>${service.duration}</b></span>
              <span><span class="rating-stars">${'<i class="fa-solid fa-star"></i>'.repeat(Math.floor(service.rating))}</span> <b>${service.rating} / 5.0</b> (${service.reviewsCount} customer reviews)</span>
            </div>

            <h4 style="margin-bottom: 0.75rem;">Overview & Scope of Work</h4>
            <p style="font-size: 1rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 2rem;">${service.fullDesc}</p>

            <h4 style="margin-bottom: 1rem;">What's Included in this Service</h4>
            <ul style="margin-bottom: 2rem;">
              ${includedItems}
            </ul>

            <h4 style="margin-bottom: 1rem;">Spare Parts & Consumables Included</h4>
            <ul style="margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.5rem;">
              ${partsDetails || '<li><i class="fa-solid fa-check text-success"></i> All standard shop lubricants & cleaners included</li>'}
            </ul>

            <h4 style="margin-bottom: 1rem;">Customer Ratings & Verified Feedback</h4>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div style="background: var(--bg-main); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
                  <b>Rajesh M. (Verified Honda City Owner)</b>
                  <span class="rating-stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></span>
                </div>
                <p class="text-muted" style="margin: 0; font-size: 0.9rem;">"Extremely thorough inspection and service. The engine is running ultra smooth and fuel economy improved by 2 km/l."</p>
              </div>
              <div style="background: var(--bg-main); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
                  <b>Sneha K. (Verified Creta Owner)</b>
                  <span class="rating-stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i></span>
                </div>
                <p class="text-muted" style="margin: 0; font-size: 0.9rem;">"Super professional service advisors. Received WhatsApp tracking updates and pickup/drop was right on time."</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="dashboard-card" style="position: sticky; top: 90px;">
          <div class="dashboard-card-header">
            <h3><i class="fa-solid fa-receipt text-accent"></i> Service Pricing</h3>
          </div>
          <div class="dashboard-card-body">
            <div style="margin-bottom: 1.5rem;">
              <span class="text-muted" style="font-size: 0.85rem;">Estimated Total</span>
              <div style="font-size: 2.25rem; font-weight: 800; color: var(--primary); line-height: 1;">
                ${formatCurrency(service.price)}
              </div>
              <span class="text-muted" style="font-size: 0.8rem;">Inclusive of standard labor & taxes</span>
            </div>

            <div style="background: var(--bg-main); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; font-size: 0.85rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Vehicle Compatibility:</span>
                <b>${service.vehicleTypes.join(', ')}</b>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Estimated Time:</span>
                <b>${service.duration}</b>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Service Warranty:</span>
                <b class="text-success">6 Months / 5,000 KM</b>
              </div>
            </div>

            <a href="booking.html?serviceId=${service.id}" class="btn btn-primary btn-block btn-lg" style="margin-bottom: 0.75rem;">
              <i class="fa-solid fa-calendar-check"></i> Book This Service
            </a>
            <a href="services.html" class="btn btn-secondary btn-block">
              <i class="fa-solid fa-arrow-left"></i> Explore Other Services
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}
