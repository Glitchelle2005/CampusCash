# CampusCash – Student Financial Management System

CampusCash is a student-focused financial management system designed to solve a real and common problem: upkeep money running out before the semester ends. The system helps students plan, track, and manage their finances responsibly, while also providing alerts, advice, and alternative income opportunities. It is built to be accessible both online (web dashboard) and offline (USSD/SMS codes), ensuring inclusivity for all students.

---

## 🎯 Project Vision
Many students receive government or institutional upkeep money at the start of the semester. However, most of it is spent within the first month, leaving students broke for the rest of the semester. CampusCash aims to:
- Track income and expenses automatically or manually.
- Help students set realistic financial goals for the semester.
- Provide alerts when funds are running low.
- Offer budgeting advice and recommend alternative sources of income.
- Ensure accessibility even for students without internet via USSD/SMS.

---

## ✨ Features
- **Income & Expense Tracking**  
  Students can log transactions manually or integrate with mobile money (M-Pesa, Airtel) and bank accounts.

- **Goal Setting & Monitoring**  
  Students define semester goals (e.g., rent, food, books). The system tracks progress and warns if goals are at risk.

- **Alerts & Notifications**  
  SMS/email/USSD alerts when balance drops below a threshold or when spending is too fast.

- **Advice Engine**  
  - Rule-based suggestions: “You’ve spent 70% of your upkeep in 3 weeks — slow down.”  
  - Future AI integration: personalized financial queries, investment tips, and side-hustle/job suggestions.

- **USSD/SMS Access**  
  Students without internet can dial a code (e.g., *166#) to check balance, view goals, or add expenses.

- **Reports & Exports**  
  Spending summaries can be exported to Excel/CSV for review or sharing.

---

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** JavaScript (Node.js planned)  
- **Database:** SQL (MySQL/PostgreSQL)  
- **Integration:** USSD/SMS APIs, Mobile Money APIs (M-Pesa Daraja, Airtel)  
- **Optional:** AI chatbot for financial queries  

---

## 📂 Project Structure

campuscash/
│
├── frontend/
│   ├── index.html        # Main dashboard
│   ├── style.css         # Styling and responsiveness
│   └── script.js         # Frontend logic
│
├── backend/
│   ├── server.js         # Node.js backend routes
│   ├── db.js             # Database connection
│   └── schema.sql        # Database schema
│
├── docs/
│   └── README.md         # Project documentation
│
├── .gitignore
├── package.json
└── LICENSE


---

## 🗄️ Database Schema (Draft)
**Users Table**
- `id` (PK)  
- `name`  
- `email`  
- `phone`  
- `password`  

**Transactions Table**
- `id` (PK)  
- `user_id` (FK)  
- `amount`  
- `type` (income/expense)  
- `category` (food, rent, books, etc.)  
- `date`  

**Goals Table**
- `id` (PK)  
- `user_id` (FK)  
- `goal_name`  
- `target_amount`  
- `deadline`  
- `progress`  

**Alerts Table**
- `id` (PK)  
- `user_id` (FK)  
- `alert_type` (low balance, overspending)  
- `message`  
- `date`  

---

## 🚀 Roadmap
1. **Phase 1 – Foundations**  
   - Database schema setup  
   - Backend CRUD operations  

2. **Phase 2 – Frontend Dashboard**  
   - Student login & dashboard  
   - Forms for transactions and goals  

3. **Phase 3 – Alerts & Advice**  
   - Low balance alerts  
   - Rule-based advice engine  

4. **Phase 4 – USSD/SMS Integration**  
   - Menu for balance, goals, expenses  
   - SMS notifications  

5. **Phase 5 – Extra Features**  
   - AI chatbot for financial queries  
   - Job suggestions for students  
   - Export reports to Excel/CSV  

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
