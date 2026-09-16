# Lala NRI Realty — Step-by-Step Setup & Running Guide

Welcome to **Lala NRI Realty** — a full-stack real-estate and property management platform built for NRIs and platform administrators using **Next.js 16 App Router**, **Neon Postgres**, **Drizzle ORM**, and **Better Auth**.

---

## 📋 Prerequisites

Before running the project, make sure you have installed:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**

---

## 🚀 Step-by-Step Execution Guide

### Step 1: Navigate to the Project Directory
Open your terminal (PowerShell, Command Prompt, or Bash) and navigate to the project directory:

```bash
cd d:\project_real_estate
```

---

### Step 2: Install Project Dependencies
Install all required Node.js packages:

```bash
npm install
```

---

### Step 3: Set Up Environment Variables
Ensure `.env.local` exists in the root directory `d:\project_real_estate\.env.local` with your Neon Postgres database connection URL:

```env
# ── Neon Postgres Database Connection ──────────────────────────────────────
DATABASE_URL=postgresql://neondb_owner:npg_OA7WKP1BIXYc@ep-fragrant-sound-aev5sotg-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# ── Application URL ───────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ── Admin Email & Gmail SMTP (Optional for Live Emails) ───────────────────
ADMIN_EMAIL=admin@lalanri.com
# GMAIL_USER=notifications@yourdomain.com
# GMAIL_APP_PASSWORD=your-google-app-password
```

*(Note: If Gmail SMTP variables are left blank, the application automatically uses development fallback logging for OTPs and notifications).*

---

### Step 4: Push Database Schema to Neon Postgres
Apply all Drizzle & Better Auth tables to your Neon Postgres database:

```bash
npm run db:push
```

---

### Step 5: Seed Database with Initial Data
Populate the database with demo property owners, admin account, 6 properties, and sample enquiries:

```bash
npm run db:seed
```

---

### Step 6: Start the Next.js Development Server
Launch the application:

```bash
npm run dev
```

The server will start at: **`http://localhost:3000`**

---

## 🔑 Demo Login Credentials

You can test the application using the pre-seeded accounts below:

| Role | Email | Password | Scope & Pages |
| :--- | :--- | :--- | :--- |
| **Platform Admin** | `admin@lalanri.com` | `Admin@Lala2025!` | Full Admin Desk (`/admin`), approve/reject listings, handle enquiries, owner list |
| **Property Owner** | `rajesh.sharma@nri.com` | `Owner@Lala2025!` | Owner Dashboard (`/dashboard`), submit properties, view physical inspection logs & tenant details |

---

## 🧪 Running Automated Test Suites

You can run automated end-to-end tests at any time to verify application features:

### 1. Run Complete Application Test Suite (24 Features)
Tests database tables, public visitor pages, security proxies, enquiry submission, authentication, and admin workflows:

```bash
npx tsx src/lib/test-runner.ts
```

### 2. Run Web-Based Authentication Test
Tests browser cookie attachment and redirection to `/dashboard` & `/admin`:

```bash
npx tsx src/lib/test-web-auth.ts
```

### 3. Run TypeScript Type Checker
Verifies zero TypeScript errors across the codebase:

```bash
npx tsc --noEmit
```

---

## 🗺️ Application Route Map

### 🌐 Visitor Routes (Public)
- `http://localhost:3000/` — Homepage & Services Overview
- `http://localhost:3000/buy` — Buy / For Sale Property Listings
- `http://localhost:3000/buy/[id]` — Property Details & Price Enquiry Form (Owner contact hidden)
- `http://localhost:3000/rent` — Rent / For Lease Listings
- `http://localhost:3000/rent/[id]` — Rental Details & Enquiry Form
- `http://localhost:3000/manage` — NRI Property Management Services
- `http://localhost:3000/sell` — Onboard Property / Valuation Request
- `http://localhost:3000/contact` — Contact Desk
- `http://localhost:3000/about` — About Lala NRI Realty
- `http://localhost:3000/login` — Sign In Page
- `http://localhost:3000/signup` — Owner Registration Page

### 🏡 Owner Dashboard (Protected)
- `http://localhost:3000/dashboard` — Owner Properties Overview & Maintenance Timeline
- `http://localhost:3000/dashboard/properties/new` — Submit New Property Form
- `http://localhost:3000/dashboard/properties/[id]` — Property Inspections & Tenant Details

### 🛡️ Admin Portal (Protected)
- `http://localhost:3000/admin` — Admin Overview & Pending Approvals
- `http://localhost:3000/admin/properties` — Approve / Reject / Manage Listings
- `http://localhost:3000/admin/enquiries` — Confidential Enquiry Desk & Contact Logs
- `http://localhost:3000/admin/owners` — Registered Property Owners List
- `http://localhost:3000/admin/content` — Content Management Desk
