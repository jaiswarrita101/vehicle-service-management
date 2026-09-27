# Vehicle Service Management System (VSMS)

A complete, modern, and responsive **Vehicle Service Management System** frontend built with **HTML5, CSS3, and Vanilla JavaScript**, backed by a browser **LocalStorage Relational Database Layer**.

---

## 🚀 Quick Run Guide

### Option 1: 1-Click Batch File (Recommended for Windows)
Just double-click **`run.bat`** in this folder:
- It starts the local HTTP server on port 5000.
- It automatically opens your browser at `http://localhost:5000/index.html`.

### Option 2: Command Line (Node.js)
```bash
node server.js
```
Then open: **http://localhost:5000/** in any browser.

### Option 3: Direct Browser Open (Zero Setup)
Simply double-click **`index.html`** in File Explorer to open directly in Google Chrome, MS Edge, or Firefox!

---

## 👥 Demo Logins & Roles

Go to **`http://localhost:5000/login.html`** and click the **1-Click Demo Login** buttons:

| Role | Email | Password | Features |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@vsms.com` | `password123` | Multi-Vehicle Management, Slot Booking, Live Tracking, Reminders, Invoices |
| **Service Advisor** | `advisor@vsms.com` | `password123` | Appointment Intake, Check-in, Job Card Creation, Mechanic Assignment |
| **Technician** | `technician@vsms.com` | `password123` | Workshop Bay Tasks, Fast-Track Speed-Up, Part Consumption, Inspection Notes |
| **Inventory Manager** | `inventory@vsms.com` | `password123` | OEM Spare Parts Master, Live Stock Alerts, Reorder & Restock (+10) |
| **Super Admin** | `admin@vsms.com` | `password123` | Executive KPI Metrics, Canvas Charts (Revenue & Bookings), Global Records |

---

## 🌟 Key Functional Features

1. **9-Stage Real-Time Visual Service Tracker**:
   $$\text{Booked} \rightarrow \text{Vehicle Received} \rightarrow \text{Inspection} \rightarrow \text{Job Card Created} \rightarrow \text{Technician Assigned} \rightarrow \text{In Progress} \rightarrow \text{Quality Check} \rightarrow \text{Ready for Delivery} \rightarrow \text{Completed}$$
2. **Fast-Track & Speed-Up Actions on Job Card**:
   - `⚡ Fast-Forward Next Stage`: Advance repair status in 1 click.
   - `▶️ Auto-Simulate Live`: Automatically step through all stages every 2 seconds for live demonstration.
   - `⚡ + Quick Service Kit`: Install Engine Oil + OEM Filter kit and deduct inventory in 1 second.
   - `🏁 ⚡ Instant Complete & Bill`: Complete work and auto-generate tax invoice.
3. **Multi-Bay Slot Capacity & Re-Booking**:
   - 3 Concurrent Service Bays per hour slot (`3/3 Bays Free`, `2/3 Bays Free`).
   - Re-booking support for full slots.
   - 1-Click `Reset/Free All Slots` button.
4. **Razorpay & Multi-Method Invoicing**:
   - Integrated Razorpay Official Popup Checkout (`rzp_test_...`).
   - UPI QR Code + VPA simulation.
   - Card (Visa/MasterCard/RuPay) & Net Banking simulation.
   - 18% GST itemized breakdown with print-friendly layout.
5. **AI Service Assistant / Chatbot**:
   - Interactive vehicle symptom diagnostic assistant in bottom-right corner.

---

## 📁 File Structure

```
vehicle-service-management/
├── index.html
├── login.html
├── register.html
├── services.html
├── service-details.html
├── booking.html
├── track-service.html
├── customer-dashboard.html
├── advisor-dashboard.html
├── technician-dashboard.html
├── inventory-dashboard.html
├── admin-dashboard.html
├── job-card.html
├── invoice.html
├── run.bat
├── server.js
├── README.md
├── css/
│   ├── style.css
│   ├── dashboard.css
│   └── responsive.css
└── js/
    ├── db.js
    ├── main.js
    ├── auth.js
    ├── booking.js
    ├── services.js
    ├── vehicle.js
    ├── jobcard.js
    ├── inventory.js
    ├── invoice.js
    ├── dashboard.js
    └── chatbot.js
```

---

## 🌐 Free Cloud Deployment Guide

Aap is project ko easily kisi bhi free hosting platform par 2 minute me deploy kar sakte hain:

### 1. Deploy on GitHub Pages (100% Free & Recommended)
1. Apne GitHub account par new repository create karein (e.g. `vehicle-service-management`).
2. Saari files ko push karein:
   ```bash
   git init
   git add .
   git commit -m "Initial VSMS release"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/vehicle-service-management.git
   git push -u origin main
   ```
3. GitHub Repo me **Settings** $\rightarrow$ **Pages** par jayein.
4. **Source** me `Deploy from a branch` select karein aur Branch me **`main` / `root`** choose karke **Save** par click karein.
5. Aapki live website **`https://<YOUR_USERNAME>.github.io/vehicle-service-management/`** par live ho jayegi!

### 2. Deploy on Vercel (1-Click)
1. [vercel.com](https://vercel.com) par login karein.
2. **Add New Project** $\rightarrow$ Import your GitHub repository.
3. Framework Preset: **Other** (Project root directory `./`).
4. Click **Deploy** - Instant live URL generate ho jayega!

### 3. Deploy on Netlify (Drag & Drop or Git)
1. [netlify.com](https://netlify.com) par login karein.
2. Is project ke pure folder ko direct Netlify Dashboard par **Drag and Drop** kar dein, ya GitHub repo connect karein.
3. Website turant live ho jayegi!

