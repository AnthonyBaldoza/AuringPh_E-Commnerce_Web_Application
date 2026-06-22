/* ============================================
   AURINGPH - GLOBAL JAVASCRIPT
   Shared functions used across all pages
   ============================================ */

// Show a small popup message at the bottom of the screen
function showToast(msg, duration = 2000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// Toggle heart/favorite button (used on product cards)
function toggleHeart(btn) {
  btn.classList.toggle('active');
  const isActive = btn.classList.contains('active');
  btn.textContent = isActive ? '♥' : '♡';
  btn.setAttribute('aria-label', isActive ? 'Remove from favorites' : 'Add to favorites');
  showToast(isActive ? 'Added to favorites!' : 'Removed from favorites');
}

// Highlight the clicked filter chip and unhighlight its siblings
function setActiveChip(el) {
  const parent = el.parentElement;
  parent.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// Highlight the clicked size chip (e.g. S, M, L, XL) and unhighlight its siblings
function setActiveSize(el) {
  const parent = el.parentElement;
  parent.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// ============================================
// DYNAMIC NAV BADGE COUNTS
// Reads from localStorage and updates cart,
// favorites, and notification badge numbers.
// Call syncNavBadges() after any cart/fav update.
// ============================================
function syncNavBadges() {
  const cart      = JSON.parse(localStorage.getItem('auringph_cart'))     || [];
  const wishlist  = JSON.parse(localStorage.getItem('auringph_wishlist')) || [];
  const notifs    = JSON.parse(localStorage.getItem('auringph_notifs'))   || [];

  const cartTotal  = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const favsTotal  = wishlist.length;
  const notifTotal = notifs.filter(n => !n.read).length;

  const setbadge = (id, count) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = count > 0 ? count : '';
    el.style.display = count > 0 ? '' : 'none';
  };

  setbadge('cartCount',  cartTotal);
  setbadge('favCount',   favsTotal);
  setbadge('notifCount', notifTotal);
}

// ============================================
// NAVBAR AVATAR (top-right "AB" circle)
// Reads the logged-in user from localStorage and
// shows their uploaded photo (if any) instead of
// initials — on every page, not just profile.html.
// ============================================
function getInitialsFromUser(user) {
  if (!user) return 'AB';
  const f = (user.firstName || '').trim()[0] || '';
  const l = (user.lastName  || '').trim()[0] || '';
  const initials = (f + l).toUpperCase();
  return initials || (user.email ? user.email[0].toUpperCase() : 'AB');
}

function syncNavAvatar() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const initials = getInitialsFromUser(user);

  document.querySelectorAll('.nav-avatar').forEach(avatar => {
    if (user && user.photo) {
      avatar.style.backgroundImage = `url(${user.photo})`;
      avatar.style.backgroundSize = 'cover';
      avatar.style.backgroundPosition = 'center';
      avatar.textContent = '';
    } else {
      avatar.style.backgroundImage = '';
      avatar.textContent = initials;
    }
  });
}

// Run on every page load
syncNavAvatar();

// Run on every page load
syncNavBadges();

// If a product/category/hero/auth-banner image fails to load, hide it and
// let the parent's CSS fallback (solid color or gradient) show instead
// of the browser's default broken-image + alt text.
document.querySelectorAll(
  '.product-img img, .category-card img, .hero-banner img, .auth-branding-img'
).forEach(img => {
  img.addEventListener('error', () => {
    img.style.display = 'none';
    img.parentElement.classList.add('img-missing');
  });
});

// ============================================
// ACCESSIBILITY: keyboard support for clickable
// cards (divs with onclick aren't focusable or
// triggerable by keyboard by default).
// ============================================
document.querySelectorAll('.product-card, .category-card, .others-card').forEach(card => {
  if (card.hasAttribute('onclick') && !card.hasAttribute('tabindex')) {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  }
});

// Profile avatar (top-right "AB" circle) is a clickable div too
document.querySelectorAll('.nav-avatar').forEach(avatar => {
  if (avatar.hasAttribute('onclick') && !avatar.hasAttribute('tabindex')) {
    avatar.setAttribute('tabindex', '0');
    avatar.setAttribute('role', 'button');
    if (!avatar.hasAttribute('aria-label')) {
      avatar.setAttribute('aria-label', 'My Profile');
    }
    avatar.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        avatar.click();
      }
    });
  }
});

// ============================================
// ACTIVE NAV LINK — dynamic highlighting
// Removes hardcoded "active" reliance; works
// automatically on every page.
// ============================================
document.querySelectorAll('.nav-link').forEach(link => {
  // Compare just the filename portion (e.g. "shirts.html")
  const linkFile = link.getAttribute('href').split('/').pop();
  const pageFile = window.location.pathname.split('/').pop();
  if (linkFile === pageFile) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

// ============================================
// ACTIVE BOTTOM NAV — dynamic highlighting
// Matches onclick href filename to current page
// ============================================
document.querySelectorAll('.bottom-nav-item').forEach(btn => {
  const onclick = btn.getAttribute('onclick') || '';
  const match = onclick.match(/href='([^']+)'/);
  if (!match) return;
  const linkFile = match[1].split('/').pop();
  const pageFile = window.location.pathname.split('/').pop();
  if (linkFile === pageFile) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
});

// ============================================
// MESSAGES BADGE — shows unread chat count
// on the 💬 navbar icon across all pages.
// Reads from localStorage (auringph_unread),
// set by js/messaging.js on the messages page.
// ============================================
(function updateMsgBadge() {
  const badge = document.getElementById('msgCount');
  if (!badge) return; // page has no messages icon

  function refresh() {
    try {
      const unread = JSON.parse(localStorage.getItem('auringph_unread')) || {};
      // Logged-in user's own unread count (matches USER_ID in messages.html)
      const count = unread['user_user_ac'] || 0;
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    } catch {
      badge.textContent = '0';
    }
  }

  refresh();
  setInterval(refresh, 2000); // light polling, keeps badge live
})();