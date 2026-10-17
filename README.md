# 🛒 Daily Needs Store (Flipkart Speed & Apple-Level Polish)

A production-ready, full-stack e-commerce web application inspired by **Flipkart's lightning-fast experience and search architecture**, elevated with a modern, high-end minimalist aesthetic (**Apple meets Blinkit / Zepto**).

---

## 🌟 Highlights & Key Features

### 🛒 Customer Frontend
1. **Header & Navigation**:
   * Brand logo with instant delivery indicators (`⚡ 12-Minute Delivery`).
   * Global interactive Search Bar with instant live autocomplete dropdown, product thumbnails, prices, and direct keyboard navigation.
   * **Customer Authentication Portal**: Sign In & Register modal with demo one-click credentials, user menu dropdown, and profile management.
   * **Delivery Address Management**: Customers can save, edit, and toggle between `Home 🏠`, `Work 🏢`, and `Other 📍` delivery addresses.
   * Live Basket Counter and quick slide-out drawer trigger.
   * Saved Items Wishlist counter.
   * One-click **Admin Portal toggle** with glowing badge.
2. **Category Navigation & Carousel**:
   * Flipkart-style horizontal category strip with custom icons for all **15 pre-seeded categories**.
   * High-impact promotional hero banner carousel with promo vouchers (`DAILY50`, `SUPER100`).
   * Lightning flash deals ticker with real-time countdown timer.
3. **Curated Sections & Product Cards**:
   * *Best Sellers in Your Area*, *Daily Staples (Rice, Atta, Dal)*, *Farm Fresh Dairy & Paneer*, *Fruits & Vegetables*, *Biscuits & Snacks*, *Household Cleaning*, *Pooja Essentials*.
   * Product Cards featuring discount tags (e.g. `25% OFF`), star rating pills, pack sizes/weights, MRP vs selling price, in-card quantity stepper (`- [qty] +`), and wishlist toggles.
4. **Product Listing & Filtering (PLP)**:
   * Multi-facet sidebar filters: 15 Categories, Price Slider (₹30 – ₹1000), Rating filter (4.8★, 4.5★, 4.0★), and In-Stock Only filter.
   * Sort dropdown: Popularity, Price Low to High, Price High to Low, Highest Discount, Customer Rating.
5. **Product Detail Page (PDP)**:
   * High-res image preview with zoom effect, pack size badges, stock availability status, and express delivery ETA promise.
   * Key highlights bullet points, product description, and "Frequently Bought Together" recommendations.
6. **Side Drawer Cart (Blinkit / Zepto Style)**:
   * Itemized basket list with live quantity steppers.
   * Free delivery progress threshold bar ("Add ₹X more for FREE Delivery!").
   * Voucher code application (`DAILY50`, `SUPER100`).
7. **Multi-Step Checkout & WhatsApp Integration**:
   * Step 1: Customer Delivery Address selection with "+ Add New Address" modal.
   * Step 2: Delivery Slot (⚡ Express 12-15 Mins, 🌅 Tomorrow Morning, 🌆 Tomorrow Evening).
   * Step 3: Payment Modes (UPI / QR Code, Credit/Debit Card, Netbanking, Cash/UPI on Delivery).
   * **WhatsApp Order Integration**: Direct checkbox to send formatted order details, items invoice, and delivery OTP to WhatsApp immediately!
8. **Order Confirmation & Live Order Tracking**:
   * Celebration checkmark, Order ID, and Contactless Delivery Handover OTP.
   * Live 4-stage tracking timeline: `Order Placed` ➔ `Packing Items` ➔ `Out for Delivery` ➔ `Delivered`.
   * Simulated delivery partner card with call partner and **WhatsApp receipt** actions.

---

### 🛡️ Defense-Grade Security & Authentication Portal
1. **Dual-Persona Split Layout**:
   * Dedicated Customer Access & Defense-Grade Admin Vault (`/admin`).
2. **Multi-Factor Authentication (2FA)**:
   * Admin console protected by Master 2FA PIN verification (`779900`).
3. **Anti-Bot Security Challenge**:
   * Dynamic mathematical CAPTCHA shield preventing automated scripts.
4. **Brute-Force Rate Limiting**:
   * Max 5 attempts threshold with automated 60-second lockout timer.
5. **Real-time Password Complexity Engine**:
   * Visual strength gauge requiring 8+ chars, numbers, and special symbols.
6. **Forensic Security Audit Ledger**:
   * Live event logging (`FIREWALL_ARMED`, `CUSTOMER_LOGIN_SUCCESS`, `ADMIN_VAULT_AUTHORIZED`, `BRUTE_FORCE_BLOCKED`) with IP and timestamp inspection.

---

### 🚀 Ultra-Premium Apple-Grade Loading Screen
* Ambient obsidian gradient mesh (`#030712`) with floating 3D glass cards (*Daawat Basmati, Amul Milk, Kashmiri Apples, Diya*).
* Live Hyperlocal Radar (*"Bhubaneswar Hub • 12-Min Delivery Active"*).
* Dynamic 4-Step Milestone Checklist (Micro-Hub Connect, 15 Aisle Catalogs, Live Stock, 256-Bit SSL).
* Live Website Open & User Login Counter (*"Visit #X • Loyalty Tier"*).

---

### 💻 Backend REST API Endpoints (`http://localhost:5000`)
* **Auth**:
  * `POST /api/auth/login`: Customer sign in with rate limiter.
  * `POST /api/auth/register`: Customer registration with password complexity check.
  * `POST /api/auth/admin-login`: Admin authentication with 2FA Master PIN.
  * `GET /api/auth/verify-token`: Token validation.
* **Security & Audit**:
  * `GET /api/security/logs`: Forensic security audit logs.
  * `POST /api/security/clear-logs`: Purge security logs.
* **Stats & Tracking**:
  * `GET /api/stats`: Store-wide visit and order metrics.
  * `POST /api/stats/visit`: Increments site open counter.
  * `POST /api/stats/login`: Increments login counter.
* **Products (Full CRUD)**:
  * `GET /api/products`: Filter by category & search query.
  * `POST /api/products`: Add new product to catalog.
  * `PUT /api/products/:id`: Update pricing or stock.
  * `DELETE /api/products/:id`: Remove product.
  * `POST /api/products/reset`: Restore catalog to 15 default categories.
* **Orders**:
  * `GET /api/orders`: List all customer orders.
  * `POST /api/orders`: Create new order.
  * `PUT /api/orders/:id/status`: Update status in real time.
* **Addresses**:
  * `GET /api/addresses`: Retrieve saved customer addresses.
  * `POST /api/addresses`: Save new delivery address.
  * `PUT /api/addresses/:id`: Edit address.
  * `DELETE /api/addresses/:id`: Delete address.
* **Settings**:
  * `GET /api/settings`: Retrieve store config & WhatsApp number.
  * `PUT /api/settings`: Update store config.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server (Vite Frontend)
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 3. Run Backend API Server (Express + Persistent Database)
```bash
npm run server
```
Runs the Express backend on **`http://localhost:5000`**.

---

## 🔑 Login Credentials

### 🛡️ Admin Portal:
* **Email**: `admin@dailyneeds.com`
* **Password**: `admin123`
* **2FA Master Security PIN**: `779900`
*(Click **"1-Click Demo Admin Autofill"** on the login screen for instant access!)*

### 👤 Customer Account:
* **Email**: `abinash@example.com`
* **Password**: `password123`
*(Click **"1-Click Demo Customer Autofill"** on the login screen for instant access!)*
