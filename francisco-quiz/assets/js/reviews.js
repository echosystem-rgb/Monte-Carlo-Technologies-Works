/* ═══════════════════════════════════════════════════════════════════
   REVIEWS MODULE - Centralized review system (eliminates 3x duplication)
   Used by: index.html, about.html, testimonials.html
   ═══════════════════════════════════════════════════════════════════ */

const SEED_REVIEWS = [
  { id: 1, email: 'rider1@example.com', name: 'Marco R.', stars: 5, title: 'Track Day Instructor, Clark International', text: '"The RS-01 Pro survived my first high-side crash at Turn 7. Not a scratch through. This jacket literally saved my shoulder."', date: new Date().toISOString(), helpful: 8 },
  { id: 2, email: 'rider2@example.com', name: 'Ana P.', stars: 5, title: 'Adventure Tourer, Mindanao Circuit', text: '"I\'ve ridden 30,000 km in the Tour X across Southeast Asia. Zero water ingress, even in typhoon rain. Absolutely bulletproof."', date: new Date().toISOString(), helpful: 5 },
  { id: 3, email: 'rider3@example.com', name: 'Javi S.', stars: 5, title: 'Club Racer, BGC Trackday', text: '"The Race 01 Pro gloves give me a perfect feel on the brakes. Kangaroo leather is next level — worn them for 3 seasons."', date: new Date().toISOString(), helpful: 12 },
  { id: 4, email: 'rider4@example.com', name: 'Kenji H.', stars: 5, title: 'Club Racer, Batangas Racing Circuit', text: '"Circuit 4S jacket and Circuit Pro Pants combo is race-replica perfect. The airbag integration is next-level engineering."', date: new Date().toISOString(), helpful: 3 }
];

function loadReviews() {
  const stored = localStorage.getItem('ekoMotoReviews');
  return stored ? JSON.parse(stored) : SEED_REVIEWS;
}

function saveReviews(reviews) {
  localStorage.setItem('ekoMotoReviews', JSON.stringify(reviews));
}

function allReviews() {
  return loadReviews();
}

function renderStatsBar() {
  const reviews = allReviews();
  if (reviews.length === 0) {
    document.querySelectorAll('.review-stats-bar').forEach(el => el.innerHTML = '<p style="color:#555; text-align:center;">No reviews yet</p>');
    return;
  }
  const avg = (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1);
  const counts = [0, 0, 0, 0, 0];
  reviews.forEach(r => counts[r.stars - 1]++);
  const html = `
    <div class="review-avg-score">${avg}</div>
    <div class="review-stars-display">${'★'.repeat(Math.round(avg))}<span style="color:#333">${'★'.repeat(5 - Math.round(avg))}</span></div>
    <div style="color:#888; font-size:12px; margin-top:4px;">${reviews.length} review${reviews.length!==1?'s':''}</div>
    <div class="review-bars">
      ${[5,4,3,2,1].map(s => `<div class="review-bar-row"><span style="font-size:11px;width:18px">${s}★</span><div class="review-bar-container"><div class="review-bar-fill" style="width:${reviews.length>0?(counts[s-1]/reviews.length)*100:0}%"></div></div><span style="font-size:11px;color:#555">${counts[s-1]}</span></div>`).join('')}
    </div>
  `;
  document.querySelectorAll('.review-stats-bar').forEach(el => el.innerHTML = html);
}

function getSortedReviews(sort = 'newest') {
  const reviews = allReviews();
  if (sort === 'highest') return [...reviews].sort((a, b) => b.stars - a.stars);
  if (sort === 'lowest') return [...reviews].sort((a, b) => a.stars - b.stars);
  if (sort === 'oldest') return [...reviews].sort((a, b) => new Date(a.date) - new Date(b.date));
  return [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderReviewPage() {
  const sort = document.getElementById('review-sort-sel') ? document.getElementById('review-sort-sel').value : 'newest';
  const reviews = getSortedReviews(sort);
  const html = reviews.map(r => `
    <div class="review-card">
      <div class="review-stars">${'★'.repeat(r.stars)}<span style="color:#333">${'★'.repeat(5-r.stars)}</span></div>
      <div class="review-text">${r.text}</div>
      <div class="review-author">${r.name}</div>
      <div class="review-date">${r.title || 'Verified Rider'}</div>
    </div>
  `).join('');
  const container = document.getElementById('review-cards-grid');
  if (container) container.innerHTML = html;
}

function renderReviews() {
  renderStatsBar();
  renderReviewPage();
}

function showMoreReviews() {
  renderReviews();
}

let currentReviewStars = 0;
function setReviewStar(n) {
  currentReviewStars = n;
  document.querySelectorAll('.star-picker-btn').forEach((el, i) => {
    el.textContent = i < n ? '★' : '☆';
    el.style.color = i < n ? 'var(--red)' : '#333';
  });
}

function submitReview() {
  const user = typeof getUser === 'function' ? getUser() : null;
  if (!user) { showToast('Please log in to post a review.'); openLogin(); return; }
  const name = document.getElementById('review-name').value.trim();
  const title = document.getElementById('review-role').value.trim() || 'Verified Rider';
  const text = document.getElementById('review-text').value.trim();
  if (currentReviewStars === 0 || !name || !text) { showToast('Please fill in all required fields.'); return; }
  const reviews = loadReviews();
  const newReview = { id: Date.now(), email: user.email, name, stars: currentReviewStars, title, text, date: new Date().toISOString(), helpful: 0 };
  reviews.unshift(newReview);
  saveReviews(reviews);
  document.getElementById('review-name').value = '';
  document.getElementById('review-role').value = '';
  document.getElementById('review-text').value = '';
  currentReviewStars = 0;
  setReviewStar(0);
  document.getElementById('review-char-num').textContent = '0';
  renderReviews();
  showToast('Review posted! Thank you!');
}

function deleteReview(id) {
  if (!confirm('Delete this review?')) return;
  let reviews = loadReviews();
  reviews = reviews.filter(r => r.id !== id);
  saveReviews(reviews);
  renderReviews();
  showToast('Review deleted.');
}

function markHelpful(id) {
  const reviews = loadReviews();
  const review = reviews.find(r => r.id === id);
  if (review) {
    review.helpful = (review.helpful || 0) + 1;
    saveReviews(reviews);
    renderReviews();
  }
}

function refreshReviewFormAuth() {
  const user = typeof getUser === 'function' ? getUser() : null;
  const gate = document.getElementById('review-login-gate');
  const form = document.getElementById('review-form-wrap');
  if (gate) gate.style.display = user ? 'none' : 'block';
  if (form) form.style.display = user ? 'block' : 'none';
}

function updateReviewCharCount() {
  const textarea = document.getElementById('review-text');
  const counter = document.getElementById('review-char-num');
  if (counter && textarea) counter.textContent = textarea.value.length;
}

/* Initialize reviews on page load */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('review-cards-grid')) {
      renderReviews();
      refreshReviewFormAuth();
    }
    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener('storage', refreshReviewFormAuth);
  });
} else {
  if (document.getElementById('review-cards-grid')) {
    renderReviews();
    refreshReviewFormAuth();
  }
  // Listen for storage changes (login/logout from other tabs)
  window.addEventListener('storage', refreshReviewFormAuth);
}

// Also call this function when user logs in/out within the same page
// This will be called by the auth functions after successful login/logout
window.notifyReviewAuthChange = function() {
  if (document.getElementById('review-cards-grid')) {
    refreshReviewFormAuth();
  }
};
