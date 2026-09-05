# P10 – Digital Banking Account & Transaction Management System

## CIA-3 Project

A Digital Banking Account & Transaction Management System developed using
Node.js, Express.js, MongoDB Atlas and Mongoose.

The system provides customer onboarding, account management, beneficiary
management, fund transfers, transaction history, account statements and
staff monitoring features.

---

## Team Details

| S.No | Name | Register No. | Department | Section |
|---:|---|---:|---|:---:|
| 1 | NANDHITHA SRI V | 2462118 | 5BT CS (AIML) | B |
| 2 | NEVITA SHARON Y | 2462121 | 5BT CS (AIML) | B |
| 3 | PAVANA MX | 2462178 | 5BT CS (AIML) | B |
| 4 | PRAJWAL S HANGARAGI | 2462125 | 5BT CS (AIML) | B |

---

## Team Member Contributions

| Team Member | Register No. | Contribution |
|---|---:|---|
| NANDHITHA SRI V | 2462118 | Backend development, project integration, GitHub management and documentation. |
| NEVITA SHARON Y | 2462121 | API development, Postman testing and project documentation. |
| PAVANA MX | 2462178 | Backend development, testing and PPT preparation. |
| PRAJWAL S HANGARAGI | 2462125 | Project testing, report preparation and documentation support. |

---

---

## Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt
- express-validator
- Postman
- GitHub

---

## Functional Modules

The project implements 13 functional modules:

1. Customer Onboarding & KYC Capture
2. Account Approval Workflow
3. Account Management
4. Beneficiary Management
5. Fund Transfer Engine
6. Transaction Ledger
7. Account Statement Generation
8. Minimum Balance & Transfer Limits
9. Suspicious Transaction Flagging
10. Account Freeze/Unfreeze
11. Interest Calculation Job
12. Staff Monitoring Dashboard
13. Role-Based Access Control (RBAC)

---

## Project Architecture

The project follows an MVC-style backend architecture.

```text
Postman / Client
       |
       v
Express Routes
       |
       v
Validation Middleware
       |
       v
JWT Authentication / RBAC
       |
       v
Controllers
       |
       v
Mongoose Models
       |
       v
MongoDB Atlas
