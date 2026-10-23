# AuringPH — E-Commerce Web Application

> “Dress the way you want to be seen.”

AuringPH is a frontend e-commerce web application designed for browsing, selecting, and ordering clothing and footwear products. The project simulates a modern online fashion store with user authentication, product browsing, cart management, order tracking, and administrative controls.

This project was built as a frontend prototype for an academic course and focuses on user experience, interaction flow, and a complete storefront interface using plain HTML, CSS, and JavaScript.

---

## Developers

| Name | Role |
|------|------|
| Baldoza, Anthony F. | Developer |
| Nidea, Aron L. | Developer |

- Course: COMP 013 — Human Computer Interaction
- School: Polytechnic University of the Philippines — Calauan, Laguna Campus
- Section: BSIT 2-1
- Instructor: Reynan Ragmac Baclle, LPT

---

## About the Project

AuringPH was created to address the challenges of live selling through Facebook, where customers may miss product announcements due to timing conflicts, internet instability, or the fast pace of live broadcasts.

The application provides a structured web-based shopping experience where users can:

- browse products anytime without attending a live session
- view product categories and details in a clean storefront layout
- add favorites and manage a shopping cart
- place and track orders
- communicate with admin through a message system
- manage account information and notifications

Admins can also use the system to:

- monitor the overall store activity from a dashboard
- manage customers, products, and orders
- respond to customer messages
- update product catalog information and stock

---

## Features

### User Features

- sign up, login, OTP verification, and password recovery
- browse products by category: Shirts, Pants, Shoes, and Others
- filter and view product listings
- add products to favorites and cart
- update cart quantities and checkout items
- view order history and order status
- receive notifications and account updates
- send messages to the admin
- edit profile details

### Admin Features

- dashboard summary for products, orders, users, and revenue
- manage customer orders and status updates
- manage registered users
- view and reply to customer messages
- add, update, and delete products
- manage product details such as price, stock, and brand

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| HTML5 | Structure and UI layout |
| CSS3 | Styling, responsiveness, and visual design |
| JavaScript (Vanilla) | Interactions, state changes, and client-side logic |
| localStorage | Browser-side persistence for demo data |

---

## Project Structure

```text
AURINGPH/
├── README.md
├── index.html                    # Login page
├── login.html                    # Sign-in page
├── signup.html                   # Registration page
├── otp.html                      # OTP verification
├── forgot-password.html          # Password recovery page
├── reset-password.html          # Password reset page
├── pages/
│   ├── home.html                 # Main storefront/homepage
│   ├── shirts.html               # Shirt catalog
│   ├── pants.html                # Pant catalog
│   ├── shoes.html                # Shoe catalog
│   ├── others.html               # Other categories/accessories
│   ├── cart.html                 # Shopping cart
│   ├── favorites.html            # Saved items
│   ├── orders.html               # Customer order history
│   ├── messages.html             # User messaging
│   ├── notifications.html       # Notifications
│   ├── profile.html              # User profile management
│   ├── dashboard.html            # Admin dashboard
│   ├── products.html             # Product management
│   ├── admin-orders.html         # Admin order management
│   ├── admin-messages.html       # Admin messaging
│   ├── users.html                # User management
│   └── admin-login.html          # Admin login page
├── css/
│   ├── admin-login.css
│   ├── admin.css
│   ├── auth.css
│   ├── cart.css
│   ├── category.css
│   ├── favorites.css
│   ├── home-pro.css
│   ├── home.css
│   ├── messaging.css
│   ├── notifications.css
│   ├── orders.css
│   ├── profile.css
│   ├── shop.css
│   ├── style.css
│   └── ...
├── js/
│   ├── admin.js
│   ├── auth.js
│   ├── messaging.js
│   ├── profile.js
│   ├── script.js
│   ├── shop.js
│   ├── smoke_test.js
│   └── ...
├── images/
│   ├── logo.png
│   ├── category-others.jpg
│   ├── category-pants.jpg
│   ├── category-shirts.jpg
│   ├── category-shoes.jpg
│   └── products/
│       ├── shirts/
│       ├── pants/
│       ├── shoes/
│       └── others/
└── ...
```

---

## How to Run

### Option 1: Open directly in a browser

1. Clone the repository:

```bash
git clone https://github.com/AnthonyBaldoza/AuringPh_E-Commnerce_Web_Application.git
```

2. Navigate to the project folder:

```bash
cd AuringPh_E-Commnerce_Web_Application
```

3. Open `index.html` in your preferred browser.

### Option 2: Start a simple local server

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

> Note: Since the app uses `localStorage`, the data is stored in the browser only. Clearing browser storage or using a different browser will reset the demo data.

---

## Limitations

- This is a frontend-only prototype, not a full-stack application.
- Data is stored locally in the browser (`localStorage`) rather than a real database.
- No real payment gateway, backend API, or live authentication system is implemented.
- The project is intended for academic demonstration and prototype testing.

---

## Future Improvements

- integrate a real backend (Node.js, PHP, or similar)
- connect to a database such as MySQL or MongoDB
- add secure authentication and authorization
- implement online payment processing
- deploy the site to a hosting platform
- improve admin analytics and reporting
- make the experience more mobile and accessibility-friendly

---

## License

This project was developed as an academic requirement for COMP 013 — Human Computer Interaction at the Polytechnic University of the Philippines, Calauan Laguna Campus.
