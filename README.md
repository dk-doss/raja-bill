# 🛍️ RAJA STORE — Customer Ordering & Store Management System

A digital ordering and store management system built for **RAJA STORE**, a real neighborhood retail grocery shop.

> **IMPORTANT PRINCIPLE:**
> This is a **SELF-PICKUP ONLY** system. There is **NO home delivery**.
> 
> **Workflow:** Customer orders from home → RAJA STORE prepares & packs items → Customer visits shop → Customer collects order.

---

## 🚀 Quick Start

### Run the Application (Single Command)

```bash
# In the project directory:
npm start
```
The entire application (Express backend + pre-built frontend) will immediately be available at:
👉 **`http://localhost:5000`**

### For Development (with Hot Reload)

```bash
npm run dev
```
* **Frontend Dev Server:** `http://localhost:3000` (auto-proxies `/api` to port 5000)
* **Backend API Server:** `http://localhost:5000`

---

## 📱 App 1: Customer App

The Customer App is clean, modern, and mobile-friendly.

* **Welcome & Hero:** Shows store banner, address, operating hours, and pickup instructions.
* **Product Search:** Real-time search across product names, brands, and categories.
* **Dynamic Categories:** Groceries & Staples, Snacks & Biscuits, Beverages, Household & Cleaning, Personal Care, Dairy & Bread, Stationery & Pooja. (Categories can be added, updated, or removed from the Store App).
* **Product Cards:**
  * High-resolution image (with fallback)
  * Brand badge (e.g. *Aashirvaad, Amul, Surf Excel, Tata*)
  * Product name & Pack size (e.g. *5 kg, 500 ml, 1 L*)
  * Selling price in Indian Rupees (₹)
  * Stock availability indicator
  * `[ + ADD ]` button or `[ - ] qty [ + ]` selector
  * Capped at available stock (prevents over-ordering)
  * **OUT OF STOCK** indicator with disabled button when stock is 0.
* **Slide-Over Shopping Cart:**
  * Product details, pack sizes, unit price, and subtotal calculations
  * Increase/decrease quantities or remove items
  * Explicit reminder: **"Store Pickup Only — No Delivery"**
* **Customer Details (Checkout):**
  * Required: **Customer Name**
  * Required: **10-Digit Mobile Phone Number**
  * Optional: **Order Note** (e.g. *"Please keep ready by 6 PM"*)
  * **No address asked** (pickup only!)
* **Order Placement & Confirmation:**
  * Generates unique order number (e.g. `#1001`, `#1002`, `#1003`)
  * Celebratory chime sound & confetti burst
* **Live 5-Step Order Status Tracker:**
  * `ORDER RECEIVED` — The order has been sent to RAJA STORE.
  * `ACCEPTED` — The shop has accepted the order.
  * `PREPARING` — The shop is preparing the products.
  * `READY FOR COLLECTION` — The order is ready for pickup.
  * `COLLECTED` — The customer has collected the order.
  * (*`CANCELLED`* — with cancellation reason)
  * **Real-time updates via Server-Sent Events (SSE):** When the shopkeeper changes the status in the Store App, the customer's phone updates with celebratory chime and confetti!
  * **Lookup Feature:** Customers can track any previous order using their Order Number or Phone Number.

---

## 🏪 App 2: RAJA STORE — Store App (Owner & Staff)

Used by the shop owner and staff to manage orders, inventory, and store settings.

### Staff Login Credentials
* **Username:** `admin`
* **Password:** `raja123`
*(Includes a "One-Click Fill Demo Credentials" button for instant testing)*

### Features & Capabilities
* **Live Order Dashboard & Stats:**
  * Real-time counters: New Orders, In Preparation, Ready for Pickup, Collected Today, Today's Revenue.
  * **Audio Chime Alert:** Gentle Web Audio tone plays automatically when a new order arrives (with sound toggle).
  * **Order Cards & Workflow Transitions:**
    * Customer Name & Phone Number with **One-Click Direct Call** and **WhatsApp Customer** pre-filled chat link.
    * Itemized list with pack sizes, quantities, and prices.
    * Order Notes highlighted in yellow.
    * Actions:
      * `[ Accept Order ]`
      * `[ Start Preparing ]`
      * `[ Mark Ready for Collection ]`
      * `[ Mark Collected & Paid ]`
      * `[ Cancel Order ]` (restores stock back to inventory!)
    * **Print Packing Slip / Receipt:** Generates a clean printable paper receipt to pack items and staple on the customer's bag.
* **Product Inventory Management:**
  * Add new products with: Name, Brand, Category, Pack Size, Selling Price (₹), Stock count, Image URL or File Upload (with quick preset grocery image selectors), Description.
  * Edit existing products.
  * **Quick Stock Adjuster:** In-table `+` / `-` stock buttons, or one-click "Mark In Stock / Out of Stock".
  * Delete product.
* **Dynamic Category Management:**
  * Add new categories with emoji icons and sort order.
  * Edit and delete categories.
  * Changes reflect immediately on the Customer App.
* **Store Settings:**
  * Store Name (*RAJA STORE*), address, phone, WhatsApp number, operating hours.
  * Store Open / Closed toggle.
  * **"Reset Demo Data"** button to restore sample products and orders anytime.

---

## 🛠️ Technology Stack

* **Frontend:** React 19, Tailwind CSS v4, Lucide Icons, Canvas Confetti, Web Audio API
* **Backend:** Node.js, Express 5, Multer (file uploads), Server-Sent Events (SSE)
* **Storage:** Atomic JSON database (`server/data/store.json`) with sample Indian retail grocery products pre-seeded.

---

## 📝 License
Proprietary software for **RAJA STORE**.
