/* ============================================
   MESSAGING SYSTEM — SHARED JS
   File: js/messaging.js

   Uses localStorage to simulate real-time chat
   between User and Admin (no backend needed).
   ============================================ */

const CHAT_KEY = "auringph_chats";
const UNREAD_KEY = "auringph_unread";

/* ────────────────────────────────────────────
   Storage helpers
   ──────────────────────────────────────────── */

/** @returns {Record<string, {userId:string, messages:Array, lastMessage?:string, lastTime?:string}>} */
function getAllChats() {
  try {
    return JSON.parse(localStorage.getItem(CHAT_KEY)) || {};
  } catch {
    return {};
  }
}

function saveAllChats(data) {
  try {
    localStorage.setItem(CHAT_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("[messaging] failed to save chats", err);
  }
}

function getUnread() {
  try {
    return JSON.parse(localStorage.getItem(UNREAD_KEY)) || {};
  } catch {
    return {};
  }
}

function saveUnread(data) {
  try {
    localStorage.setItem(UNREAD_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("[messaging] failed to save unread", err);
  }
}

/* ────────────────────────────────────────────
   Thread API
   ──────────────────────────────────────────── */

/** Get or create a conversation thread for a userId */
function getThread(userId) {
  const all = getAllChats();
  if (!all[userId]) {
    all[userId] = { userId, messages: [] };
    saveAllChats(all);
  }
  return all[userId];
}

/**
 * Post a message into a thread.
 * @param {string} userId
 * @param {'user'|'admin'} sender
 * @param {string} text
 * @param {object} [extra] additional fields (e.g. invoice payload)
 */
function postMessage(userId, sender, text, extra = {}) {
  const all = getAllChats();
  if (!all[userId]) all[userId] = { userId, messages: [] };

  const msg = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    sender,
    text,
    time: new Date().toISOString(),
    ...extra,
  };

  all[userId].messages.push(msg);
  all[userId].lastMessage = text || "[attachment]";
  all[userId].lastTime = msg.time;
  saveAllChats(all);

  // Increment unread count for the *other* side
  const unread = getUnread();
  const target = sender === "user" ? "admin" : `user_${userId}`;
  unread[target] = (unread[target] || 0) + 1;
  saveUnread(unread);

  return msg;
}

function markRead(userId, role) {
  const unread = getUnread();
  const key = role === "admin" ? "admin" : `user_${userId}`;
  unread[key] = 0;
  saveUnread(unread);
}

function getUserUnread(userId) {
  return getUnread()[`user_${userId}`] || 0;
}

function getAdminUnread() {
  const unread = getUnread();
  return Object.keys(unread)
    .filter((k) => k !== "admin")
    .reduce((sum, k) => sum + (unread[k] || 0), 0);
}

/* ────────────────────────────────────────────
   Formatting helpers
   ──────────────────────────────────────────── */

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

  return d.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Short relative timestamp for conversation previews */
function getRelativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
  });
}

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ────────────────────────────────────────────
   Demo seed
   ──────────────────────────────────────────── */

function seedDemoIfEmpty(userId, userName) {
  const all = getAllChats();
  if (all[userId] && all[userId].messages.length > 0) return;

  const now = Date.now();
  const msgs = [
    {
      id: `seed-1`,
      sender: "user",
      text: "Hi! I have a question about my order #ORD-20241015.",
      time: new Date(now - 3600000 * 2).toISOString(),
    },
    {
      id: `seed-2`,
      sender: "admin",
      text: "Hello! Sure, how can I help you with that order? 😊",
      time: new Date(now - 3600000 * 2 + 30000).toISOString(),
    },
    {
      id: `seed-3`,
      sender: "user",
      text: "Can I get an invoice for that order? I need it for reimbursement.",
      time: new Date(now - 3600000).toISOString(),
    },
    {
      id: `seed-4`,
      sender: "admin",
      text: "Of course! Here's the invoice for your order:",
      time: new Date(now - 3600000 + 10000).toISOString(),
    },
    {
      id: `seed-5`,
      sender: "admin",
      text: "",
      time: new Date(now - 3600000 + 15000).toISOString(),
      type: "invoice",
      invoice: {
        id: "#INV-20241015",
        order: "#ORD-20241015",
        item: "Nike Air Force 1 '07 White (EU 42)",
        amount: "₱4,995",
        date: "Oct 15, 2024",
        status: "Paid",
      },
    },
  ];

  if (!all[userId]) all[userId] = { userId };
  all[userId].messages = msgs;
  all[userId].lastMessage = "Invoice sent";
  all[userId].lastTime = msgs[msgs.length - 1].time;
  saveAllChats(all);
}

/* ────────────────────────────────────────────
   Rendering
   ──────────────────────────────────────────── */

function renderMessageBubble(msg, currentRole) {
  const isMe = msg.sender === currentRole;
  const meClass = isMe ? "from-me" : "";
  const initials = isMe
    ? currentRole === "admin"
      ? "AD"
      : "ME"
    : currentRole === "admin"
      ? "U"
      : "AD";
  const timeStr = formatTime(msg.time);

  if (msg.type === "invoice" && msg.invoice) {
    const inv = msg.invoice;
    return `
      <div class="msg-row ${meClass}">
        <div class="msg-avatar-sm" aria-hidden="true">${initials}</div>
        <div class="msg-bubble-wrap">
          <div class="msg-bubble msg-invoice">
            <div class="invoice-tag">📄 Invoice</div>
            <div class="invoice-details">
              <div class="invoice-id">${escapeHtml(inv.id)}</div>
              <div>Order: ${escapeHtml(inv.order)}</div>
              <div>Item: ${escapeHtml(inv.item)}</div>
              <div>Amount: <strong>${escapeHtml(inv.amount)}</strong></div>
              <div>Date: ${escapeHtml(inv.date)}</div>
              <div>Status: <strong style="color:var(--green)">${escapeHtml(inv.status)}</strong></div>
            </div>
          </div>
          <div class="msg-time">${timeStr}</div>
        </div>
      </div>`;
  }

  return `
    <div class="msg-row ${meClass}">
      <div class="msg-avatar-sm" aria-hidden="true">${initials}</div>
      <div class="msg-bubble-wrap">
        <div class="msg-bubble">${escapeHtml(msg.text)}</div>
        <div class="msg-time">${timeStr}</div>
      </div>
    </div>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\n/g, "<br>");
}

/**
 * Render thread with date dividers.
 * @param {Array} messages
 * @param {'user'|'admin'} currentRole
 * @param {HTMLElement} container
 * @param {{stickToBottom?:boolean}} [opts]
 */
function renderThread(messages, currentRole, container, opts = {}) {
  if (!messages || messages.length === 0) {
    container.innerHTML = `
      <div class="chat-empty-state">
        <div class="chat-empty-icon" aria-hidden="true">💬</div>
        <div class="chat-empty-title">No messages yet</div>
        <div class="chat-empty-sub">Say hello to AuringPh support — we're here to help!</div>
      </div>`;
    return;
  }

  let html = "";
  let lastDate = "";
  for (const msg of messages) {
    const d = formatDate(msg.time);
    if (d !== lastDate) {
      html += `<div class="chat-date-divider"><span>${d}</span></div>`;
      lastDate = d;
    }
    html += renderMessageBubble(msg, currentRole);
  }
  container.innerHTML = html;

  if (opts.stickToBottom !== false) {
    container.scrollTop = container.scrollHeight;
  }
}

/* ────────────────────────────────────────────
   Scroll helpers
   ──────────────────────────────────────────── */

function isNearBottom(el, threshold = 80) {
  if (!el) return true;
  return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
}

function scrollToBottom(el) {
  if (!el) return;
  el.scrollTop = el.scrollHeight;
}
