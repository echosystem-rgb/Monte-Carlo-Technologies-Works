/* ════════════════════════════════════════════════════════════════════
   EKO MOTO — cart.js
   Loaded only on cart.html.
   Requires main.js to be loaded first (uses: cart, saveCart,
   cartTotal, updateCartCount, jacketImg, showToast).
   ================================================================== */

/* ─── REMOVE ITEM ───────────────────────────────────────────────────
   Filters out the item matching the given key, saves to localStorage,
   updates the badge and re-renders the page.
   ─────────────────────────────────────────────────────────────── */
function removeFromCart(key) {
  cart = cart.filter(i => i.key !== key);
  saveCart(cart);
  updateCartCount();
  renderCart();
  showToast('Item removed from cart.');
}

/* ─── CHANGE QUANTITY ───────────────────────────────────────────────
   Adds delta (+1 or -1) to the item quantity.
   Enforces a minimum of 1 so items can't reach zero here
   (use the remove button to delete entirely).
   ─────────────────────────────────────────────────────────────── */
function changeQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  updateCartCount();
  renderCart();
}

/* ─── RENDER CART ────────────────────────────────────────────────────
   Reads the in-memory cart array (loaded from localStorage in main.js)
   and builds the full cart page HTML dynamically.
   Shows an empty-state message when the cart has no items.
   ─────────────────────────────────────────────────────────────── */
function renderCart() {
  const body = document.getElementById('cart-body');

  // ── Empty cart state ────────────────────────────────────────────
  if (!cart.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <h2>Your Cart is Empty</h2>
        <p style="margin-bottom:32px">Looks like you haven't added any jackets yet.</p>
        <a class="btn-primary" href="index.html">Shop Now</a>
      </div>`;
    return;
  }

  const shipping = cartTotal() >= 500 ? 0 : 25;

  // ── Render items + summary ──────────────────────────────────────
  body.innerHTML = `
    <div class="cart-layout">
      <div>
        ${cart.map(i => `
          <div class="cart-item">
            <div class="cart-item-img">${jacketImg(i.product.id)}</div>
            <div>
              <div class="cart-item-name">${i.product.name}</div>
              <div class="cart-item-sub">Size: ${i.size} · ${i.product.category}</div>
              <div class="cart-item-price">₱${i.product.price}</div>
              <div class="qty-controls">
                <button class="qty-btn" onclick="changeQty('${i.key}',-1)">−</button>
                <span class="qty-num">${i.qty}</span>
                <button class="qty-btn" onclick="changeQty('${i.key}',1)">+</button>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end">
              <button class="remove-btn" onclick="removeFromCart('${i.key}')">×</button>
              <div class="cart-item-subtotal">₱${i.product.price * i.qty}</div>
            </div>
          </div>`).join('')}
      </div>

      <div class="cart-summary">
        <div class="summary-title">Order Summary</div>
        <div class="summary-row">
          <span>Subtotal</span>
          <span>₱${cartTotal()}</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span>${shipping === 0 ? '<span style="color:#22cc66">Free</span>' : '₱' + shipping}</span>
        </div>
        ${shipping > 0
          ? `<div style="font-size:12px;color:var(--muted);margin-top:4px">
               Add ₱${500 - cartTotal()} more for free shipping
             </div>`
          : ''}
        <div class="summary-row total">
          <span>Total</span>
          <span>₱${cartTotal() + shipping}</span>
        </div>
        <button class="checkout-btn" onclick="window.location.href='checkout.html'">
          Proceed to Checkout →
        </button>
      </div>
    </div>`;
}

/* ─── INITIALISATION ────────────────────────────────────────────── */
renderCart();