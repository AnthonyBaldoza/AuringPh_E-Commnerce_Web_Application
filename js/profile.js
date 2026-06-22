// ============================================
// profile.js — LocalStorage Version
// ============================================

let currentUser = JSON.parse(localStorage.getItem("user"));

if (!localStorage.getItem("isLoggedIn") || !currentUser) {
    window.location.href = "../index.html";
} else {
    // Load profile (only if actually logged in — otherwise we'd call
    // renderProfile(null) and throw before the redirect finishes)
    renderProfile(currentUser);
}

// ============================================
// RENDER PROFILE
// ============================================

function renderProfile(profile) {

    const initials = getInitials(
        profile.firstName,
        profile.lastName,
        profile.email
    );

    document.querySelectorAll('.nav-avatar, .profile-avatar').forEach(el => {
        if (profile.photo) {
            el.style.backgroundImage = `url(${profile.photo})`;
            el.style.backgroundSize = 'cover';
            el.style.backgroundPosition = 'center';
            el.textContent = '';
        } else {
            el.style.backgroundImage = '';
            el.textContent = initials;
        }
    }
);
    const fullName =
        `${profile.firstName || ''} ${profile.lastName || ''}`.trim();

    setVal('.profile-name', fullName);
    setVal('.profile-email', profile.email);

    setInput('firstName', profile.firstName || '');
    setInput('lastName', profile.lastName || '');
    setInput('email', profile.email || '');
    setInput('phone', profile.phone || '');
    setInput('birthday', profile.birthday || '');

    const gender = document.getElementById('gender');
    if (gender) gender.value = profile.gender || '';

    if (profile.createdAt) {
        const date = new Date(profile.createdAt);

        setVal(
            '.profile-member-badge',
            `🌸 Member since ${date.toLocaleDateString()}`
        );
    }
}

// ============================================
// EDIT
// ============================================

let editing = false;

window.toggleEdit = function () {

    editing = !editing;

    const inputs =
        document.querySelectorAll('.profile-form .form-input');

    const actions =
        document.getElementById('formActions');

    const editBtn =
        document.getElementById('editBtn');

    inputs.forEach(i => i.disabled = !editing);

    actions.style.display = editing ? 'flex' : 'none';

    editBtn.textContent =
        editing ? '✕ Cancel' : '✏️ Edit';

    if (!editing) {
        renderProfile(currentUser);
    }
};

window.cancelEdit = function () {

    editing = false;

    document
        .querySelectorAll('.profile-form .form-input')
        .forEach(i => i.disabled = true);

    document.getElementById('formActions').style.display = 'none';

    document.getElementById('editBtn').textContent =
        '✏️ Edit';

    renderProfile(currentUser);
};

// ============================================
// SAVE PROFILE
// ============================================

window.saveProfile = function (e) {

    e.preventDefault();

    currentUser.firstName =
        document.getElementById('firstName').value.trim();

    currentUser.lastName =
        document.getElementById('lastName').value.trim();

    currentUser.phone =
        document.getElementById('phone').value.trim();

    currentUser.birthday =
        document.getElementById('birthday').value;

    currentUser.gender =
        document.getElementById('gender').value;

    localStorage.setItem(
        "user",
        JSON.stringify(currentUser)
    );

    renderProfile(currentUser);

    window.cancelEdit();

    alert("Profile updated successfully!");
};

// ============================================
// LOGOUT
// ============================================

window.confirmLogout = function () {
    document
        .getElementById('logoutModal')
        ?.classList.add('open');
};

window.closeModal = function () {
    document
        .getElementById('logoutModal')
        ?.classList.remove('open');
};

window.doLogout = function () {

    localStorage.removeItem("isLoggedIn");

    window.location.href =
        "../index.html";
};

// ============================================
// CHANGE PASSWORD
// ============================================

window.changePassword = function (e) {

    e.preventDefault();

    const currentPass =
        document.getElementById('currentPass').value;

    const newPass =
        document.getElementById('newPass').value;

    const confirmPass =
        document.getElementById('confirmPass').value;

    if (currentPass !== currentUser.password) {
        alert("Current password is incorrect.");
        return;
    }

    if (newPass !== confirmPass) {
        alert("Passwords do not match.");
        return;
    }

    if (newPass.length < 8) {
        alert("Password must be at least 8 characters.");
        return;
    }

    currentUser.password = newPass;

    localStorage.setItem(
        "user",
        JSON.stringify(currentUser)
    );

    alert("Password updated successfully.");

    e.target.reset();
};

// ============================================
// HELPERS
// ============================================

function getInitials(firstName, lastName, email) {

    if (firstName && lastName)
        return (firstName[0] + lastName[0]).toUpperCase();

    if (firstName)
        return firstName[0].toUpperCase();

    return email[0].toUpperCase();
}

function setVal(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
}

function setInput(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}