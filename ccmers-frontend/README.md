# Campus Crisis Management & Emergency Response System (CCMERS)

## Project Overview
CCMERS is a comprehensive, frontend-first web application designed to handle campus emergencies efficiently. It provides dedicated portals for three distinct roles: Students/Faculty (to report and track incidents), Response Teams (to manage and resolve assigned incidents), and Administrators (to oversee the entire system, manage departments, and view analytics). 

The application utilizes a completely dynamic **Global State (React Context)** for seamless real-time data flow across all three portals without relying on any backend database or dummy JSON data.

---

## Tech Stack
- **Frontend Framework**: React 18 with Vite
- **Styling**: Tailwind CSS (Flat, solid design system without glassmorphism)
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)
- **State Management**: React Context API (`IncidentContext`)
- **Data Visualization**: Recharts

---

## 📱 Screens List (17 Total Screens)

### Student & Faculty Portal
1. **Login** (`/student/login`) - Access the student portal.
2. **Dashboard** (`/student/dashboard`) - Overview of recent activity and quick actions.
3. **Report Incident** (`/student/report-incident`) - Form to submit new emergencies/issues.
4. **My Incidents** (`/student/my-incidents`) - List of all incidents reported by the user.
5. **Incident Details** (`/student/incident-details/:id`) - Track live status and resolution remarks.
6. **Profile** (`/student/profile`) - Basic user profile view.

### Response Team Portal
7. **Login** (`/response/login`) - Access the responder portal.
8. **Dashboard** (`/response/dashboard`) - Overview of assigned, in-progress, and resolved incidents.
9. **Assigned Incidents** (`/response/assigned-incidents`) - Data table of all workloads.
10. **Incident Details** (`/response/incident-details/:id`) - Full view of the incident details.
11. **Update Status** (`/response/update-status/:id`) - Stepper to progress status and add resolution remarks.

### Admin Portal
12. **Login** (`/admin/login`) - Access the administrative portal.
13. **Dashboard** (`/admin/dashboard`) - High-level metrics and quick overview of active emergencies.
14. **All Incidents** (`/admin/all-incidents`) - Filterable master list of all incidents in the system.
15. **Incident Details** (`/admin/incident-details/:id`) - Deep dive into any incident.
16. **Assign Incident** (`/admin/assign-incident/:id`) - Route incidents to specific response departments and set severity.
17. **Department Management** (`/admin/department-management`) - Create and manage response teams.
18. **Analytics & Reports** (`/admin/analytics`) - Recharts-powered dashboard for data visualization.

*Note: Plus a global **404 / Access Denied** (`/NotFound`) edge state.*

---

## 📂 Folder Structure
```text
ccmers-frontend/
├── evidence/                  # Execution evidence (Screenshots & PPT Markdown Report)
├── public/                    # Static assets
├── src/
│   ├── components/            # Reusable UI components (Button, Card, Input, Sidebar, Navbar)
│   ├── context/               # Global state management (IncidentContext.jsx)
│   ├── layouts/               # Main layout wrappers (MainLayout.jsx)
│   ├── pages/                 # Role-based pages
│   │   ├── admin/             # 7 Admin Screens
│   │   ├── response/          # 5 Response Team Screens
│   │   ├── student/           # 6 Student Screens
│   │   └── NotFound.jsx       # Fallback 404 Route
│   ├── App.jsx                # Application Router & Context Provider
│   ├── index.css              # Tailwind entry point
│   └── main.jsx               # React entry point
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 How to Run Locally

1. **Install Dependencies**
   Navigate to the project root and install required packages:
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```
   *The application will typically start at `http://localhost:5173`.*

3. **Production Build**
   To create an optimized production build:
   ```bash
   npm run build
   ```
   *The output will be generated in the `/dist` directory.*

---

## 🧪 Testing the Flow (No Dummy Data)
The application starts completely empty to prove the validity of the state management. To test the end-to-end flow:
1. Open **Admin Portal** (`/admin/department-management`) and create a department (e.g., "Campus Security").
2. Open **Student Portal** (`/student/report-incident`) in a new tab and submit a new incident.
3. Switch back to **Admin Portal** (`/admin/dashboard`) to see the new incident appear. Assign it to the department you created.
4. Open **Response Portal** (`/response/assigned-incidents`) to see the assigned incident. Click it to update its status and add remarks.
5. Check the **Student Portal** again to see the live updates reflected instantly.
