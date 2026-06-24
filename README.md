# 🛍️ AuringPh — E-Commerce Web Application

> *"Dress the way you want to be seen."*

A frontend e-commerce web application for online clothing and footwear shopping — built with vanilla HTML, CSS, and JavaScript.

---

## 👥 Developers

| Name | Role |
|------|------|
| Baldoza, Anthony F. | Developer |
| Nidea, Aron L. | Developer |

**Course:** COMP 013 — Human Computer Interaction
**School:** Polytechnic University of the Philippines — Calauan, Laguna Campus
**Section:** BSIT 2-1
**Instructor:** Reynan Ragmac Baclle, LPT

---

## 📌 About the Project

**AuringPh** was developed to address the limitations of Facebook Live selling, where products are showcased in real time but customers may miss out due to scheduling conflicts, unstable internet, or the fast pace of live broadcasts.

AuringPh provides a structured, web-based platform where:
- 🕒 Products are available for browsing **anytime** — no need to attend a live session
- 📦 Customers can **track orders** and **message the admin** directly
- 🖥️ Admin can **manage products, orders, and users** through a single dashboard

---

## ✨ Features

### 👤 User Features
- ✅ Sign up, log in, OTP verification, and password recovery
- 🛍️ Browse products by category — Shirts, Pants, Shoes, Others
- ❤️ Add and manage favorite products
- 🛒 Shopping cart with quantity controls and checkout
- 📦 Place orders and view full order history
- 💬 Direct messaging with admin (with invoice card support)
- 🔔 Notifications for orders and system updates
- 👤 View and edit personal profile

### 🔧 Admin Features
- 📊 Dashboard overview — total products, orders, users, revenue
- 📦 Manage all customer orders (view, update status, cancel)
- 👥 Manage registered user accounts (block/unblock/delete)
- 💬 View and respond to customer messages
- ➕ Add, edit, and delete products across all categories (price, stock, brand)

---

## 🛠️ Tech Stack

| Technology | Usage |
|-----------|-------|
| HTML5 | Page structure and content |
| CSS3 | Styling, layout, and responsive design |
| JavaScript (Vanilla) | App logic, DOM manipulation, event handling |
| Browser localStorage | Client-side data persistence |

---

## 📁 Project Structure

```
AURINGPH/
├── index.html                  # Login page
├── login.html
├── signup.html
├── otp.html
├── forgot-password.html
├── pages/
│   ├── home.html               # Main landing page
│   ├── shirts.html             # Shirts category
│   ├── shoes.html              # Shoes category
│   ├── pants.html              # Pants category
│   ├── others.html             # Accessories category
│   ├── cart.html               # Shopping cart
│   ├── favorites.html          # Saved favorites
│   ├── orders.html             # Order history
│   ├── messages.html           # User-admin messaging
│   ├── profile.html            # User profile
│   ├── notifications.html      # Notifications
│   ├── dashboard.html          # Admin dashboard
│   ├── products.html           # Admin product management
│   ├── admin-orders.html       # Admin order management
│   ├── admin-messages.html     # Admin messaging
│   └── users.html              # Admin user management
├── css/
│   ├── style.css
│   ├── auth.css
│   ├── home.css
│   ├── cart.css
│   ├── favorites.css
│   ├── orders.css
│   ├── messaging.css
│   ├── profile.css
│   ├── admin.css
│   ├── category.css
│   └── notifications.css
├── js/
│   ├── script.js
│   ├── auth.js
│   ├── messaging.js
│   ├── profile.js
│   └── admin.js
└── images/
    ├── logo.png
    ├── category-*.jpg
    └── products/
        ├── shirts/
        ├── shoes/
        ├── pants/
        └── others/
```

---

## 🚀 How to Run

1. **Clone the repository:**
```bash
git clone https://github.com/AnthonyBaldoza/AuringPh_E-Commnerce_Web_Application.git
```

2. **Open the project folder:**
```bash
cd AuringPh_E-Commnerce_Web_Application
```

3. **Open `index.html` in your browser** — no server setup needed!

> ⚠️ Since the app uses `localStorage`, data is stored per browser only. Clearing browser data will reset all stored information.

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| Login / Signup | User authentication with OTP verification |
| Home | Product categories and featured items |
| Shirts / Shoes / Pants / Others | Category browsing with brand and size filters |
| Cart | Manage items before checkout |
| Favorites | Saved products for later |
| Orders | Order history and tracking |
| Messages | Direct chat with admin + invoice cards |
| Profile | Personal account management |
| Admin Dashboard | Overview of orders, users, revenue |
| Manage Products | Add, edit, delete products |
| Admin Orders | View and update all customer orders |
| Admin Messages | Respond to customer inquiries |
| Users Management | Block, unblock, delete accounts |

---

## ⚠️ Limitations

- Data is stored in `localStorage` only — not shared across devices or browsers
- No real backend or database (academic prototype)
- No real payment processing

---

## 🔮 Future Improvements

- Integrate a real backend (Node.js, PHP, or similar)
- Add a real database (MySQL, MongoDB)
- Implement actual payment gateway (GCash, Maya, Card)
- Mobile responsive improvements
- Deploy to a live server via GitHub Pages or Netlify

---

## 📄 License

This project was developed as an academic requirement for **COMP 013 — Human Computer Interaction** at **PUP Calauan, Laguna Campus**.
