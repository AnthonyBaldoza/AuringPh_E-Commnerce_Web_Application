/* ============================================
   MESSAGING SYSTEM — SHARED JS
   File: js/messaging.js

   Uses localStorage to simulate real-time chat
   between User and Admin (no backend needed).
   ============================================ */

const CHAT_KEY   = 'auringph_chats';   // All conversations
const UNREAD_KEY = 'auringph_unread';  // Unread counts

// ── Helpers ──────────────────────────────────

function getAllChats() {
  try { return JSON.parse(localStorage.getItem(CHAT_KEY)) || {}; }
  catch { return {}; }
}

function saveAllChats(data) {
  localStorage.setItem(CHAT_KEY, JSON.stringify(data));
}

function getUnread() {
  try { return JSON.parse(localStorage.getItem(UNREAD_KEY)) || {}; }
  catch { return {}; }
}

function saveUnread(data) {
  localStorage.setItem(UNREAD_KEY, JSON.stringify(data));
}

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
 * sender: 'user' | 'admin'
 */
function postMessage(userId, sender, text, extra = {}) {
  const all = getAllChats();
  if (!all[userId]) all[userId] = { userId, messages: [] };
  const msg = {
    id: Date.now() + Math.random(),
    sender,
    text,
    time: new Date().toISOString(),
    ...extra
  };
  all[userId].messages.push(msg);
  all[userId].lastMessage = text;
  all[userId].lastTime = msg.time;
  saveAllChats(all);

  // Mark unread for the other side
  const unread = getUnread();
  const target = sender === 'user' ? 'admin' : 'user_' + userId;
  unread[target] = (unread[target] || 0) + 1;
  saveUnread(unread);

  return msg;
}

function markRead(userId, role) {
  const unread = getUnread();
  const key = role === 'admin' ? 'admin' : 'user_' + userId;
  unread[key] = 0;
  saveUnread(unread);
}

function getUserUnread(userId) {
  const unread = getUnread();
  return unread['user_' + userId] || 0;
}

function getAdminUnread() {
  const unread = getUnread();
  // Sum all users' unread for admin
  return Object.keys(unread)
    .filter(k => k !== 'admin')
    .reduce((s, k) => s + (unread[k] || 0), 0);
}

// ── Formatting ────────────────────────────────

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// ── Seed demo messages if empty ───────────────

function seedDemoIfEmpty(userId, userName) {
  const all = getAllChats();
  if (all[userId] && all[userId].messages.length > 0) return;

  const now = Date.now();
  const msgs = [
    { id: now - 5000, sender: 'user', text: 'Hi! I have a question about my order #ORD-20241015.', time: new Date(now - 3600000 * 2).toISOString() },
    { id: now - 4000, sender: 'admin', text: 'Hello! Sure, how can I help you with that order? 😊', time: new Date(now - 3600000 * 2 + 30000).toISOString() },
    { id: now - 3000, sender: 'user', text: "Can I get an invoice for that order? I need it for reimbursement.", time: new Date(now - 3600000).toISOString() },
    { id: now - 2000, sender: 'admin', text: "Of course! Here's the invoice for your order:", time: new Date(now - 3600000 + 10000).toISOString() },
    {
      id: now - 1000,
      sender: 'admin',
      text: '',
      time: new Date(now - 3600000 + 15000).toISOString(),
      type: 'invoice',
      invoice: {
        id: '#INV-20241015',
        order: '#ORD-20241015',
        item: 'Nike Air Force 1 \'07 White (EU 42)',
        amount: '₱4,995',
        date: 'Oct 15, 2024',
        status: 'Paid'
      }
    }
  ];

  if (!all[userId]) all[userId] = { userId };
  all[userId].messages = msgs;
  all[userId].lastMessage = 'Invoice sent';
  all[userId].lastTime = msgs[msgs.length - 1].time;
  saveAllChats(all);
}

// ── Render a single message bubble ────────────

function renderMessageBubble(msg, currentRole) {
  const isMe = msg.sender === currentRole;
  const meClass = isMe ? 'from-me' : '';
  const initials = isMe ? (currentRole === 'admin' ? 'AD' : 'ME') : (currentRole === 'admin' ? 'U' : 'AD');
  const timeStr = formatTime(msg.time);

  if (msg.type === 'invoice' && msg.invoice) {
    const inv = msg.invoice;
    return `
      <div class="msg-row ${meClass}">
        <div class="msg-avatar-sm">${initials}</div>
        <div class="msg-bubble-wrap">
          <div class="msg-bubble msg-invoice">
            <div class="invoice-tag">📄 Invoice</div>
            <div class="invoice-details">
              <div class="invoice-id">${inv.id}</div>
              <div>Order: ${inv.order}</div>
              <div>Item: ${inv.item}</div>
              <div>Amount: <strong>${inv.amount}</strong></div>
              <div>Date: ${inv.date}</div>
              <div>Status: <strong style="color:var(--green)">${inv.status}</strong></div>
            </div>
          </div>
          <div class="msg-time">${timeStr}</div>
        </div>
      </div>`;
  }

  return `
    <div class="msg-row ${meClass}">
      <div class="msg-avatar-sm">${initials}</div>
      <div class="msg-bubble-wrap">
        <div class="msg-bubble">${escapeHtml(msg.text)}</div>
        <div class="msg-time">${timeStr}</div>
      </div>
    </div>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

// ── Render thread with date dividers ─────────

function renderThread(messages, currentRole, container) {
  if (!messages || messages.length === 0) {
    container.innerHTML = `
      <div class="chat-empty-state" style="min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;">
        <div style="font-size:36px">💬</div>
        <div style="font-size:14px;color:var(--text-light)">No messages yet. Say hello!</div>
      </div>`;
    return;
  }

  let html = '';
  let lastDate = '';
  for (const msg of messages) {
    const d = formatDate(msg.time);
    if (d !== lastDate) {
      html += `<div class="chat-date-divider">${d}</div>`;
      lastDate = d;
    }
    html += renderMessageBubble(msg, currentRole);
  }
  container.innerHTML = html;
  container.scrollTop = container.scrollHeight;
}
