/* ════════════════════════════════════════════════════════════════════
   EKO MOTO — main.js  (shared across ALL pages)
   ================================================================== */

/* ─── PRODUCT IMAGES ── */
const JACKET_IMAGES = {
  1:  { src: "assets/images/EKO RS-01 PRO.jpg",                  alt: "EKO RS-01 Pro" },
  2:  { src: "assets/images/EKO GT LEATHER.jpg",                 alt: "EKO GT Leather" },
  3:  { src: "assets/images/EKO TOUR X.jpg",                     alt: "EKO Tour X" },
  4:  { src: "assets/images/EKO APEX URBAN.jpg",                 alt: "EKO Apex Urban" },
  5:  { src: "assets/images/EKO CIRCUIT 4S.jpg",                 alt: "EKO Circuit 4S" },
  6:  { src: "assets/images/EKO MILES TOURER.jpg",               alt: "EKO Miles Tourer" },
  7:  { src: "assets/images/EKO STREET S2.jpg",                  alt: "EKO Street S2" },
  8:  { src: "assets/images/EKO ENDURANCE R.jpg",                alt: "EKO Endurance R" },
  9:  { src: "assets/images/EKO VRCR 4 PRO MOTO GLOVES.jpg",    alt: "EKO VRCR 4 Pro Moto Gloves" },
  10: { src: "assets/images/EKO BERIK 2.0 MOTO GLOVES.jpg",     alt: "EKO Berik 2.0 Moto Gloves" },
  11: { src: "assets/images/EKO IXON VORTEX MOTO GLOVES.jpg",   alt: "EKO IXON Vortex Moto Gloves" },
  12: { src: "assets/images/EKO RFX EVO 4 MOTO GLOVES.jpg",     alt: "EKO RFX Evo 4 Moto Gloves" },
  13: { src: "assets/images/EKO RST RACE PANTS.jpg",             alt: "EKO RST Race Pants" },
  14: { src: "assets/images/EKO KLIM MOJAVE RACE PANTS.jpg",     alt: "EKO KLIM Mojave Race Pants" },
  15: { src: "assets/images/EKO FALLING KNIGHT RACE PANTS.jpg",  alt: "EKO Falling Knight Race Pants" },
  16: { src: "assets/images/EKO FOX RACE PANTS BLACK AND WHITE.jpg", alt: "EKO Fox Race Pants" },
};

/* ─── LOCALSTORAGE ── */
function saveCart(data)  { localStorage.setItem('eko_cart',     JSON.stringify(data)); }
function loadCart()      { try { return JSON.parse(localStorage.getItem('eko_cart')) || []; } catch { return []; } }
function saveOrder(d)    { localStorage.setItem('eko_order',    JSON.stringify(d)); }
function loadOrder()     { try { return JSON.parse(localStorage.getItem('eko_order')) || null; } catch { return null; } }
function saveCustomer(d) { localStorage.setItem('eko_customer', JSON.stringify(d)); }

/* ─── CART STATE ── */
let cart = loadCart();
function cartTotal() { return cart.reduce((sum, i) => sum + i.product.price * i.qty, 0); }

/* ─── IMAGE HELPER ── */
function jacketImg(productId, isModal = false) {
  const img = JACKET_IMAGES[productId] || { src: '', alt: 'Product' };
  const cls = isModal ? 'modal-jacket-img' : 'card-jacket-img';
  if (!img.src) {
    return `<div class="img-placeholder"><span>📷</span><small>product-${productId}.jpg</small></div>`;
  }
  return `<img class="${cls}" src="${img.src}" alt="${img.alt}"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="img-placeholder" style="display:none"><span>📷</span><small>${img.src}</small></div>`;
}

/* ─── CART COUNT BADGE ── */
function updateCartCount() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  badge.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

/* ─── TOAST ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ─── DARK MODE ── */
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('eko_theme', isDark ? 'dark' : 'light');
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = isDark ? '☀️' : '🌙';
}
function applySavedTheme() {
  const saved = localStorage.getItem('eko_theme');
  if (saved === 'dark') {
    document.body.classList.add('dark');
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = '☀️';
  }
}

/* ─── MOBILE NAV ── */
function toggleMobileNav() {
  const links = document.querySelector('.nav-links');
  const ham   = document.getElementById('hamburger');
  if (!links) return;
  links.classList.toggle('mobile-open');
  if (ham) ham.classList.toggle('active');
}
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      document.querySelector('.nav-links')?.classList.remove('mobile-open');
      document.getElementById('hamburger')?.classList.remove('active');
    });
  });
});

/* ════════════════════════════════════════════════════════════════════
   AUTH — Login / Signup / Logout / Edit Profile
   Uses localStorage. Age verification (18+) on signup.
   Tracks login/signup history for user reference.
   ================================================================== */
function getUser()      { try { return JSON.parse(localStorage.getItem('eko_user')) || null; } catch { return null; } }
function saveUser(data) { localStorage.setItem('eko_user', JSON.stringify(data)); }

/* ── Track login history ── */
function logLoginAttempt(email, success) {
  let loginHistory = [];
  try { loginHistory = JSON.parse(localStorage.getItem('eko_login_history')) || []; } catch {}
  
  loginHistory.push({
    email: email.toLowerCase(),
    timestamp: new Date().toISOString(),
    success: success
  });
  
  // Keep only last 50 login attempts
  if (loginHistory.length > 50) loginHistory = loginHistory.slice(-50);
  localStorage.setItem('eko_login_history', JSON.stringify(loginHistory));
}

/* ── Get last login date for a user ── */
function getLastLoginDate(email) {
  let loginHistory = [];
  try { loginHistory = JSON.parse(localStorage.getItem('eko_login_history')) || []; } catch {}
  
  const lastLogin = loginHistory
    .filter(h => h.email === email.toLowerCase() && h.success)
    .pop();
  
  return lastLogin ? new Date(lastLogin.timestamp) : null;
}

/* ── Modal open/close ── */
function openLogin(tab) {
  const modal = document.getElementById('login-modal');
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  switchAuthTab(tab || 'login');
  // Pre-fill remembered email and password
  const remembered = localStorage.getItem('eko_remember_email');
  const rememberedPass = localStorage.getItem('eko_remember_password');
  if (remembered) {
    const emailEl = document.getElementById('login-email');
    const passEl = document.getElementById('login-pass');
    const rememberEl = document.getElementById('login-remember');
    if (emailEl) emailEl.value = remembered;
    if (passEl && rememberedPass) {
      passEl.value = rememberedPass;
      // Ensure password field stays masked/hidden
      passEl.type = 'password';
      // Reset the toggle button to show eye icon
      const pwToggleBtn = passEl.parentElement?.querySelector('.pw-toggle');
      if (pwToggleBtn) {
        pwToggleBtn.textContent = '👁';
        pwToggleBtn.classList.remove('visible');
      }
    }
    if (rememberEl) rememberEl.checked = true;
  }
  setTimeout(() => {
    const emailEl = document.getElementById('login-email');
    if (emailEl && !emailEl.value) emailEl.focus();
    else document.getElementById('login-pass')?.focus();
  }, 80);
}

/* ── Social sign-in (Google & Facebook) ── */
function socialSignIn(provider) {
  const providers = {
    'Google': {
      icon: 'G',
      domains: ['gmail.com', 'googlemail.com', 'google.com'],
      generateEmail: () => `rider.${Math.random().toString(36).substr(2, 9)}@gmail.com`,
      colors: { primary: '#4285F4', secondary: '#34A853' }
    },
    'Facebook': {
      icon: 'f',
      domains: ['facebook.com'],
      generateEmail: () => `fb.rider.${Math.random().toString(36).substr(2, 9)}@fb.local`,
      colors: { primary: '#1877F2', secondary: '#0A66C2' }
    }
  };

  const config = providers[provider];
  if (!config) {
    showToast(`${provider} is not supported.`);
    return;
  }

  // Simulate OAuth login flow
  const firstName = ['Marco', 'Ana', 'Javi', 'Kenji', 'Juan', 'Maria', 'Carlos', 'Sofia'][Math.floor(Math.random() * 8)];
  const lastName = ['Rodriguez', 'Perez', 'Santos', 'Garcia', 'Torres', 'Lopez', 'Ramirez', 'Flores'][Math.floor(Math.random() * 8)];
  const email = config.generateEmail();
  const name = `${firstName} ${lastName}`;

  // Check if already logged in with this provider
  let users = [];
  try { users = JSON.parse(localStorage.getItem('eko_users')) || []; } catch {}

  let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    // Create new social account
    const now = new Date().toISOString();
    user = {
      email,
      name,
      password: btoa(Math.random().toString(36).substr(2, 15)), // Random password
      provider: provider,
      dob: '2000-01-01',
      phone: '+63 9XX XXX XXXX',
      address: 'EKO MOTO Track',
      city: 'Racing Circuit',
      zip: '0000',
      signupDate: now,
      lastLogin: null,
      isSocialAccount: true
    };
    users.push(user);
    localStorage.setItem('eko_users', JSON.stringify(users));
    showToast(`Welcome to EKO MOTO! Account created with ${provider}.`);
  } else {
    showToast(`Welcome back, ${user.name}!`);
  }

  // Log the user in
  user.lastLogin = new Date().toISOString();
  const userIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (userIdx !== -1) {
    users[userIdx] = user;
    localStorage.setItem('eko_users', JSON.stringify(users));
  }

  const userData = {
    email: user.email,
    name: user.name,
    dob: user.dob,
    address: user.address,
    city: user.city,
    zip: user.zip,
    phone: user.phone,
    provider: provider,
    isSocialAccount: true,
    signupDate: user.signupDate,
    lastLogin: new Date().toISOString()
  };

  saveUser(userData);
  closeLogin();
  updateAuthState();
  if (typeof checkAuthGate === 'function') checkAuthGate();
}

function closeLogin() {
  const modal = document.getElementById('login-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  // Clear login fields only
  ['login-email','login-pass'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  switchAuthTab('login');
  // Close profile panel too
  const pp = document.getElementById('profile-panel');
  if (pp) pp.style.display = 'none';
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  const loginPane  = document.getElementById('auth-login');
  const signupPane = document.getElementById('auth-signup');
  const profilePane = document.getElementById('auth-profile');
  if (loginPane)   loginPane.style.display   = tab === 'login'   ? 'block' : 'none';
  if (signupPane)  signupPane.style.display   = tab === 'signup'  ? 'block' : 'none';
  if (profilePane) profilePane.style.display  = tab === 'profile' ? 'block' : 'none';
}

/* ── Age calculation helper ── */
function calcAge(dobString) {
  if (!dobString) return 0;
  const today = new Date();
  const dob   = new Date(dobString);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

/* ── SIGN IN ── */
function doLogin() {
  const email = document.getElementById('login-email')?.value.trim();
  const pass  = document.getElementById('login-pass')?.value;
  if (!email || !pass) { showToast('Enter your email and password.'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Please enter a valid email.'); return; }

  // Load stored users
  let users = [];
  try { users = JSON.parse(localStorage.getItem('eko_users')) || []; } catch {}
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!found) { 
    logLoginAttempt(email, false);
    showToast('No account found with that email.'); 
    return; 
  }
  if (found.password !== btoa(pass)) { 
    logLoginAttempt(email, false);
    showToast('Incorrect password.'); 
    return; 
  }

  // Handle remember me
  const rememberEl = document.getElementById('login-remember');
  if (rememberEl?.checked) {
    localStorage.setItem('eko_remember_email', found.email);
    localStorage.setItem('eko_remember_password', pass);
    localStorage.setItem('eko_remember_timestamp', new Date().toISOString());
  } else {
    localStorage.removeItem('eko_remember_email');
    localStorage.removeItem('eko_remember_password');
    localStorage.removeItem('eko_remember_timestamp');
  }

  // Log successful login
  logLoginAttempt(email, true);
  
  const userData = { 
    email: found.email, 
    name: found.name, 
    dob: found.dob, 
    address: found.address, 
    phone: found.phone,
    city: found.city,
    zip: found.zip,
    lastLogin: new Date().toISOString(),
    signupDate: found.signupDate || new Date().toISOString()
  };
  
  saveUser(userData);
  closeLogin();
  updateAuthState();
  if (typeof notifyReviewAuthChange === 'function') notifyReviewAuthChange();
  showToast(`Welcome back, ${found.name}!`);
  if (typeof checkAuthGate === 'function') checkAuthGate();
}

/* ── SIGN UP ── */
function doSignup() {
  const name    = document.getElementById('signup-name')?.value.trim();
  const email   = document.getElementById('signup-email')?.value.trim();
  const pass    = document.getElementById('signup-pass')?.value;
  const dob     = document.getElementById('signup-dob')?.value;
  const phone   = document.getElementById('signup-phone')?.value.trim();
  const address = document.getElementById('signup-address')?.value.trim();
  const city    = document.getElementById('signup-city')?.value.trim();
  const zip     = document.getElementById('signup-zip')?.value.trim();

  if (!name || !email || !pass || !dob) {
    showToast('Please fill in all required fields.'); return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email.'); return;
  }
  if (pass.length < 8)            { showToast('Password must be at least 8 characters.'); return; }
  if (!/[A-Z]/.test(pass))        { showToast('Password needs at least one uppercase letter.'); return; }
  if (!/[^A-Za-z0-9]/.test(pass)) { showToast('Password needs at least one special character.'); return; }

  // ── Age Verification (18+) ──
  const age = calcAge(dob);
  if (age < 18) {
    showAgeError(age);
    return;
  }

  // Check duplicate email
  let users = [];
  try { users = JSON.parse(localStorage.getItem('eko_users')) || []; } catch {}
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    showToast('An account with this email already exists.'); return;
  }

  const now = new Date().toISOString();
  const newUser = {
    email,
    name,
    password: btoa(pass),
    dob,
    phone:   phone   || '',
    address: address || '',
    city:    city    || '',
    zip:     zip     || '',
    signupDate: now,
    lastLogin: null
  };
  users.push(newUser);
  localStorage.setItem('eko_users', JSON.stringify(users));
  
  // Log signup
  logLoginAttempt(email, true);

  const userData = {
    email: newUser.email,
    name: newUser.name,
    dob: newUser.dob,
    address: newUser.address,
    city: newUser.city,
    zip: newUser.zip,
    phone: newUser.phone,
    signupDate: now,
    lastLogin: now
  };
  
  saveUser(userData);
  closeLogin();
  updateAuthState();
  if (typeof notifyReviewAuthChange === 'function') notifyReviewAuthChange();
  showToast(`Welcome to EKO MOTO, ${name}!`);
  if (typeof checkAuthGate === 'function') checkAuthGate();
}

/* ── Age denial screen ── */
function showAgeError(age) {
  const box = document.getElementById('age-error-screen');
  if (box) {
    box.style.display = 'flex';
    const ageDisp = box.querySelector('.age-error-age');
    if (ageDisp) ageDisp.textContent = age + ' years old';
    return;
  }
  // fallback toast
  showToast(`Sorry — you must be 18 or older to register. (Age: ${age})`);
}
function closeAgeError() {
  const box = document.getElementById('age-error-screen');
  if (box) box.style.display = 'none';
}

/* ── LOGOUT ── */
function doLogout() {
  localStorage.removeItem('eko_user');
  updateAuthState();
  if (typeof notifyReviewAuthChange === 'function') notifyReviewAuthChange();
  showToast('You have been logged out.');
  if (typeof checkAuthGate === 'function') checkAuthGate();
}

/* ── Update nav to reflect auth state ── */
function updateAuthState() {
  const user     = getUser();
  const loginBtn = document.getElementById('nav-login-btn');
  const userMenu = document.getElementById('nav-user-menu');
  const userName = document.getElementById('nav-user-name');

  if (loginBtn)  loginBtn.style.display  = user ? 'none' : 'inline-flex';
  if (userMenu)  userMenu.style.display  = user ? 'inline-flex' : 'none';
  if (userName && user) userName.textContent = user.name;
}

/* ── Open Profile Editor (inside the login modal) ── */
function openProfile() {
  openLogin('profile');
  const user = getUser();
  if (!user) return;

  // Load full data from users store
  let users = [];
  try { users = JSON.parse(localStorage.getItem('eko_users')) || []; } catch {}
  const full = users.find(u => u.email.toLowerCase() === user.email.toLowerCase()) || user;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('profile-name',     full.name);
  set('profile-username', full.username || full.name?.split(' ')[0] || '');
  set('profile-email',    full.email);
  set('profile-phone',    full.phone);
  set('profile-dob',      full.dob);
  set('profile-address',  full.address);
  set('profile-city',     full.city);
  set('profile-zip',      full.zip);
}

function saveProfile() {
  const user = getUser();
  if (!user) return;

  const name     = document.getElementById('profile-name')?.value.trim();
  const username = document.getElementById('profile-username')?.value.trim();
  const phone    = document.getElementById('profile-phone')?.value.trim();
  const dob      = document.getElementById('profile-dob')?.value;
  const address  = document.getElementById('profile-address')?.value.trim();
  const city     = document.getElementById('profile-city')?.value.trim();
  const zip      = document.getElementById('profile-zip')?.value.trim();

  if (!name) { showToast('Name cannot be empty.'); return; }
  if (!username) { showToast('Username cannot be empty.'); return; }
  if (dob) {
    const age = calcAge(dob);
    if (age < 18) { showToast(`Age must be 18+. Current age: ${age}.`); return; }
  }

  let users = [];
  try { users = JSON.parse(localStorage.getItem('eko_users')) || []; } catch {}
  const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (idx !== -1) {
    users[idx] = { ...users[idx], name, username, phone, dob, address, city, zip };
    localStorage.setItem('eko_users', JSON.stringify(users));
  }

  saveUser({ ...user, name, username, phone, dob, address, city, zip });
  updateAuthState();
  closeLogin();
  showToast('Profile updated successfully!');
}

/* ── Toggle password visibility ── */
function togglePw(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  const isHidden = inp.type === 'password';
  inp.type = isHidden ? 'text' : 'password';
  btn.textContent = isHidden ? '🙈' : '👁';
  btn.classList.toggle('visible', isHidden);
}

/* ── Live password rule feedback ── */
function checkPwRules(val, rulesContainerId) {
  const ruleId = rulesContainerId || 'pw-rules-' + Math.random();
  const container = rulesContainerId ? document.getElementById(rulesContainerId) : null;
  
  const setRule = (id, ok) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('ok', ok);
    el.textContent = (ok ? '✓ ' : '✕ ') + el.textContent.replace(/^[✓✕] /, '');
  };
  
  // Check for both signup and profile rule sets
  const prefixes = ['rule-', 'profile-rule-'];
  prefixes.forEach(prefix => {
    setRule(prefix + 'len',     val.length >= 8);
    setRule(prefix + 'upper',   /[A-Z]/.test(val));
    setRule(prefix + 'special', /[^A-Za-z0-9]/.test(val));
  });
}

/* ── CHANGE PASSWORD ── */
function changePassword() {
  const currentPw = document.getElementById('profile-current-pw')?.value;
  const newPw = document.getElementById('profile-new-pw')?.value;
  const confirmPw = document.getElementById('profile-confirm-pw')?.value;
  
  if (!currentPw || !newPw || !confirmPw) {
    showToast('Please fill in all password fields.');
    return;
  }
  
  const user = getUser();
  if (!user) {
    showToast('You must be logged in to change your password.');
    return;
  }
  
  // Validate new password
  if (newPw.length < 8) {
    showToast('New password must be at least 8 characters.');
    return;
  }
  if (!/[A-Z]/.test(newPw)) {
    showToast('New password needs at least one uppercase letter.');
    return;
  }
  if (!/[^A-Za-z0-9]/.test(newPw)) {
    showToast('New password needs at least one special character.');
    return;
  }
  
  if (newPw !== confirmPw) {
    showToast('New passwords do not match.');
    return;
  }
  
  // Verify current password
  let users = [];
  try { users = JSON.parse(localStorage.getItem('eko_users')) || []; } catch {}
  const userIdx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  
  if (userIdx === -1) {
    showToast('User not found.');
    return;
  }
  
  if (users[userIdx].password !== btoa(currentPw)) {
    showToast('Current password is incorrect.');
    return;
  }
  
  // Update password
  users[userIdx].password = btoa(newPw);
  localStorage.setItem('eko_users', JSON.stringify(users));
  
  // Clear password fields
  document.getElementById('profile-current-pw').value = '';
  document.getElementById('profile-new-pw').value = '';
  document.getElementById('profile-confirm-pw').value = '';
  
  // Reset password rules
  document.querySelectorAll('#profile-rules span').forEach(el => {
    el.classList.remove('ok');
    el.textContent = el.textContent.replace(/^✓ /, '✕ ');
  });
  
  showToast('Password changed successfully!');
}

/* ── FORGOT PASSWORD ── */
function openForgotPassword() {
  const email = document.getElementById('login-email')?.value.trim();
  if (!email) {
    showToast('Please enter your email address first.');
    return;
  }
  
  // Load users
  let users = [];
  try { users = JSON.parse(localStorage.getItem('eko_users')) || []; } catch {}
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!found) {
    showToast('No account found with that email.');
    return;
  }
  
  // Show password reset form
  const resetBox = document.createElement('div');
  resetBox.id = 'pw-reset-box';
  resetBox.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 10000;
    background: rgba(0,0,0,0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;
  
  resetBox.innerHTML = `
    <div style="
      background: #111;
      border: 1px solid #242424;
      border-radius: 16px;
      padding: 36px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 28px 90px rgba(0,0,0,0.75);
    ">
      <h3 style="
        font-size: 24px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 8px;
        text-transform: uppercase;
      ">Reset Password</h3>
      <p style="
        font-size: 13px;
        color: #666;
        margin-bottom: 24px;
      ">Enter a new password for ${found.email}</p>
      
      <div style="margin-bottom: 16px;">
        <label style="
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 7px;
        ">New Password</label>
        <div style="position: relative; display: flex; align-items: center;">
          <input type="password" id="reset-new-pw" placeholder="Min 8 chars, 1 uppercase, 1 symbol" style="
            width: 100%;
            background: #181818;
            border: 1px solid #2a2a2a;
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
            padding: 11px 44px 11px 14px;
            outline: none;
            box-sizing: border-box;
            font-family: 'Barlow', sans-serif;
          " oninput="checkPwRules(this.value)">
          <button type="button" onclick="togglePw('reset-new-pw', this)" style="
            position: absolute;
            right: 12px;
            background: none;
            border: none;
            color: #555;
            cursor: pointer;
            font-size: 16px;
            padding: 0;
            line-height: 1;
          ">👁</button>
        </div>
      </div>
      
      <div style="margin-bottom: 22px;">
        <label style="
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 7px;
        ">Confirm Password</label>
        <div style="position: relative; display: flex; align-items: center;">
          <input type="password" id="reset-confirm-pw" placeholder="••••••••" style="
            width: 100%;
            background: #181818;
            border: 1px solid #2a2a2a;
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
            padding: 11px 44px 11px 14px;
            outline: none;
            box-sizing: border-box;
            font-family: 'Barlow', sans-serif;
          ">
          <button type="button" onclick="togglePw('reset-confirm-pw', this)" style="
            position: absolute;
            right: 12px;
            background: none;
            border: none;
            color: #555;
            cursor: pointer;
            font-size: 16px;
            padding: 0;
            line-height: 1;
          ">👁</button>
        </div>
      </div>
      
      <div style="display: flex; gap: 10px;">
        <button onclick="resetPasswordConfirm('${email}')" style="
          flex: 1;
          padding: 13px;
          background: var(--red, #e63030);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 2px;
          transition: background .2s;
        " onmouseover="this.style.background='#c82020'" onmouseout="this.style.background='var(--red, #e63030)'">Reset Password</button>
        <button onclick="closeForgotPassword()" style="
          flex: 1;
          padding: 13px;
          background: #222;
          color: #aaa;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 2px;
          transition: all .2s;
        " onmouseover="this.style.background='#2a2a2a';this.style.color='#fff'" onmouseout="this.style.background='#222';this.style.color='#aaa'">Cancel</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(resetBox);
}

function closeForgotPassword() {
  const box = document.getElementById('pw-reset-box');
  if (box) box.remove();
}

function resetPasswordConfirm(email) {
  const newPw = document.getElementById('reset-new-pw')?.value;
  const confirmPw = document.getElementById('reset-confirm-pw')?.value;
  
  if (!newPw || !confirmPw) {
    showToast('Please fill in all fields.');
    return;
  }
  
  if (newPw.length < 8) {
    showToast('Password must be at least 8 characters.');
    return;
  }
  if (!/[A-Z]/.test(newPw)) {
    showToast('Password needs at least one uppercase letter.');
    return;
  }
  if (!/[^A-Za-z0-9]/.test(newPw)) {
    showToast('Password needs at least one special character.');
    return;
  }
  
  if (newPw !== confirmPw) {
    showToast('Passwords do not match.');
    return;
  }
  
  // Update password
  let users = [];
  try { users = JSON.parse(localStorage.getItem('eko_users')) || []; } catch {}
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (idx === -1) {
    showToast('User not found.');
    return;
  }
  
  users[idx].password = btoa(newPw);
  localStorage.setItem('eko_users', JSON.stringify(users));
  
  closeForgotPassword();
  showToast('Password reset successfully! Please log in with your new password.');
  
  // Clear login fields
  const emailEl = document.getElementById('login-email');
  const passEl = document.getElementById('login-pass');
  if (emailEl) emailEl.value = '';
  if (passEl) passEl.value = '';
}

/* ════════════════════════════════════════════════════════════════════
   SEARCH OVERLAY
   ================================================================== */
function openSearch() {
  const ov = document.getElementById('search-overlay');
  if (!ov) return;
  ov.classList.add('open');
  document.body.classList.add('search-open');
  setTimeout(() => document.getElementById('overlay-input')?.focus(), 80);
  renderSearchBestSellers();
}
function closeSearch() {
  const ov = document.getElementById('search-overlay');
  if (!ov) return;
  ov.classList.remove('open');
  document.body.classList.remove('search-open');
  const inp = document.getElementById('overlay-input');
  if (inp) inp.value = '';
  showSearchDefault();
}
function showSearchDefault() {
  const def  = document.getElementById('search-default');
  const live = document.getElementById('search-live');
  if (def)  def.style.display  = 'grid';
  if (live) live.style.display = 'none';
  document.querySelectorAll('.trending-list li').forEach(li => {
    li.style.color = '';
    li.classList.remove('trending-active');
  });
  renderSearchBestSellers();
}
function renderSearchBestSellers() {
  const container = document.getElementById('search-bestsellers');
  if (!container) return;
  const bsTitle = document.querySelector('.search-bestsellers-col .search-col-title');
  if (bsTitle) {
    bsTitle.innerHTML = 'Best Sellers <span class="search-view-all" onclick="showViewAllPanel()">View All →</span>';
  }
  container.style.gridTemplateColumns = '';
  if (typeof PRODUCTS === 'undefined') {
    container.innerHTML = '<a href="index.html#products" onclick="closeSearch()" style="color:var(--red);font-size:14px">View full collection →</a>';
    return;
  }
  const best = PRODUCTS.filter(p => p.badge).slice(0, 4);
  container.innerHTML = best.map(p => `
    <div class="search-bs-item" onclick="openModal(${p.id});closeSearch()">
      <div class="search-bs-thumb">${jacketImg(p.id)}</div>
      <div class="search-bs-name">${p.name}</div>
      <div class="search-bs-sub">${p.category.toUpperCase()} · ₱${p.price}</div>
    </div>`).join('');
}
function liveSearch(q) {
  const live = document.getElementById('search-live');
  const def  = document.getElementById('search-default');
  if (!live || !def) return;
  if (!q.trim()) { showSearchDefault(); return; }
  def.style.display  = 'none';
  live.style.display = 'block';
  if (typeof PRODUCTS === 'undefined') {
    live.innerHTML = `<p class="search-no-results">Search for "<strong>${q}</strong>" — <a href="index.html?q=${encodeURIComponent(q)}" style="color:var(--red)">Go to shop →</a></p>`;
    return;
  }
  const ql = q.toLowerCase();
  const results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(ql) ||
    p.desc.toLowerCase().includes(ql) ||
    p.category.toLowerCase().includes(ql)
  );
  if (!results.length) {
    live.innerHTML = `<p class="search-no-results">No results for "<strong>${q}</strong>"</p>`;
    return;
  }
  live.innerHTML = `
    <div class="search-col-title">${results.length} result${results.length !== 1 ? 's' : ''}</div>
    <div class="search-live-grid">
      ${results.map(p => `
        <div class="search-live-item" onclick="openModal(${p.id});closeSearch()">
          <div class="search-live-thumb">${jacketImg(p.id)}</div>
          <div class="search-live-name">${p.name}</div>
          <div class="search-live-price">₱${p.price}</div>
        </div>`).join('')}
    </div>`;
}
function handleSearchKey(e) {
  if (e.key === 'Escape') closeSearch();
  if (e.key === 'Enter') {
    const q = e.target.value.trim();
    if (q && typeof filterProducts === 'function') {
      closeSearch();
      const si = document.getElementById('search-input');
      if (si) si.value = q;
      filterProducts();
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
function showTrendingResults(cat, label, clickedLi) {
  if (typeof PRODUCTS === 'undefined') return;
  document.querySelectorAll('.trending-list li').forEach(li => {
    li.style.color = '';
    li.classList.remove('trending-active');
  });
  if (clickedLi) {
    clickedLi.style.color = 'var(--red)';
    clickedLi.classList.add('trending-active');
  }
  const input = document.getElementById('overlay-input');
  if (input) input.value = label;
  const filtered = PRODUCTS.filter(p => p.category === cat);
  if (!filtered.length) return;
  const bsTitle = document.querySelector('.search-bestsellers-col .search-col-title');
  if (bsTitle) {
    bsTitle.innerHTML = label + ' — ' + filtered.length + ' products' +
      ' <span class="search-view-all" onclick="showViewAllPanel()">View All →</span>';
  }
  const container = document.getElementById('search-bestsellers');
  if (!container) return;
  container.innerHTML = filtered.map(p => `
    <div class="search-bs-item" onclick="openModal(${p.id});closeSearch()">
      <div class="search-bs-thumb">${jacketImg(p.id)}</div>
      <div class="search-bs-name">${p.name}</div>
      <div class="search-bs-sub">${p.category.toUpperCase()} · ₱${p.price}</div>
    </div>`).join('');
  container.style.gridTemplateColumns = '';
}
function showViewAllPanel() {
  if (typeof PRODUCTS === 'undefined') return;
  const defaultBody   = document.getElementById('search-default-body');
  const viewAllPanel  = document.getElementById('search-viewall-panel');
  const grid          = document.getElementById('search-viewall-grid');
  if (!viewAllPanel || !grid) return;
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="search-viewall-item" onclick="openModal(${p.id});closeSearch()">
      <div class="search-viewall-thumb">${jacketImg(p.id)}</div>
      <div class="search-viewall-name">${p.name}</div>
      <div class="search-viewall-sub">${p.category.toUpperCase()} · ₱${p.price}</div>
    </div>`).join('');
  if (defaultBody) defaultBody.style.display = 'none';
  viewAllPanel.style.display = 'block';
}
function hideViewAllPanel() {
  const defaultBody  = document.getElementById('search-default-body');
  const viewAllPanel = document.getElementById('search-viewall-panel');
  if (defaultBody) defaultBody.style.display = 'block';
  if (viewAllPanel) viewAllPanel.style.display = 'none';
}
function applyTrendingFilter(cat) {
  closeSearch();
  if (typeof setFilter === 'function') {
    setFilter(cat, null);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.location.href = 'index.html#products';
  }
}

/* ─── THANK YOU PAGE ── */
function renderThankYou() {
  const order = loadOrder();
  if (!order) {
    const nameEl = document.getElementById('ty-name');
    if (nameEl) nameEl.textContent = 'Rider';
    return;
  }
  const nameEl = document.getElementById('ty-name');
  if (nameEl) nameEl.textContent = order.customer.firstName;
  const refEl = document.getElementById('ty-ref');
  if (refEl) refEl.textContent = order.ref;

  // Payment method display
  const payEl = document.getElementById('ty-payment-method');
  if (payEl && order.paymentMethod) payEl.textContent = order.paymentMethod;

  const c = order.customer;
  const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setTxt('ty-addr-name',   c.firstName + ' ' + c.lastName);
  setTxt('ty-addr-street', c.address);
  setTxt('ty-addr-city',   c.city + ' ' + c.zip);
  setTxt('ty-addr-phone',  '📞 ' + c.phone);
  if (c.notes) {
    const noteEl = document.getElementById('ty-addr-note');
    if (noteEl) { noteEl.textContent = 'Note: ' + c.notes; noteEl.style.display = ''; }
  }
  const listEl = document.getElementById('ty-items-list');
  if (listEl) {
    const rows = order.items.map(i =>
      '<div class="ty-row"><span>' + i.product.name + ' (' + i.size + ') × ' + i.qty + '</span>' +
      '<span>₱' + (i.product.price * i.qty) + '</span></div>'
    ).join('');
    const shipping =
      '<div class="ty-row"><span>Shipping</span><span>' +
      (order.shipping === 0 ? '<span style="color:#22cc66">Free</span>' : '₱' + order.shipping) +
      '</span></div>';
    const total =
      '<div class="ty-row"><span>Total Paid</span>' +
      '<span class="ty-row-total-amount">₱' + order.total + '</span></div>';
    listEl.innerHTML = rows + shipping + total;
  }
}

/* ─── INIT ── */
applySavedTheme();
updateCartCount();
updateAuthState();
if (document.getElementById('ty-name')) renderThankYou();

/* ════════════════════════════════════════════════════════════════════
   SOCIAL BUTTON STYLES — injected globally so every page gets the fix
   ================================================================== */
(function injectSocialBtnStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* ── Wrapper stacks both buttons vertically with a gap ── */
    .social-btns-wrap {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }

    /* ── Base button ── */
    .social-btn {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 10px !important;
      width: 100% !important;
      padding: 12px 18px !important;
      border-radius: 8px !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      font-family: 'Barlow', sans-serif !important;
      cursor: pointer !important;
      border: 1px solid transparent !important;
      transition: all 0.2s ease !important;
      box-sizing: border-box !important;
      margin-bottom: 0 !important;
      text-align: center !important;
      line-height: 1.2 !important;
    }

    /* ── Constrain SVG icon inside buttons ── */
    .social-btn svg {
      width: 20px !important;
      height: 20px !important;
      flex-shrink: 0 !important;
      display: block !important;
    }

    /* ── Google: white button, grey border, dark text ── */
    .google-btn {
      background: #ffffff !important;
      color: #3c4043 !important;
      border-color: #dadce0 !important;
    }
    .google-btn:hover {
      background: #f8f9fa !important;
      box-shadow: 0 1px 6px rgba(0,0,0,0.2) !important;
    }

    /* ── Facebook: brand-blue button, white text ── */
    .facebook-btn {
      background: #1877f2 !important;
      color: #ffffff !important;
      border-color: #1877f2 !important;
    }
    .facebook-btn:hover {
      background: #166fe5 !important;
    }

    /* ── Remember me / Forgot password row ── */
    .auth-remember-row {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      width: 100% !important;
      margin: 10px 0 16px !important;
      gap: 12px !important;
    }
    .auth-remember-row label {
      display: flex !important;
      align-items: center !important;
      gap: 7px !important;
      font-size: 13px !important;
      color: #aaa !important;
      cursor: pointer !important;
      white-space: nowrap !important;
    }
    .auth-remember-row label input[type="checkbox"] {
      width: 15px !important;
      height: 15px !important;
      accent-color: var(--red, #e63030) !important;
      cursor: pointer !important;
      flex-shrink: 0 !important;
    }
    .auth-forgot {
      font-size: 13px !important;
      color: #aaa !important;
      text-decoration: none !important;
      cursor: pointer !important;
      white-space: nowrap !important;
      margin-left: auto !important;
      transition: color .15s !important;
    }
    .auth-forgot:hover {
      color: var(--red, #e63030) !important;
    }
  `;
  document.head.appendChild(style);
})();