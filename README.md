# CampusCash – Student Financial Management System

CampusCash is a student-focused financial management web app for tracking income, expenses, budgets and savings goals. Students can review their recorded finances in a private account and use the browser-based USSD interface preview.

---

## 🎯 Project Vision
Many students receive government or institutional upkeep money at the start of the semester. However, most of it is spent within the first month, leaving students broke for the rest of the semester. CampusCash aims to:
- Track income and expenses manually.
- Help students set realistic financial goals for the semester.
- Compare recorded expenses with category budgets.
- Offer general, rule-based budgeting tips.

---

## ✨ Features
- **Income & Expense Tracking**  
  Students can manually log and manage transactions by type, category, payment method and date.

- **Goal Setting & Monitoring**  
  Students define semester goals (e.g., rent, food, books). The system tracks progress and warns if goals are at risk.

- **Budgets & Goals**
  Set weekly, monthly or all-recorded-history budgets and track savings goals.

- **Budget Guide**
  General, rule-based budgeting tips. It is not a live AI or a substitute for professional financial advice.

- **USSD/SMS Preview**
  A browser-only simulator preview is available; it does not connect to a mobile network or send SMS messages.

- **Reports & Exports**  
  Spending summaries can be exported to Excel/CSV for review or sharing.

## CampusCash web app setup

The public website is `index.html`; student accounts use `register.html` and
`login.html`; the existing student interface is `dashboard.html`.

1. Create a Supabase project and run [`supabase.sql`](./supabase.sql) in its SQL
   Editor.
2. In [`supabase.js`](./supabase.js), set the Supabase project URL and the
   public anon/publishable key. Never use a service-role key in the browser.
3. Add the deployed app URL and its `login.html` path to Supabase's allowed
   redirect URLs for email confirmation and password recovery.
4. Serve the project over HTTP (for example, run `npm run dev`) and open
   `index.html`. Supabase auth and the dashboard do not work from a `file://`
   URL.

Email/password accounts create their profile through a database trigger.
Profiles, transactions, budgets and savings goals are protected with Row Level
Security and loaded from Supabase. The dashboard redirects users without an
active session to login. Financial channels are manual labels only: this project
does not connect to banks, M-Pesa, SMS or a live USSD gateway.

---

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript  
- **Authentication and database:** Supabase Auth and Postgres with Row Level Security
- **Browser client:** Supabase JavaScript client v2 (CDN)

---

## 📂 Project Structure

campuscash/
├── index.html       # Public landing page
├── login.html       # Login and password recovery
├── register.html    # Account registration
├── dashboard.html   # Protected student dashboard
├── style.css        # Shared and responsive styling
├── script.js        # Dashboard interactions
├── dashboard.js     # Dashboard auth guard and Supabase data access
├── auth.js          # Registration, login and password recovery
├── supabase.js      # Public Supabase client configuration
└── supabase.sql     # Tables, profile trigger and RLS policies


---

## Database

The Supabase schema creates `profiles`, `transactions`, `budgets`, and
`savings_goals`. Each table is protected by Row Level Security policies scoped
to the authenticated user's ID. Apply the schema in [`supabase.sql`](./supabase.sql).

---

## 🚀 Roadmap
External bank and mobile-money connections, real SMS/USSD access, and live AI
advice are not implemented. They require separate integrations and should not be
treated as active features.

---

## 🤝 Collaboration Guidelines
- Use clear commit messages (e.g., `Add transaction form`, `Implement low balance alert`).
- Push changes to feature branches before merging into `main`.
- Document any new features in the README or a separate `docs/` file.
- Keep code modular and well-commented for easy collaboration.

---

## 📄 License
This project is licensed under the MIT License.

---

## 📌 Notes
CampusCash is a learning project but designed with real-world application in mind. The goal is to build a system that is **unique, impactful, and inclusive**, while also serving as a strong portfolio piece for both collaborators.
