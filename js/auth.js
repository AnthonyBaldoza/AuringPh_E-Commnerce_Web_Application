/* ============================================
   auth.js — Frontend Only (LocalStorage)
   No Firebase Required
============================================ */

// ── Redirect if already logged in ──
if (localStorage.getItem("isLoggedIn")) {
  const base =
    window.location.pathname.includes('/pages/')
      ? ''
      : 'pages/';
  window.location.href = base + 'home.html';
}

// ── PASSWORD SHOW/HIDE ──
window.togglePassVis = function(id, btn) {
  const input = document.getElementById(id);
  input.type = input.type === 'password' ? 'text' : 'password';
  btn.textContent = input.type === 'password' ? '👁️' : '🙈';
};

// ============================================
// LOGIN FORM
// ============================================
const loginForm = document.getElementById('login-form');

if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const pass  = document.getElementById('login-pass').value;

    document.getElementById('email-error').textContent = '';
    document.getElementById('pass-error').textContent  = '';

    let valid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      document.getElementById('email-error').textContent =
        '⚠ Please enter a valid email.';
      valid = false;
    }

    if (!pass || pass.length < 6) {
      document.getElementById('pass-error').textContent =
        '⚠ Password must be at least 6 characters.';
      valid = false;
    }

    if (!valid) return;

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (
      storedUser &&
      storedUser.email === email &&
      storedUser.password === pass
    ) {
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "pages/home.html";
    } else {
      document.getElementById('pass-error').textContent =
        '⚠ Incorrect email or password.';
    }
  });
}

// ============================================
// STEP NAVIGATION
// ============================================
window.goStep2 = function() {
  let valid = true;

  const fname = document.getElementById('first-name')?.value.trim();
  const lname = document.getElementById('last-name')?.value.trim();
  const phone = document.getElementById('phone')?.value.trim();
  const email = document.getElementById('signup-email')?.value.trim();

  ['fname-error', 'lname-error', 'phone-error', 'semail-error']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });

  if (!fname) {
    document.getElementById('fname-error').textContent =
      '⚠ First name is required.';
    valid = false;
  }

  if (!lname) {
    document.getElementById('lname-error').textContent =
      '⚠ Last name is required.';
    valid = false;
  }

  if (!phone) {
    document.getElementById('phone-error').textContent =
      '⚠ Phone number is required.';
    valid = false;
  }

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    document.getElementById('semail-error').textContent =
      '⚠ Enter a valid email.';
    valid = false;
  }

  if (!valid) return;

  document.getElementById('formStep1').style.display = 'none';
  document.getElementById('formStep2').style.display = '';

  document.getElementById('step1-dot').classList.remove('active');
  document.getElementById('step1-dot').classList.add('done');
  document.getElementById('step2-dot').classList.add('active');
};

window.goStep1 = function() {
  document.getElementById('formStep2').style.display = 'none';
  document.getElementById('formStep1').style.display = '';

  document.getElementById('step2-dot').classList.remove('active');
  document.getElementById('step1-dot').classList.remove('done');
  document.getElementById('step1-dot').classList.add('active');
};

// ============================================
// PASSWORD STRENGTH
// ============================================
const signupPassInput = document.getElementById('signup-pass');

if (signupPassInput) {
  signupPassInput.addEventListener('input', function() {
    const val = this.value;
    const el  = document.getElementById('signupPassStrength');

    if (!el) return;

    if (!val) {
      el.textContent = '';
      return;
    }

    if (val.length < 6) {
      el.textContent = '⚠️ Too short';
    } else if (val.length < 10 || !/[A-Z]/.test(val) || !/[0-9]/.test(val)) {
      el.textContent = '🟡 Medium strength';
    } else {
      el.textContent = '✅ Strong password';
    }
  });
}

// ============================================
// SIGNUP FORM
// ============================================
const signupForm = document.getElementById('signup-form');

if (signupForm) {
  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const fname   = document.getElementById('first-name').value.trim();
    const lname   = document.getElementById('last-name').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const email   = document.getElementById('signup-email').value.trim();
    const pass    = document.getElementById('signup-pass').value;
    const confirm = document.getElementById('confirm-pass').value;
    const agreed  = document.getElementById('agreeTerms').checked;

    document.getElementById('spass-error').textContent = '';
    document.getElementById('cpass-error').textContent = '';

    let valid = true;

    if (pass.length < 8) {
      document.getElementById('spass-error').textContent =
        '⚠ Password must be at least 8 characters.';
      valid = false;
    }

    if (pass !== confirm) {
      document.getElementById('cpass-error').textContent =
        '⚠ Passwords do not match.';
      valid = false;
    }

    if (!agreed) {
      alert('Please agree to the Terms of Service.');
      valid = false;
    }

    if (!valid) return;

    const user = {
      firstName: fname,
      lastName:  lname,
      phone:     phone,
      email:     email,
      password:  pass
    };

    localStorage.setItem("user",        JSON.stringify(user));
    localStorage.setItem("isLoggedIn",  "true");

    // ── Also register this account in the Admin "Manage Users" list ──
    // (so accounts created via signup actually show up for the admin,
    // not just in the customer-facing session).
    try {
      const ADMIN_USERS_KEY = "auringph_admin_users";
      const adminUsers = JSON.parse(localStorage.getItem(ADMIN_USERS_KEY)) || [];

      const alreadyExists = adminUsers.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!alreadyExists) {
        const nextId = "u" + (adminUsers.length + 1) + "_" + Date.now();
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

        adminUsers.push({
          id: nextId,
          name: (fname + " " + lname).trim(),
          email: email,
          phone: phone || "—",
          joined: today,
          orders: 0,
          status: "active",
        });

        localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(adminUsers));
      }
    } catch (err) {
      // Non-fatal — signup should still succeed even if this fails.
      console.warn("Could not register account in admin users list:", err);
    }

    document.getElementById('step2-dot').classList.remove('active');
    document.getElementById('step2-dot').classList.add('done');
    document.getElementById('step3-dot').classList.add('active');

    setTimeout(() => {
      window.location.href = "pages/home.html";
    }, 1000);
  });
}