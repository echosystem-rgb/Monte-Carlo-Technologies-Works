/* ════════════════════════════════════════════════════════════════════
   EKO MOTO — products.js
   Loaded only on index.html.
   Requires main.js to be loaded first (uses: cart, saveCart,
   updateCartCount, showToast, jacketImg).
   ================================================================== */

/* ─── PRODUCTS DATA ──────────────────────────────────────────────── */
const PRODUCTS = [

  /* ── JACKETS ─────────────────────────────────────────────────── */
  {
    id: 1, name: "EKO RS-01 Pro", category: "jackets", price: 489,
    badge: "Best Seller",
    desc: "CE2 Level 2 back and shoulder armor. Perforated leather construction with aerodynamic seam placement for professional track use.",
    specs: { Material: "Full-grain leather", Protection: "CE2 Level 2", Fit: "Racing", Weight: "2.1 kg" },
    sizes: ["XS","S","M","L","XL","XXL"],
    color: "#2a1a0a"
  },
  {
    id: 2, name: "EKO GT Leather", category: "jackets", price: 619,
    badge: "New",
    desc: "One-piece racing suit jacket with integrated chest airbag connection points. Approved for FIM-level competition.",
    specs: { Material: "Kangaroo leather blend", Protection: "CE2 Level 2", Fit: "Competition", Weight: "2.4 kg" },
    sizes: ["S","M","L","XL"],
    color: "#1a0d0d"
  },
  {
    id: 3, name: "EKO Tour X", category: "jackets", price: 349,
    badge: null,
    desc: "All-weather adventure touring jacket with removable thermal liner. Waterproof rated IP67.",
    specs: { Material: "Cordura 600D", Protection: "CE1 Level 1", Fit: "Relaxed touring", Weight: "1.8 kg" },
    sizes: ["XS","S","M","L","XL","XXL","3XL"],
    color: "#0a1a0f"
  },
  {
    id: 4, name: "EKO Apex Urban", category: "jackets", price: 279,
    badge: null,
    desc: "Street-smart urban commuter jacket that looks as good off the bike as on it. Slim fit with CE1 armor.",
    specs: { Material: "Textile / leather panels", Protection: "CE1 Level 1", Fit: "Slim", Weight: "1.4 kg" },
    sizes: ["XS","S","M","L","XL"],
    color: "#111"
  },
  {
    id: 5, name: "EKO Circuit 4S", category: "jackets", price: 729,
    badge: "Pro",
    desc: "Top-tier racing jacket with built-in airbag pocket, Kevlar reinforcements, and titanium sliders. Used by EKO factory riders.",
    specs: { Material: "Kangaroo full leather", Protection: "CE2 Level 2 + airbag ready", Fit: "Race replica", Weight: "2.7 kg" },
    sizes: ["S","M","L","XL"],
    color: "#1a0a0a"
  },
  {
    id: 6, name: "EKO Miles Tourer", category: "jackets", price: 399,
    badge: null,
    desc: "Long-haul comfort touring jacket with hydration pocket, ventilation panels, and ergonomic back hump.",
    specs: { Material: "Cordura 900D", Protection: "CE2 Level 2", Fit: "Comfort touring", Weight: "2.0 kg" },
    sizes: ["M","L","XL","XXL","3XL"],
    color: "#0d1a2a"
  },
  {
    id: 7, name: "EKO Street S2", category: "jackets", price: 229,
    badge: null,
    desc: "Minimal aesthetic, maximum commuter utility. Slim urban silhouette with hidden CE1 armor in shoulders and elbows.",
    specs: { Material: "Waxed cotton blend", Protection: "CE1 Level 1", Fit: "Slim", Weight: "1.2 kg" },
    sizes: ["XS","S","M","L","XL","XXL"],
    color: "#151515"
  },
  {
    id: 8, name: "EKO Endurance R", category: "jackets", price: 459,
    badge: null,
    desc: "Three-season touring jacket with 360° reflective piping and quick-adjust waist bands. Built for 1000-mile weeks.",
    specs: { Material: "Cordura 600D + leather", Protection: "CE2 Level 2", Fit: "Sport touring", Weight: "2.2 kg" },
    sizes: ["XS","S","M","L","XL","XXL"],
    color: "#1a1208"
  },

  /* ── GLOVES ──────────────────────────────────────────────────── */
  {
    id: 9, name: "EKO VRCR 4 Pro Moto Gloves", category: "gloves", price: 149,
    badge: "Best Seller",
    desc: "Professional racing gloves with CE Level 2 knuckle protection and touchscreen-compatible fingertips. Track-proven.",
    specs: { Material: "Kangaroo leather", Protection: "CE Level 2", Closure: "Velcro + buckle", Weight: "0.30 kg" },
    sizes: ["XS","S","M","L","XL","XXL"],
    color: "#1a0d0d"
  },
  {
    id: 10, name: "EKO Berik 2.0 Moto Gloves", category: "gloves", price: 129,
    badge: null,
    desc: "Comfortable touring gloves with pre-curved fingers, waterproof membrane, and CE1 knuckle protection for long hauls.",
    specs: { Material: "Cordura + leather", Protection: "CE Level 1", Closure: "Velcro", Weight: "0.28 kg" },
    sizes: ["XS","S","M","L","XL"],
    color: "#0a0a1a"
  },
  {
    id: 11, name: "EKO IXON Vortex Moto Gloves", category: "gloves", price: 169,
    badge: "New",
    desc: "High-performance racing gloves featuring a carbon fiber backplate, anatomical palm padding, and titanium sliders.",
    specs: { Material: "Full-grain leather", Protection: "CE Level 2", Closure: "Wrist strap", Weight: "0.32 kg" },
    sizes: ["S","M","L","XL"],
    color: "#1a0808"
  },
  {
    id: 12, name: "EKO RFX Evo 4 Moto Gloves", category: "gloves", price: 119,
    badge: null,
    desc: "Versatile street gloves with reinforced palm, knuckle armor, and perforated panels for all-season comfort.",
    specs: { Material: "Textile / leather hybrid", Protection: "CE Level 1", Closure: "Velcro cuff", Weight: "0.25 kg" },
    sizes: ["XS","S","M","L","XL","XXL"],
    color: "#111"
  },

  /* ── PANTS ───────────────────────────────────────────────────── */
  {
    id: 13, name: "EKO RST Race Pants", category: "pants", price: 299,
    badge: "Best Seller",
    desc: "Full-leather race pants with CE2 hip and knee armor, articulated knees, and zip connection to EKO jackets.",
    specs: { Material: "Full-grain leather", Protection: "CE2 Level 2", Fit: "Racing", Weight: "1.6 kg" },
    sizes: ["XS","S","M","L","XL","XXL"],
    color: "#1a0a0a"
  },
  {
    id: 14, name: "EKO KLIM Mojave Race Pants", category: "pants", price: 349,
    badge: "Pro",
    desc: "Adventure/enduro pants built for extreme conditions — waterproof, ventilated, with CE2 knee and hip protection.",
    specs: { Material: "Cordura 600D", Protection: "CE2 Level 2", Fit: "Adventure", Weight: "1.9 kg" },
    sizes: ["S","M","L","XL","XXL","3XL"],
    color: "#0a1a0f"
  },
  {
    id: 15, name: "EKO Falling Knight Race Pants", category: "pants", price: 259,
    badge: null,
    desc: "Urban-ready textile pants with removable CE1 knee armor, reflective accents, and comfortable street fit.",
    specs: { Material: "Abrasion-resistant textile", Protection: "CE1 Level 1", Fit: "Urban", Weight: "1.3 kg" },
    sizes: ["XS","S","M","L","XL","XXL"],
    color: "#151515"
  },
  {
    id: 16, name: "EKO Fox Race Pants", category: "pants", price: 279,
    badge: "New",
    desc: "Motocross-inspired race pants with CE2 knee sliders, flexible hip armor, and vented panels for track performance.",
    specs: { Material: "Leather blend", Protection: "CE2 Level 2", Fit: "Race", Weight: "1.7 kg" },
    sizes: ["S","M","L","XL"],
    color: "#111"
  },
];

/* ─── APP STATE ─────────────────────────────────────────────────────
   These are local to index.html only.
   ─────────────────────────────────────────────────────────────── */
let currentFilter = 'all';
let activeModal   = null;
let selectedSize  = null;

/* ─── PRODUCT FILTER & SORT ─────────────────────────────────────────
   filterProducts() reads the search box and sort dropdown, filters
   the PRODUCTS array, and renders the grid.
   ─────────────────────────────────────────────────────────────── */
function filterProducts() {
  const q    = (document.getElementById('search-input')?.value || '').toLowerCase();
  const sort = document.getElementById('sort-sel')?.value || 'default';

  let list = PRODUCTS.filter(p => {
    const matchCat = currentFilter === 'all' || p.category === currentFilter;
    const matchQ   = p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  if (sort === 'price-asc')  list.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (sort === 'name')  list.sort((a, b) => a.name.localeCompare(b.name));

  renderGrid(list);
}

function setFilter(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  filterProducts();
}

/* ─── PRODUCT GRID RENDERING ────────────────────────────────────── */
function renderGrid(list) {
  const g = document.getElementById('product-grid');
  if (!g) return;
  if (!list.length) {
    g.innerHTML = '<p style="color:var(--muted);padding:40px">No products found.</p>';
    return;
  }
  g.innerHTML = list.map(p => `
    <div class="product-card" onclick="openModal(${p.id})">
      <div class="card-img">
        ${p.badge ? `<span class="card-badge">${p.badge}</span>` : ''}
        ${jacketImg(p.id)}
        <div class="card-overlay">
          <button class="card-quick" onclick="event.stopPropagation();openModal(${p.id})">Quick View</button>
        </div>
      </div>
      <div class="card-body">
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${p.desc.substring(0, 80)}…</div>
        <div class="card-foot">
          <div class="card-price">₱${p.price}</div>
          <button class="card-add" onclick="event.stopPropagation();quickAdd(${p.id})">+ Cart</button>
        </div>
      </div>
    </div>`).join('');
}

/* ─── QUICK-VIEW MODAL ──────────────────────────────────────────────
   openModal(id)   populates and shows the modal.
   closeModal(e)   hides it; checks click was on the backdrop.
   selectSize()    highlights chosen size and stores it.
   ─────────────────────────────────────────────────────────────── */
function openModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  activeModal  = p;
  selectedSize = null;
  document.getElementById('modal-img').innerHTML    = jacketImg(p.id, true);
  document.getElementById('modal-name').textContent  = p.name;
  document.getElementById('modal-price').textContent = '₱' + p.price;
  document.getElementById('modal-desc').textContent  = p.desc;
  document.getElementById('modal-specs').innerHTML   = Object.entries(p.specs).map(([k, v]) =>
    `<div class="modal-spec"><span>${k}</span><span>${v}</span></div>`).join('');
  document.getElementById('modal-sizes').innerHTML   = p.sizes.map(s =>
    `<button class="size-btn" onclick="selectSize('${s}',this)">${s}</button>`).join('');
  document.getElementById('modal-bg').classList.add('open');
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modal-bg'))
    document.getElementById('modal-bg').classList.remove('open');
}

function selectSize(s, btn) {
  selectedSize = s;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
}

// "Add to Cart" button inside the modal
document.getElementById('modal-add-btn').onclick = () => {
  if (!selectedSize) { showToast('Please select a size first'); return; }
  addToCart(activeModal, selectedSize);
  document.getElementById('modal-bg').classList.remove('open');
};

/* ─── CART LOGIC (index page) ───────────────────────────────────────
   quickAdd()      adds default size "M" from the product card button.
   addToCart()     increments quantity if already in cart, or adds new
                   entry. Always saves back to localStorage immediately.
   ─────────────────────────────────────────────────────────────── */
function quickAdd(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  addToCart(p, 'M');
}

function addToCart(product, size) {
  const key      = `${product.id}-${size}`;
  const existing = cart.find(i => i.key === key);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ key, product, size, qty: 1 });
  }

  saveCart(cart);
  updateCartCount();
  showToast(`${product.name} (${size}) added to cart!`);
}

/* ─── OUR STORY IMAGE — POINTER PARALLAX ────────────────────────── */
function initStoryParallax() {
  const wrap = document.getElementById('story-img');
  if (!wrap) return;
  const layers = wrap.querySelectorAll('img, .img-placeholder');

  wrap.addEventListener('mousemove', e => {
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left)  / rect.width  - 0.5;
    const y = (e.clientY - rect.top)   / rect.height - 0.5;
    const tx = x * -24, ty = y * -24;
    layers.forEach(el => el.style.transform = `translate(${tx}px, ${ty}px) scale(1.08)`);
  });

  wrap.addEventListener('mouseleave', () => {
    layers.forEach(el => el.style.transform = 'translate(0,0) scale(1)');
  });
}

/* ─── INITIALISATION ────────────────────────────────────────────── */
filterProducts();
initStoryParallax();