# Customer Complaints & Feedback Management System

This project implements a **Customer Complaints & Feedback Management Module** for NITF.  
It empowers customers to raise service-related complaints and provide structured feedback while enabling management to monitor service quality, track resolution, and analyze satisfaction trends across branches.

---

## 🚀 Features

- **Submission & Categorization**  
  - Customers can submit complaints/feedback.  
  - Categories include:  
    - Delay  
    - Officer Behavior  
    - Technical Issue  
    - Other  

- **Website Integration**
  - feedback complaint submission form
  - complaint submission form.  
  - Each complaint is tracked with a **unique reference ID**.  

- **Complaint Assignment & Resolution**  
  - Complaints are routed to relevant departments/officers.  
  - Admins can update status: `Pending`, `Resolved`, `Escalated`.
  - Admins can reply to feedback.

- **Manager Response**  
  - Resolution notes logged in the system.  

- **Analytics Dashboard**  
  - Visual insights into complaint trends, satisfaction levels, and branch-wise performance.  

---

### Non-Functional Requirements
- **Performance**  
  - Complaint acknowledgment within **3–5 seconds**.  
  - Dashboards load within **2 seconds**.  

- **Auditability**  
  - Every status change is timestamped and logged.  
  - Logs retained for **at least 1 year**.  

- **Integration**  
  - Linked with user profiles for complaint history.  

- **Accessibility**  
  - Forms compatible with screen readers.  
  - Full keyboard navigation supported.  

---

### Technical Requirements
- **Dynamic Form Builder** for multiple complaint/feedback types.  
- **Database Logging**: Timestamps, user IDs, categories, resolution history.  
- **Analytics Engine**: Filters (branch, date, category), exportable reports.  

---

## 🛠️ Tech Stack
- **Frontend:** React / HTML / CSS / Tailwind
- **Backend:** Node.js / Express  
- **Database:** MongoDB  
- **Notifications:** Twilio / SendGrid / SMTP  
- **Analytics:** Chart.js / Recharts / D3.js  

---

## 📂 Project Structure
