/* ════════════════════════════════════════════════════════════════════
   EKO MOTO — checkout.js
   Requires main.js (cart, cartTotal, saveCart, saveOrder,
   saveCustomer, updateCartCount, showToast).
   ================================================================== */

let selectedPayment = ''; // tracks which payment method was chosen

/* ─── PAYMENT METHOD SELECTION ── */
function selectPayment(method, el) {
  selectedPayment = method;
  document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
  if (el) el.classList.add('selected');

  // Show/hide relevant instructions
  document.querySelectorAll('.payment-instructions').forEach(p => p.style.display = 'none');
  const inst = document.getElementById('pay-inst-' + method.toLowerCase().replace(/\s+/g,'-'));
  if (inst) inst.style.display = 'block';
}

/* ─── CHECKOUT SUMMARY ── */
function renderCheckoutSummary() {
  const panel = document.getElementById('checkout-summary');
  if (!panel) return;

  if (!cart.length) {
    panel.innerHTML = '<p style="color:var(--muted)">Your cart is empty. <a href="index.html" style="color:var(--red)">Go shop!</a></p>';
    return;
  }

  const shipping = cartTotal() >= 500 ? 0 : 25;

  panel.innerHTML = `
    <div class="summary-title">Your Order</div>
    ${cart.map(i => `
      <div class="summary-row">
        <span>${i.product.name} × ${i.qty}<br>
          <small style="color:var(--muted)">Size ${i.size}</small>
        </span>
        <span>₱${i.product.price * i.qty}</span>
      </div>`).join('')}
    <div class="summary-row">
      <span>Shipping</span>
      <span>${shipping === 0 ? 'Free' : '₱' + shipping}</span>
    </div>
    <div class="summary-row total">
      <span>Total</span>
      <span>₱${cartTotal() + shipping}</span>
    </div>`;
}

/* ─── PRE-FILL FROM LOGGED-IN USER ── */
function prefillFromUser() {
  const user = getUser();
  if (!user) return;
  let users = [];
  try { users = JSON.parse(localStorage.getItem('eko_users')) || []; } catch {}
  const full = users.find(u => u.email.toLowerCase() === user.email.toLowerCase()) || user;

  const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
  // Split name
  const parts = (full.name || '').split(' ');
  set('fname', parts[0] || '');
  set('lname', parts.slice(1).join(' ') || '');
  set('email', full.email);
  set('phone', full.phone);
  set('addr',  full.address);
  set('city',  full.city);
  set('zip',   full.zip);
}

/* ─── PLACE ORDER ── */
function placeOrder() {
  // Validate payment
  if (!selectedPayment) {
    showToast('Please select a payment method.');
    document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  let valid = true;
  const fields = [
    { id: 'fname', wrapper: 'f-fname', check: v => v.trim().length > 0 },
    { id: 'lname', wrapper: 'f-lname', check: v => v.trim().length > 0 },
    { id: 'email', wrapper: 'f-email', check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'phone', wrapper: 'f-phone', check: v => v.trim().length > 5 },
    { id: 'addr',  wrapper: 'f-addr',  check: v => v.trim().length > 0 },
    { id: 'city',  wrapper: 'f-city',  check: v => v.trim().length > 0 },
    { id: 'zip',   wrapper: 'f-zip',   check: v => v.trim().length > 2 },
  ];

  fields.forEach(f => {
    const el   = document.getElementById(f.id);
    const wrap = document.getElementById(f.wrapper);
    if (!wrap || !el) return;
    if (!f.check(el.value)) {
      wrap.classList.add('has-err');
      el.classList.add('error');
      valid = false;
    } else {
      wrap.classList.remove('has-err');
      el.classList.remove('error');
      wrap.classList.add('valid');
    }
  });

  if (!valid)       { showToast('Please complete all required fields.'); return; }
  if (!cart.length) { showToast('Your cart is empty.'); return; }

  // Validate receipt for payment methods that require proof of payment
  const methodsRequiringReceipt = ['GCash', 'Maya', 'Bank Transfer'];
  if (methodsRequiringReceipt.includes(selectedPayment)) {
    const receiptMap = { 'GCash': 'receipt-gcash', 'Maya': 'receipt-maya', 'Bank Transfer': 'receipt-bank' };
    const receiptInput = document.getElementById(receiptMap[selectedPayment]);
    if (!receiptInput || !receiptInput.files || receiptInput.files.length === 0) {
      showToast(`Please attach proof of payment for ${selectedPayment}.`);
      return;
    }
    const file = receiptInput.files[0];
    if (file.size > 5242880) {
      showToast('Receipt file must be smaller than 5MB.');
      return;
    }
  }

  const customer = {
    firstName : document.getElementById('fname').value.trim(),
    lastName  : document.getElementById('lname').value.trim(),
    email     : document.getElementById('email').value.trim(),
    phone     : document.getElementById('phone').value.trim(),
    address   : document.getElementById('addr').value.trim(),
    city      : document.getElementById('city').value.trim(),
    zip       : document.getElementById('zip').value.trim(),
    notes     : document.getElementById('notes').value.trim(),
  };

  saveCustomer(customer);

  const shipping = cartTotal() >= 500 ? 0 : 25;
  const orderRef = 'EKO-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const order = {
    ref           : orderRef,
    customer      : customer,
    items         : cart,
    subtotal      : cartTotal(),
    shipping      : shipping,
    total         : cartTotal() + shipping,
    paymentMethod : selectedPayment,
    date          : new Date().toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    }),
  };

  saveOrder(order);
  cart = [];
  saveCart(cart);
  updateCartCount();
  window.location.href = 'thank-you.html';
}

/* ─── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutSummary();
  prefillFromUser();
});