# P10 – Digital Banking Account & Transaction Management System

**Course:** Advanced JavaScript Backend Frameworks (Node.js & Express JS)  
**Project:** P10 – Digital Banking Account & Transaction Management System  
**Database:** MongoDB + Mongoose  
**Authentication:** JWT + bcrypt  
**API Testing:** Postman

> Replace the team placeholders before submission. Do not commit `.env`.

## 1. Problem Statement

The system provides a simplified core-banking-style backend where customers can register, submit KYC/account applications, manage accounts and beneficiaries, transfer funds, view transaction history/statements, while bank staff approve applications, freeze accounts, monitor flagged transactions and pending approvals.

## 2. Implemented Functional Modules

All 13 modules from the project brief are implemented as working API functionality:

1. Customer Onboarding & KYC Capture
2. Account Approval Workflow
3. Account Management
4. Beneficiary Management
5. Fund Transfer Engine
6. Transaction Ledger
7. Account Statement Generation
8. Minimum Balance & Limits Enforcement
9. Suspicious Transaction Flagging
10. Account Freeze/Unfreeze
11. Interest Calculation Job Logic
12. Staff Monitoring Dashboard
13. Role-Based Access Control

## 3. Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose ODM
- JWT (`jsonwebtoken`)
- bcrypt (`bcryptjs`)
- express-validator
- node-cron
- Postman

## 4. MVC Folder Structure

```text
digital-banking-p10/
├── config/
│   └── db.js
├── controllers/
│   ├── accountController.js
│   ├── authController.js
│   ├── beneficiaryController.js
│   ├── jobController.js
│   ├── staffController.js
│   └── transactionController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── validate.js
├── models/
│   ├── Account.js
│   ├── Approval.js
│   ├── Beneficiary.js
│   ├── Transaction.js
│   └── User.js
├── routes/
│   ├── accountRoutes.js
│   ├── authRoutes.js
│   ├── beneficiaryRoutes.js
│   ├── jobRoutes.js
│   ├── staffRoutes.js
│   └── transactionRoutes.js
├── utils/
├── postman/
├── docs/
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## 5. Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster
- MongoDB database user and password
- Postman

### Installation

```bash
git clone <YOUR_GITHUB_REPOSITORY>
cd digital-banking-p10
npm install
```

Create `.env` from `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/digital_banking
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=1d
SUSPICIOUS_TRANSACTION_THRESHOLD=50000
DAILY_TRANSFER_LIMIT=100000
MIN_SAVINGS_BALANCE=1000
MIN_CURRENT_BALANCE=0
ANNUAL_SAVINGS_INTEREST_RATE=0.03
NODE_ENV=development
```

Start:

```bash
npm run dev
```

or

```bash
npm start
```

Test:

```text
GET http://localhost:5000/api/health
```

## 6. MongoDB Atlas

1. Create a free Atlas cluster.
2. Create a database user.
3. In Network Access, add your current IP address (or `0.0.0.0/0` only for temporary classroom testing).
4. Copy the Node.js connection string into `.env`.
5. Keep `.env` out of GitHub.

The transfer engine uses a MongoDB transaction/session for atomic source/destination balance updates. MongoDB Atlas deployments support transactions; use an Atlas cluster rather than a standalone local MongoDB server for the demo.

## 7. Authentication & Roles

### Customer
- Register/login
- View own accounts
- Manage own beneficiaries
- Transfer/deposit/withdraw
- View own ledger and statement

### Bank Staff
- Approve/reject account applications
- Freeze/unfreeze accounts
- View pending approvals
- View flagged transactions
- View monitoring dashboard
- Run interest job

### Admin
- Same staff management capabilities in this implementation

For protected endpoints:

```text
Authorization: Bearer <JWT_TOKEN>
```

## 8. API Endpoint Reference

| Method | Endpoint | Purpose | Role |
|---|---|---|---|
| POST | `/api/auth/register` | Customer onboarding + pending account | Public |
| POST | `/api/auth/login` | Login and JWT issue | Public |
| GET | `/api/auth/me` | Current user profile | Auth |
| GET | `/api/accounts` | List own accounts | Auth |
| GET | `/api/accounts/:id` | View account | Owner/Staff/Admin |
| PUT | `/api/accounts/:id` | Edit pending account type | Owner |
| PUT | `/api/accounts/:id/approve` | Approve/reject | Staff/Admin |
| PUT | `/api/accounts/:id/freeze` | Freeze account | Staff/Admin |
| PUT | `/api/accounts/:id/unfreeze` | Unfreeze account | Staff/Admin |
| GET | `/api/accounts/:id/statement` | Date-range statement | Owner/Staff/Admin |
| POST | `/api/beneficiaries` | Add trusted beneficiary | Customer |
| GET | `/api/beneficiaries/:accountId` | List beneficiaries | Customer |
| DELETE | `/api/beneficiaries/:id` | Block beneficiary | Customer |
| POST | `/api/transactions/transfer` | Atomic fund transfer | Customer |
| POST | `/api/transactions/deposit` | Demo deposit | Customer |
| POST | `/api/transactions/withdraw` | Demo withdrawal | Customer |
| GET | `/api/transactions/:accountId` | Ledger | Owner/Staff/Admin |
| GET | `/api/staff/pending-approvals` | Pending account applications | Staff/Admin |
| GET | `/api/staff/flagged-transactions` | Suspicious transactions | Staff/Admin |
| GET | `/api/staff/dashboard` | Monitoring dashboard | Staff/Admin |
| POST | `/api/jobs/interest` | Run interest calculation | Staff/Admin |

## 9. Important Business Rules

- New customer accounts begin in `pending` status.
- Staff must approve the account before it becomes `active`.
- Customers cannot access another customer's account.
- Protected endpoints require JWT.
- Staff/Admin routes require role authorization.
- Transfer source and destination must be active.
- External transfers require the destination to be a trusted beneficiary.
- Savings accounts maintain a minimum balance (default 1000).
- Daily transfer limit defaults to 100000.
- Transactions at/above the suspicious threshold (default 50000) are flagged.
- Transfer source debit and destination credit are committed atomically.
- Every money movement writes immutable ledger records.
- Frozen accounts cannot be used for normal transactions.
- Savings interest is calculated as `balance × annualRate / 365`; the job avoids applying interest twice on the same day.

## 10. Centralized Error Response

Validation failure:

```json
{
  "success": false,
  "message": "Request validation failed",
  "errorCode": "VALIDATION_ERROR",
  "details": []
}
```

Business-rule conflict:

```json
{
  "success": false,
  "message": "Daily transfer limit exceeded",
  "errorCode": "DAILY_LIMIT_EXCEEDED"
}
```

## 11. Postman Demonstration Order

1. Register customer.
2. Login customer and copy JWT.
3. Login staff/admin and copy JWT.
4. Staff checks pending approvals.
5. Staff approves account.
6. Customer fetches account.
7. Customer deposits funds for demo setup.
8. Create/verify beneficiary.
9. Transfer funds.
10. Fetch transaction ledger.
11. Generate statement.
12. Trigger a large transaction to show suspicious flagging.
13. Staff checks dashboard and flagged transactions.
14. Staff freezes/unfreezes account.
15. Staff runs interest job for savings accounts.

The supplied `postman/P10_Digital_Banking.postman_collection.json` contains request templates and test variables.

## 12. Database Design

### Collections

**users**
- name
- email
- passwordHash
- role
- kycStatus
- isActive

**accounts**
- userId → users
- accountNumber
- type
- balance
- status
- dailyTransferLimit
- lastInterestDate

**beneficiaries**
- accountId → accounts
- beneficiaryAccountNumber
- nickname
- status

**transactions**
- accountId → accounts
- type
- amount
- balanceAfter
- relatedAccount → accounts
- flagged
- flagReason
- transferReference
- createdAt

**approvals**
- accountId → accounts
- staffId → users
- decision
- remarks
- timestamps

Indexes follow the project brief:
- `users.email`
- `accounts.userId`
- `beneficiaries.accountId`
- `transactions.accountId`
- `approvals.accountId`

Additional indexes are used for unique account numbers, beneficiary uniqueness, and flagged transaction monitoring.

## 13. ER-Style Relationship

```text
USER 1 ─────── N ACCOUNT
USER 1 ─────── N APPROVAL (as staff)
ACCOUNT 1 ─── N BENEFICIARY
ACCOUNT 1 ─── N TRANSACTION
ACCOUNT 1 ─── N APPROVAL
TRANSACTION ──> ACCOUNT (relatedAccount, optional)
```

## 14. Team Details

| S.No | Student Name | Roll No. | Department | Section |
|---|---|---|---|---|
| 1 | `<NAME>` | `<ROLL NO>` | `<DEPARTMENT>` | `<SECTION>` |
| 2 | `<NAME>` | `<ROLL NO>` | `<DEPARTMENT>` | `<SECTION>` |
| 3 | `<NAME>` | `<ROLL NO>` | `<DEPARTMENT>` | `<SECTION>` |
| 4 | `<NAME>` | `<ROLL NO>` | `<DEPARTMENT>` | `<SECTION>` |

**GitHub Repository:** `<PASTE GITHUB LINK HERE>`

## 15. Submission Notes

- Do not upload `.env` or `node_modules`.
- Keep `.env.example`.
- Use meaningful commits from multiple team members.
- Add Postman output screenshots and code/output screenshots to the PDF and PPT.
- The CIA-3 instructions require a minimum 7-page PDF and a 10–15 slide PPT.
## GitHub Repository

https://github.com/Nandhu-2629/P10-Digital-Banking