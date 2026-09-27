/**
 * Vehicle Service Management System (VSMS) - Invoice & Billing Module
 */

let currentInvoice = null;

function loadInvoiceView() {
  const container = document.getElementById('invoice-main-container');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const invoiceId = urlParams.get('id');
  
  if (invoiceId) {
    currentInvoice = window.DB.getInvoiceById(invoiceId);
  }

  // Automatic fallback: load the first available invoice
  if (!currentInvoice) {
    const allInvoices = window.DB.getInvoices();
    if (allInvoices && allInvoices.length > 0) {
      currentInvoice = allInvoices[0];
    }
  }

  if (!currentInvoice) {
    container.innerHTML = `
      <div class="text-center" style="padding: 4rem;">
        <h3>No Invoices Available</h3>
        <p class="text-muted">No tax invoice generated yet. Complete a job card to create one.</p>
        <a href="customer-dashboard.html" class="btn btn-primary">Return to Dashboard</a>
      </div>
    `;
    return;
  }

  const isPaid = currentInvoice.paymentStatus === 'Paid';

  // Services Rows
  const serviceRows = (currentInvoice.services || []).map((s, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><b>${s.name}</b> <span class="badge badge-primary">Service Charge</span></td>
      <td class="text-center">1</td>
      <td class="text-right">${formatCurrency(s.amount)}</td>
      <td class="text-right font-bold">${formatCurrency(s.amount)}</td>
    </tr>
  `).join('');

  // Parts Rows
  const partsRows = (currentInvoice.parts || []).map((p, idx) => `
    <tr>
      <td>${(currentInvoice.services || []).length + idx + 1}</td>
      <td><b>${p.name}</b> <span class="badge badge-info">Spare Part</span></td>
      <td class="text-center">${p.qty}</td>
      <td class="text-right">${formatCurrency(p.unitPrice)}</td>
      <td class="text-right font-bold">${formatCurrency(p.total)}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <!-- Action Bar -->
    <div class="no-print" style="display: flex; justify-content: space-between; align-items: center; max-width: 860px; margin: 0 auto 1.5rem; flex-wrap: wrap; gap: 0.75rem;">
      <a href="customer-dashboard.html" class="btn btn-secondary btn-sm">
        <i class="fa-solid fa-arrow-left"></i> Back to Dashboard
      </a>
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <button onclick="window.print()" class="btn btn-secondary btn-sm">
          <i class="fa-solid fa-print"></i> Print Invoice
        </button>
        ${!isPaid ? `
          <button onclick="payWithRazorpay('${currentInvoice.invoiceId}')" class="btn btn-primary btn-sm" style="background: linear-gradient(135deg, #0c2340 0%, #072e5c 100%); border: 1px solid #0284c7; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);">
            <i class="fa-solid fa-bolt text-warning"></i> Pay with Razorpay (${formatCurrency(currentInvoice.grandTotal)})
          </button>
          <button onclick="openPaymentModal('${currentInvoice.invoiceId}')" class="btn btn-success btn-sm">
            <i class="fa-solid fa-credit-card"></i> Pay Online / Cash
          </button>
        ` : `
          <span class="badge badge-success" style="font-size: 0.9rem; padding: 0.5rem 1rem;">
            <i class="fa-solid fa-circle-check"></i> Paid via ${currentInvoice.paymentMethod || 'Razorpay / Online'}
          </span>
        `}
      </div>
    </div>

    <!-- Printable Invoice Container -->
    <div class="invoice-container">
      <!-- Watermark Stamp -->
      <div class="invoice-badge-stamp ${isPaid ? 'paid' : 'pending'}">
        ${isPaid ? 'PAID / SETTLED' : 'PAYMENT PENDING'}
      </div>

      <div class="invoice-header">
        <div>
          <div class="brand-logo" style="margin-bottom: 0.5rem;">
            <div class="logo-icon"><i class="fa-solid fa-car-burst"></i></div>
            <div class="logo-text">VSMS <span>Workshop</span></div>
          </div>
          <p class="text-muted" style="font-size: 0.85rem; margin: 0;">
            Central Automotive Mega Workshop & Spares Hub<br>
            Plot 45, Andheri Industrial Estate, Mumbai, MH 400053<br>
            GSTIN: 27AABCV1234F1Z9 | Helpline: 1800-VSMS-CARE
          </p>
        </div>
        <div style="text-align: right;">
          <h2 style="font-size: 1.75rem; color: var(--primary); margin-bottom: 0.25rem;">TAX INVOICE</h2>
          <div style="font-size: 1.1rem; font-weight: 800;">#${currentInvoice.invoiceId}</div>
          <div class="text-muted" style="font-size: 0.85rem;">Date: ${formatDate(currentInvoice.createdAt)}</div>
          <div class="text-muted" style="font-size: 0.85rem;">Due Date: ${formatDate(currentInvoice.dueDate)}</div>
        </div>
      </div>

      <!-- Customer & Vehicle Meta Grid -->
      <div class="invoice-meta-grid">
        <div class="invoice-meta-block">
          <h5>Billed To:</h5>
          <h4 style="margin-bottom: 0.25rem;">${currentInvoice.customerName}</h4>
          <p class="text-muted" style="font-size: 0.85rem; margin-bottom: 0.25rem;">
            <i class="fa-solid fa-phone"></i> ${currentInvoice.customerPhone || 'N/A'}<br>
            <i class="fa-solid fa-envelope"></i> ${currentInvoice.customerEmail || 'N/A'}<br>
            <i class="fa-solid fa-location-dot"></i> ${currentInvoice.customerAddress || 'Customer Counter'}
          </p>
        </div>
        <div class="invoice-meta-block">
          <h5>Vehicle & Job Reference:</h5>
          <div style="margin-bottom: 0.35rem;"><span class="license-plate">${currentInvoice.vehicleNo}</span></div>
          <h4 style="margin-bottom: 0.25rem; font-size: 1.05rem;">${currentInvoice.vehicleModel} (${currentInvoice.vehicleType})</h4>
          <p class="text-muted" style="font-size: 0.85rem; margin: 0;">
            Job Card Ref: <b>#${currentInvoice.jobCardId || 'JOB-DIRECT'}</b><br>
            Booking Ref: <b>#${currentInvoice.bookingId || 'N/A'}</b>
          </p>
        </div>
      </div>

      <!-- Itemized Breakdown Table -->
      <div class="table-responsive" style="margin-bottom: 2rem;">
        <table class="vsms-table">
          <thead>
            <tr>
              <th style="width: 40px;">#</th>
              <th>Description / Item Details</th>
              <th class="text-center" style="width: 80px;">Qty</th>
              <th class="text-right" style="width: 140px;">Rate (₹)</th>
              <th class="text-right" style="width: 140px;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${serviceRows}
            ${partsRows}
            <tr>
              <td>*</td>
              <td><b>Workshop Certified Labour & Inspection Charges</b></td>
              <td class="text-center">1</td>
              <td class="text-right">${formatCurrency(currentInvoice.laborCharges || 800)}</td>
              <td class="text-right font-bold">${formatCurrency(currentInvoice.laborCharges || 800)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Calculation Totals Summary Box -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 280px; max-width: 440px; font-size: 0.85rem;" class="text-muted">
          ${isPaid ? `
            <div style="background: #ecfdf5; border: 1.5px solid #6ee7b7; border-radius: var(--radius-md); padding: 1.1rem; margin-bottom: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <i class="fa-solid fa-circle-check text-success" style="font-size: 1.3rem;"></i>
                <b style="color: #065f46; font-size: 1rem;">Payment Received & Verified</b>
              </div>
              <div style="font-size: 0.85rem; color: #047857; line-height: 1.7;">
                <div><b>Payment Mode:</b> ${currentInvoice.paymentMethod || 'Razorpay Gateway'}</div>
                <div><b>Transaction Ref:</b> <code style="background: #d1fae5; color: #065f46; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-family: monospace;">${currentInvoice.transactionId || 'TXN-SUCCESS'}</code></div>
                <div><b>Paid Amount:</b> <b style="color: #065f46;">${formatCurrency(currentInvoice.grandTotal)}</b></div>
                <div><b>Payment Date:</b> ${formatDate(currentInvoice.paymentDate || currentInvoice.createdAt)}</div>
                <div style="margin-top: 4px;"><b>Settlement Status:</b> <span class="badge badge-success" style="font-size: 0.75rem; padding: 2px 8px;"><i class="fa-solid fa-check-double"></i> 100% SETTLED</span></div>
              </div>
            </div>
          ` : `
            <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: var(--radius-md); padding: 1.1rem; margin-bottom: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                <i class="fa-solid fa-clock text-warning" style="font-size: 1.25rem;"></i>
                <b style="color: #92400e; font-size: 0.95rem;">Payment Awaiting Clearance</b>
              </div>
              <p style="margin: 0; font-size: 0.8rem; color: #78350f;">
                Please settle the bill via Razorpay, UPI QR, Card, or Cash at the workshop counter before vehicle handover.
              </p>
            </div>
          `}
          <h5 style="color: var(--text-main); margin-bottom: 0.35rem;"><i class="fa-solid fa-shield-halved text-accent"></i> Warranty & Service Terms:</h5>
          <p style="margin-bottom: 0.25rem;">• 6 Months / 5,000 KM comprehensive warranty on replaced OEM spare parts.</p>
          <p style="margin-bottom: 0.25rem;">• 100% genuine parts guarantee with computerized invoice receipt.</p>
        </div>

        <div class="invoice-summary-box">
          <div class="invoice-summary-row">
            <span>Services Total:</span>
            <b>${formatCurrency(currentInvoice.servicesTotal)}</b>
          </div>
          <div class="invoice-summary-row">
            <span>Spare Parts Total:</span>
            <b>${formatCurrency(currentInvoice.partsTotal)}</b>
          </div>
          <div class="invoice-summary-row">
            <span>Labour Charges:</span>
            <b>${formatCurrency(currentInvoice.laborCharges || 800)}</b>
          </div>
          <div class="invoice-summary-row" style="border-top: 1px dashed var(--border-color); padding-top: 0.35rem;">
            <span>Subtotal:</span>
            <b>${formatCurrency(currentInvoice.subtotal)}</b>
          </div>
          <div class="invoice-summary-row text-success">
            <span>Discount (${currentInvoice.discountPercent}%):</span>
            <b>-${formatCurrency(currentInvoice.discountAmount)}</b>
          </div>
          <div class="invoice-summary-row">
            <span>GST (${currentInvoice.taxPercent}%):</span>
            <b>+${formatCurrency(currentInvoice.taxAmount)}</b>
          </div>
          <div class="invoice-summary-row grand-total">
            <span>Total Payable:</span>
            <span>${formatCurrency(currentInvoice.grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Simulation Modal -->
    <div class="modal-backdrop" id="payment-modal">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title"><i class="fa-solid fa-shield-halved text-success"></i> Secure Checkout Simulation</h3>
          <button class="modal-close" onclick="closeModal('payment-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <div style="background: var(--bg-main); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; text-align: center;">
            <span class="text-muted" style="font-size: 0.85rem;">Invoice #${currentInvoice.invoiceId}</span>
            <div style="font-size: 2rem; font-weight: 800; color: var(--primary);">
              ${formatCurrency(currentInvoice.grandTotal)}
            </div>
            <span class="badge badge-primary">Simulated Safe Gateway</span>
          </div>

          <!-- Payment Tabs -->
          <div class="nav-tabs" style="justify-content: space-around; margin-bottom: 1.25rem;">
            <div class="nav-tab-item active" onclick="switchPayTab('razorpay', this)"><i class="fa-solid fa-bolt text-warning"></i> Razorpay</div>
            <div class="nav-tab-item" onclick="switchPayTab('upi', this)"><i class="fa-solid fa-qrcode"></i> UPI / QR</div>
            <div class="nav-tab-item" onclick="switchPayTab('card', this)"><i class="fa-solid fa-credit-card"></i> Card</div>
            <div class="nav-tab-item" onclick="switchPayTab('netbanking', this)"><i class="fa-solid fa-building-columns"></i> Net Banking</div>
            <div class="nav-tab-item" onclick="switchPayTab('cash', this)"><i class="fa-solid fa-money-bill-wave"></i> Cash</div>
          </div>

          <!-- Tab 0: Razorpay -->
          <div id="pay-tab-razorpay" class="pay-tab-content">
            <div style="background: #f0f9ff; border: 1.5px solid #bae6fd; border-radius: var(--radius-md); padding: 1.25rem; text-align: center; margin-bottom: 1rem;">
              <div style="font-size: 1.2rem; font-weight: 800; color: #0369a1; margin-bottom: 0.35rem;">
                <i class="fa-solid fa-shield-halved"></i> Razorpay Gateway Active
              </div>
              <p class="text-muted" style="font-size: 0.85rem; margin: 0;">
                Accepts All Credit/Debit Cards, UPI (GPay, PhonePe, Paytm), 50+ NetBanking Banks & Wallets.
              </p>
            </div>
            <div class="form-group" style="margin-bottom: 0.75rem;">
              <label><i class="fa-solid fa-key text-accent"></i> Razorpay Key ID (Test Mode):</label>
              <input type="text" id="razorpay-key-id" class="form-control" value="rzp_test_Th2Jc6c360hRMO" placeholder="rzp_test_YOUR_KEY_ID" style="font-family: monospace; font-weight: 600;">
              <span class="text-muted" style="font-size: 0.75rem;">Configured with live sandbox key: <b>rzp_test_Th2Jc6c360hRMO</b></span>
            </div>
            <button type="button" class="btn btn-primary btn-block btn-lg" onclick="launchRazorpayFromModal()" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Razorpay Checkout Popup
            </button>
          </div>

          <!-- Tab 1: UPI -->
          <div id="pay-tab-upi" class="pay-tab-content" style="display: none;">
            <div style="text-align: center; margin-bottom: 1rem;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=vsms.workshop@okhdfcbank&pn=VSMS%20Workshop&am=${currentInvoice.grandTotal}&cu=INR" 
                   alt="UPI QR Code" style="margin: 0 auto 0.5rem; border-radius: 8px; border: 2px solid var(--border-color); padding: 5px;">
              <p class="text-muted" style="font-size: 0.8rem;">Scan using GPay, PhonePe, Paytm, or BHIM</p>
            </div>
            <div class="form-group">
              <label>Or Enter Virtual UPI ID:</label>
              <input type="text" id="pay-upi-id" class="form-control" value="john.doe@okaxis" placeholder="username@bank">
            </div>
          </div>

          <!-- Tab 2: Card -->
          <div id="pay-tab-card" class="pay-tab-content" style="display: none;">
            <div class="form-group" style="margin-bottom: 0.75rem;">
              <label>Card Number:</label>
              <input type="text" class="form-control" value="4532 •••• •••• 8829" placeholder="4532 0000 0000 0000">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div class="form-group">
                <label>Expiry (MM/YY):</label>
                <input type="text" class="form-control" value="11/28" placeholder="MM/YY">
              </div>
              <div class="form-group">
                <label>CVV / CVC:</label>
                <input type="password" class="form-control" value="882" placeholder="•••" maxlength="4">
              </div>
            </div>
          </div>

          <!-- Tab 3: Net Banking -->
          <div id="pay-tab-netbanking" class="pay-tab-content" style="display: none;">
            <div class="form-group">
              <label>Select Your Bank:</label>
              <select class="form-control">
                <option selected>HDFC Bank - Retail NetBanking</option>
                <option>State Bank of India (SBI)</option>
                <option>ICICI Bank</option>
                <option>Axis Bank</option>
                <option>Kotak Mahindra Bank</option>
              </select>
            </div>
          </div>

          <!-- Tab 4: Cash -->
          <div id="pay-tab-cash" class="pay-tab-content" style="display: none;">
            <div style="background: #f8fafc; padding: 1rem; border-radius: var(--radius-md); border: 1px dashed var(--border-color); text-align: center;">
              <i class="fa-solid fa-hand-holding-dollar text-success" style="font-size: 2rem; margin-bottom: 0.5rem; display:block;"></i>
              <b>Pay Cash at Workshop Desk</b>
              <p class="text-muted" style="font-size: 0.85rem; margin-top: 0.25rem;">Present invoice #${currentInvoice.invoiceId} to the cashier desk during vehicle handover.</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal('payment-modal')">Cancel</button>
          <button class="btn btn-success btn-lg" onclick="executeSimulatedPayment()">
            <i class="fa-solid fa-lock"></i> Authorize & Pay ${formatCurrency(currentInvoice.grandTotal)}
          </button>
        </div>
      </div>
    </div>
  `;
}

let activePayMethod = 'RAZORPAY';

function switchPayTab(method, tabElem) {
  activePayMethod = method.toUpperCase();
  document.querySelectorAll('.pay-tab-content').forEach(c => c.style.display = 'none');
  document.querySelectorAll('#payment-modal .nav-tab-item').forEach(t => t.classList.remove('active'));

  const tab = document.getElementById(`pay-tab-${method}`);
  if (tab) tab.style.display = 'block';
  if (tabElem) tabElem.classList.add('active');
}

function openPaymentModal(invoiceId) {
  openModal('payment-modal');
}

function payWithRazorpay(invoiceId) {
  const invoice = invoiceId ? window.DB.getInvoiceById(invoiceId) : currentInvoice;
  if (!invoice) return;

  const keyInput = document.getElementById('razorpay-key-id');
  const razorpayKey = (keyInput && keyInput.value.trim()) ? keyInput.value.trim() : 'rzp_test_Th2Jc6c360hRMO';

  // Check if Razorpay library is loaded
  if (typeof Razorpay === 'undefined') {
    showToast('Razorpay Checkout SDK is loading or blocked by adblocker. Opening simulated checkout.', 'warning');
    openPaymentModal(invoice.invoiceId);
    return;
  }

  try {
    const amountInPaise = Math.round(Number(invoice.grandTotal) * 100);

    const options = {
      key: razorpayKey,
      amount: amountInPaise,
      currency: 'INR',
      name: 'VSMS Workshop & AutoCare',
      description: `Payment for Invoice #${invoice.invoiceId} (${invoice.vehicleModel})`,
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=150&q=80',
      prefill: {
        name: invoice.customerName || 'Customer',
        email: invoice.customerEmail || 'customer@vsms.com',
        contact: (invoice.customerPhone || '9876543210').replace(/[^0-9]/g, '').slice(-10)
      },
      notes: {
        invoiceId: invoice.invoiceId,
        vehicleNo: invoice.vehicleNo,
        bookingId: invoice.bookingId || 'N/A'
      },
      theme: {
        color: '#1e3a8a'
      },
      handler: function (response) {
        const paymentId = response.razorpay_payment_id || 'pay_' + String(Date.now());
        const result = window.DB.recordPayment(invoice.invoiceId, 'Razorpay', paymentId);
        
        if (result.success) {
          showToast(`Razorpay Payment Successful! Payment ID: ${paymentId}`, 'success', 'Payment Received');
          loadInvoiceView();
        }
      },
      modal: {
        ondismiss: function () {
          showToast('Razorpay checkout window closed', 'info');
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function (response) {
      showToast(`Payment Failed: ${response.error.description}`, 'danger');
    });
    rzp.open();
  } catch (err) {
    console.error('Razorpay popup error', err);
    // Smooth fallback if test key fails or offline
    showToast('Razorpay initialization fallback triggered', 'info');
    openPaymentModal(invoice.invoiceId);
  }
}

function launchRazorpayFromModal() {
  closeModal('payment-modal');
  payWithRazorpay(currentInvoice.invoiceId);
}

function executeSimulatedPayment() {
  if (!currentInvoice) return;

  const result = window.DB.recordPayment(currentInvoice.invoiceId, activePayMethod);
  if (result.success) {
    closeModal('payment-modal');
    showToast(`Payment of ₹${result.invoice.grandTotal.toLocaleString()} Successful! Transaction ID: ${result.transactionId}`, 'success', 'Payment Received');
    loadInvoiceView();
  } else {
    showToast(result.message || 'Payment simulation failed', 'danger');
  }
}
