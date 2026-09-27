/**
 * Vehicle Service Management System (VSMS) - Authentication Module
 */

function handleLogin(e) {
  e.preventDefault();
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const roleSelect = document.getElementById('login-role');

  const email = emailInput ? emailInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value : '';

  if (!email || !password) {
    showToast('Please enter both email and password', 'warning');
    return;
  }

  const result = window.DB.login(email, password);

  if (result.success) {
    const user = result.user;
    showToast(`Welcome back, ${user.name}! (${user.role.toUpperCase()})`, 'success');
    
    setTimeout(() => {
      redirectByRole(user.role);
    }, 600);
  } else {
    showToast(result.message || 'Invalid email or password', 'danger');
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const password = document.getElementById('reg-password').value;
  const role = document.getElementById('reg-role').value;
  const address = document.getElementById('reg-address') ? document.getElementById('reg-address').value.trim() : '';

  if (!name || !email || !phone || !password) {
    showToast('Please fill all required fields', 'warning');
    return;
  }

  // Check existing user
  if (window.DB.getUserByEmail(email)) {
    showToast('A user with this email address already exists.', 'danger');
    return;
  }

  const newUser = {
    name,
    email,
    phone,
    password,
    role,
    address: address || 'Not specified',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  };

  const savedUser = window.DB.saveUser(newUser);
  window.DB.setCurrentUser(savedUser);

  showToast('Account created successfully! Redirecting...', 'success');
  setTimeout(() => {
    redirectByRole(savedUser.role);
  }, 600);
}

// Quick Demo Login Helper
function quickDemoLogin(role) {
  const credentials = {
    customer: { email: 'customer@vsms.com', pass: 'password123' },
    advisor: { email: 'advisor@vsms.com', pass: 'password123' },
    technician: { email: 'technician@vsms.com', pass: 'password123' },
    inventory: { email: 'inventory@vsms.com', pass: 'password123' },
    admin: { email: 'admin@vsms.com', pass: 'password123' }
  };

  const cred = credentials[role];
  if (!cred) return;

  const emailField = document.getElementById('login-email');
  const passField = document.getElementById('login-password');
  const roleSelect = document.getElementById('login-role');

  if (emailField) emailField.value = cred.email;
  if (passField) passField.value = cred.pass;
  if (roleSelect) roleSelect.value = role;

  const result = window.DB.login(cred.email, cred.pass);
  if (result.success) {
    showToast(`Logged in as ${role.toUpperCase()}: ${result.user.name}`, 'success');
    setTimeout(() => {
      redirectByRole(role);
    }, 500);
  }
}

function redirectByRole(role) {
  const rolePages = {
    customer: 'customer-dashboard.html',
    advisor: 'advisor-dashboard.html',
    technician: 'technician-dashboard.html',
    inventory: 'inventory-dashboard.html',
    admin: 'admin-dashboard.html'
  };

  window.location.href = rolePages[role] || 'customer-dashboard.html';
}

// Route Guard Check for Dashboards
function checkAuthGuard(requiredRole = null) {
  const currentUser = window.DB.getCurrentUser();
  if (!currentUser) {
    showToast('Please login to access this page', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 400);
    return null;
  }

  if (requiredRole && currentUser.role !== requiredRole && currentUser.role !== 'admin') {
    showToast(`Unauthorized access. Required: ${requiredRole}`, 'danger');
    setTimeout(() => {
      redirectByRole(currentUser.role);
    }, 400);
    return null;
  }

  return currentUser;
}
