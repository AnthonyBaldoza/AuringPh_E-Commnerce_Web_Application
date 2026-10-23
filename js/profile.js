// ============================================
// profile.js — Senior Dev Edition
// ============================================

let currentUser = null;

try {
  const storedUser = localStorage.getItem("user");
  if (storedUser) currentUser = JSON.parse(storedUser);
} catch (e) {
  console.error("Failed to parse user data", e);
}

if (!localStorage.getItem("isLoggedIn") || !currentUser) {
  window.location.href = "../index.html";
} else {
  renderProfile(currentUser);
}

// ============================================
// RENDER PROFILE
// ============================================
function renderProfile(profile) {
  if (!profile) return;

  // 1. Handle Name Formatting
  const formatName = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const firstName = formatName(profile.firstName);
  const lastName = formatName(profile.lastName);
  const fullName = `${firstName} ${lastName}`.trim() || "User";

  // 2. Setup Avatars
  const initials = getInitials(
    profile.firstName,
    profile.lastName,
    profile.email,
  );
  document.querySelectorAll(".nav-avatar, .profile-avatar").forEach((el) => {
    if (profile.photo) {
      el.style.backgroundImage = `url(${profile.photo})`;
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";
      el.textContent = "";
    } else {
      el.style.backgroundImage = "";
      el.textContent = initials;
    }
  });

  // 3. Update Display Text
  setVal("displayName", fullName);
  setVal("displayEmail", profile.email || "No email provided");

  if (profile.createdAt) {
    const date = new Date(profile.createdAt);
    setVal("memberSince", `🌸 Member since ${date.getFullYear()}`);
  } else {
    setVal("memberSince", "🌸 Member");
  }

  // 4. Populate Form Fields
  setInput("firstName", firstName);
  setInput("lastName", lastName);
  setInput("email", profile.email || "");
  setInput("phone", profile.phone || "");
  setInput("birthday", profile.birthday || "");

  const genderSelect = document.getElementById("gender");
  if (genderSelect) genderSelect.value = profile.gender || "";
}

// ============================================
// EDIT MODE TOGGLE
// ============================================
let editing = false;

window.toggleEdit = function () {
  editing = !editing;

  const inputs = document.querySelectorAll(".profile-form .form-input");
  const actions = document.getElementById("formActions");
  const editBtn = document.getElementById("editBtn");

  inputs.forEach((i) => {
    // Don't enable the email field if it's used as primary ID
    if (i.id === "email") return;
    i.disabled = !editing;
  });

  actions.style.display = editing ? "flex" : "none";
  editBtn.style.display = editing ? "none" : "flex";

  if (!editing) {
    renderProfile(currentUser);
  }
};

window.cancelEdit = function () {
  editing = false;
  document
    .querySelectorAll(".profile-form .form-input")
    .forEach((i) => (i.disabled = true));
  document.getElementById("formActions").style.display = "none";
  document.getElementById("editBtn").style.display = "flex";
  renderProfile(currentUser);
};

// ============================================
// SAVE PROFILE
// ============================================
window.saveProfile = function (e) {
  e.preventDefault();

  if (!currentUser) return;

  // Update local object
  currentUser.firstName = document.getElementById("firstName").value.trim();
  currentUser.lastName = document.getElementById("lastName").value.trim();
  currentUser.phone = document.getElementById("phone").value.trim();
  currentUser.birthday = document.getElementById("birthday").value;
  currentUser.gender = document.getElementById("gender").value;

  // Save to LocalStorage
  try {
    localStorage.setItem("user", JSON.stringify(currentUser));
    renderProfile(currentUser);
    window.cancelEdit();

    // Use toast if available, otherwise alert
    if (typeof showToast === "function") {
      showToast("Profile updated successfully! ✨");
    } else {
      alert("Profile updated successfully!");
    }
  } catch (err) {
    console.error("Failed to save profile", err);
    alert("Failed to save changes. Storage might be full.");
  }
};

// ============================================
// LOGOUT & MODALS
// ============================================
window.confirmLogout = function () {
  document.getElementById("logoutModal")?.classList.add("open");
};

window.closeModal = function () {
  document.getElementById("logoutModal")?.classList.remove("open");
};

window.doLogout = function () {
  localStorage.removeItem("isLoggedIn");
  // Optionally keep user data, or remove it: localStorage.removeItem("user");
  window.location.href = "../index.html";
};

// ============================================
// CHANGE PASSWORD
// ============================================
window.changePassword = function (e) {
  e.preventDefault();

  const currentPass = document.getElementById("currentPass").value;
  const newPass = document.getElementById("newPass").value;
  const confirmPass = document.getElementById("confirmPass").value;

  if (currentPass !== currentUser.password) {
    alert("Current password is incorrect.");
    return;
  }

  if (newPass !== confirmPass) {
    alert("New passwords do not match.");
    return;
  }

  if (newPass.length < 8) {
    alert("Password must be at least 8 characters.");
    return;
  }

  currentUser.password = newPass;
  localStorage.setItem("user", JSON.stringify(currentUser));

  if (typeof showToast === "function") {
    showToast("Password updated successfully! 🔒");
  } else {
    alert("Password updated successfully.");
  }

  e.target.reset();
  document.getElementById("passStrength").textContent = "";
};

// ============================================
// HELPERS
// ============================================
function getInitials(firstName, lastName, email) {
  if (firstName && lastName) return (firstName[0] + lastName[0]).toUpperCase();
  if (firstName) return firstName[0].toUpperCase();
  if (email) return email[0].toUpperCase();
  return "?";
}

function setVal(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setInput(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}
