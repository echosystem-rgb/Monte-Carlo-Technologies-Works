# EKO MOTO – Frontend E-Commerce Platform

A responsive multi-page e-commerce frontend for **EKO MOTO**, a premium racing gear brand specializing in CE2-certified protective gear.  
Built with **pure HTML/CSS/JavaScript** — no backend, no framework, no build step, no dependencies.

---

## Project Structure

```
francisco-quiz/
│
├── HTML Pages (11 total)
│   ├── index.html                 → Home: Hero, Product Grid, Reviews, CTA
│   ├── cart.html                  → Shopping Cart with Qty Controls
│   ├── checkout.html              → Multi-step Checkout Form & Payment Methods
│   ├── thank-you.html             → Order Confirmation Page
│   ├── about.html                 → Brand Story & Reviews Section
│   ├── our-story.html             → Detailed Company History
│   ├── our-mission.html           → Mission & Values
│   ├── certifications.html        → CE2 Certification Details
│   ├── testimonials.html          → Full Reviews & Ratings Page
│   ├── privacy-policy.html        → Legal: Privacy Policy
│   ├── terms-conditions.html      → Legal: T&C
│   ├── terms-of-use.html          → Legal: Terms of Use
│   └── snippets.html              → UI Component Reference (dev only)
│
├── assets/
│   ├── css/
│   │   ├── style.css              → 2500+ lines: All layouts, components, responsive
│   │   ├── reviews.css            → Centralized review/testimonial styles (3x reuse)
│   │   └── Login additions.css    → Modal & auth overrides for rounded appearance
│   │
│   ├── js/
│   │   ├── main.js                → ~800 lines: Auth, cart, theme, notifications
│   │   ├── products.js            → Product data, filtering, sorting, modals
│   │   ├── cart.js                → Cart rendering & item management
│   │   ├── checkout.js            → Form validation & order placement
│   │   └── reviews.js             → Reviews: render, filter, sort, submit
│   │
│   └── images/
│       ├── (product photos)
│       └── (gallery & decorative images)
│
├── README.md (this file)
└── .gitignore (if using version control)
```

---

## Design Approach

### Philosophy
**Mobile-first, accessibility-focused, performance-optimized** e-commerce experience with minimal overhead.

### Key Principles
1. **Zero External Dependencies** — All logic in vanilla JS, all styles in CSS
2. **Single Page State** — Cart, user, theme stored in localStorage; synced across tabs/sessions
3. **Modular CSS** — Organized by component with custom properties (CSS variables) for theming
4. **Progressive Enhancement** — Works without JS (basic structure visible), enhanced by JS (interactivity)
5. **Semantic HTML** — ARIA labels, proper heading hierarchy, form semantics for accessibility

### Design System
- **Typography:** Barlow Condensed (headings, nav) + Barlow (body text)
- **Color Tokens:** `--dark`, `--light`, `--muted`, `--red`, `--mid`, `--border`, etc.
- **Spacing:** Rem-based (8px base unit) for responsive scales
- **Breakpoints:** 
  - `480px` — Mobile
  - `768px` — Tablet
  - `1200px` — Desktop
- **Theme:** Light/Dark mode toggle, persisted in localStorage

### Component Architecture
- **Modular CSS blocks** — `.payment-option`, `.review-card`, `.product-modal`, etc.
- **BEM-ish naming** — `.element__child`, `.element--modifier` (loose convention)
- **Responsive grids** — CSS Grid for layouts, Flexbox for component internals
- **Reusable modules** — Reviews section used on index.html, about.html, testimonials.html

---

## JavaScript Logic Flow

### Initialization (main.js)
```
Page Load
  ↓
document.DOMContentLoaded fires
  ↓
1. loadTheme() → Apply saved light/dark mode
2. loadUser() → Restore logged-in user from localStorage
3. loadCart() → Populate cart array from eko_cart
4. updateCartCount() → Update nav badge
5. refreshReviewFormAuth() → Show/hide review form based on login state
```

### User Authentication Flow
```
User clicks "Login"
  ↓
openLogin() → Show modal, pre-fill remembered email/password
  ↓
doLogin() → Validate credentials against localStorage users
  ↓
  ├─ Success: Save to localStorage, close modal, update navbar
  └─ Fail: Show error toast
```

### Shopping Flow
```
User adds product to cart
  ↓
addToCart(key, size) [products.js]
  ↓
cart.push({ key, product, size, qty })
saveCart(cart) → localStorage.setItem('eko_cart', JSON.stringify(cart))
updateCartCount() → Update nav badge
  ↓
User navigates to /cart.html
  ↓
renderCart() [cart.js]
  ↓
Load from localStorage, build DOM, attach event listeners
  ↓
User updates quantity / removes item
  ↓
saveCart() called, renderCart() re-runs (optimistic update)
```

### Checkout Flow
```
User clicks "Place Order"
  ↓
placeOrder() [checkout.js]
  ↓
1. Validate all form fields (frontend only)
2. Validate payment method selected
3. For GCash/Maya/Bank Transfer: Require receipt file attached
4. Save eko_customer + eko_order to localStorage
5. Clear eko_cart
6. Redirect to thank-you.html
  ↓
thank-you.html loads
  ↓
renderThankYou() reads eko_order from localStorage, displays confirmation
```

### Review Submission Flow
```
User logged in + views review form
  ↓
submitReview() [reviews.js]
  ↓
1. Validate: stars + name + text filled
2. Validate: receipt file attached (proof of purchase)
3. Create review object, add to localStorage reviews
4. Re-render: renderReviews() updates all review sections
5. Show success toast, clear form
```

### Theme Toggle
```
User clicks moon/sun icon
  ↓
toggleTheme() [main.js]
  ↓
1. document.documentElement.classList.toggle('dark')
2. localStorage.setItem('eko_theme', newTheme)
3. All CSS respects [class="dark"] selector (no color resets needed)
```

---

## localStorage Structure

### eko_cart (Array)
```javascript
[
  {
    key: "rs-01-pro",
    product: { name: "RS-01 Pro", price: 2500, ... },
    size: "M",
    qty: 1
  },
  { ... }
]
```

### eko_user (Object)
```javascript
{
  email: "rider@example.com",
  name: "John Rider",
  dob: "1990-05-15",
  phone: "+63917000000",
  address: "123 Rizal St",
  city: "San Pablo City",
  zip: "4000",
  lastLogin: "2026-06-17T10:30:00Z",
  signupDate: "2026-01-15T08:00:00Z"
}
```

### eko_customer (Object)
```javascript
{
  firstName: "John",
  lastName: "Rider",
  email: "rider@example.com",
  phone: "+63917000000",
  address: "123 Rizal St, Brgy. San Jose",
  city: "San Pablo City",
  zip: "4000",
  notes: "Gate 2, blue house"
}
```

### eko_order (Object)
```javascript
{
  ref: "EKO-A3F9X2",
  customer: { firstName, lastName, email, phone, address, city, zip, notes },
  items: [ { key, product, size, qty }, ... ],
  subtotal: 2500,
  shipping: 25,
  total: 2525,
  paymentMethod: "GCash",
  date: "June 17, 2026"
}
```

### eko_users (Array of user objects)
```javascript
[
  {
    email: "user@example.com",
    password: "base64-encoded-password",
    name: "Full Name",
    dob: "YYYY-MM-DD",
    phone: "...",
    address: "...",
    city: "...",
    zip: "...",
    signupDate: "ISO-timestamp"
  },
  { ... }
]
```

### eko_theme (String)
```javascript
"light" or "dark"
```

### eko_remember_email (String)
```javascript
"rider@example.com"  // Saved when "Remember me" is checked
```

### eko_remember_password (String)
```javascript
"base64-encoded-password"  // Saved with email for "Remember me"
```

### eko_reviews (Array of review objects)
```javascript
[
  {
    id: 1718618400000,
    email: "rider@example.com",
    name: "John Rider",
    stars: 5,
    title: "Track Day Instructor, BGC Trackday",
    text: "Amazing gear...",
    date: "2026-06-17T10:00:00Z",
    helpful: 3
  },
  { ... }
]
```

### eko_login_attempts (Array)
```javascript
[
  {
    email: "attacker@example.com",
    success: false,
    timestamp: "2026-06-17T10:15:00Z"
  },
  { ... }
]
```

---

## Key Features

### Core E-Commerce
✅ Product listing with dynamic grid  
✅ Product quick-view modal with detailed images  
✅ Add to Cart with size selection  
✅ Shopping cart with quantity & removal controls  
✅ Auto-calculated subtotal, shipping, total  
✅ Checkout form with frontend validation  
✅ Order confirmation page with order reference  
✅ Data persistence across sessions (localStorage)  

### Authentication
✅ User registration (email, password, DOB 18+, address)  
✅ User login with email/password  
✅ Social login scaffolding (Google, Facebook)  
✅ "Remember me" functionality (saves email + password)  
✅ Password masking in login form  
✅ Profile editor page  
✅ Login attempt tracking  

### Payment & Verification
✅ Multiple payment methods (Cash, GCash, Maya, Bank Transfer)  
✅ Bank account details for 4 banks (BDO, BPI, Metrobank, UnionBank)  
✅ Receipt/proof-of-payment upload requirement for online payments  
✅ File size validation (max 5MB)  

### Reviews & Testimonials
✅ 5-star rating system  
✅ Review submission (only verified users + proof of purchase)  
✅ Review display on index, about, testimonials pages  
✅ Rating breakdown bar chart  
✅ Sort reviews by newest, oldest, highest, lowest rating  
✅ Helpful/unhelpful voting on reviews  

### UX Enhancements
✅ Dark/Light mode toggle (persisted)  
✅ Toast notifications for actions  
✅ Product search with live filtering  
✅ Category filters (All, Track, Touring, Urban)  
✅ Sort by price/name  
✅ Responsive design (480px, 768px, 1200px breakpoints)  
✅ Smooth animations (modals, transitions)  
✅ Login modal with scroll lock on background  

### Pages & Content
✅ Home page with hero, featured products, reviews  
✅ About page with company story + reviews  
✅ Our Story, Our Mission, Certifications pages  
✅ Full Testimonials page with filtering & sorting  
✅ Privacy Policy, Terms & Conditions, Terms of Use pages  
✅ Thank you / Order confirmation page  
✅ Cart & Checkout pages with full validation  

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Fonts** | Google Fonts (Barlow, Barlow Condensed) |
| **State Management** | localStorage (no external library) |
| **Form Validation** | Vanilla JS regex & DOM APIs |
| **Styling Approach** | CSS Custom Properties, Grid, Flexbox |
| **Icons/Images** | Unicode emojis, custom SVG icons |
| **Build Process** | None (works as-is, no transpilation) |
| **Backend** | None (frontend-only, data in localStorage) |
| **Database** | None (localStorage only) |
| **Framework** | None (vanilla JS) |

---

## How to Run

### Local Development (XAMPP)
```bash
1. Copy folder to C:\xampp\htdocs\francisco-quiz\
2. Start Apache in XAMPP Control Panel
3. Visit: http://localhost/francisco-quiz/
```

### Production Deployment
```bash
1. Upload all files to web host
2. Serve on HTTPS (for security)
3. localStorage will work automatically
```

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 14+)
- Mobile Chrome (Android 90+)

All modern browsers support ES6, CSS Grid, and localStorage.

---

## File Size & Performance

- **HTML:** ~50KB combined
- **CSS:** ~120KB combined
- **JavaScript:** ~100KB combined
- **Total:** ~270KB (uncompressed)
- **Load Time:** <1s on 4G connection

No images = ultra-fast page loads. Add product images as needed.

---

## Future Enhancements

- [ ] Backend API integration (Node/Express, PHP, etc.)
- [ ] Real payment processing (Stripe, PayPal)
- [ ] Database (MySQL) for persistent order history
- [ ] Email notifications for orders
- [ ] Admin dashboard for inventory & orders
- [ ] Product reviews with photo uploads
- [ ] Wishlist functionality
- [ ] Abandoned cart recovery emails
- [ ] Analytics & tracking
- [ ] SEO optimization & meta tags

---

## License & Credits

This is a custom e-commerce platform built for EKO MOTO racing gear brand.

---

**Last Updated:** June 17, 2026  
**Version:** 2.0