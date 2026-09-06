# P10 – Digital Banking Account & Transaction Management System

## Project Title & Team Details

**Project:** Digital Banking Account & Transaction Management System  
**Course:** Advanced JavaScript Backend Frameworks – CIA-3  
**Technologies:** Node.js, Express.js, MongoDB Atlas, Mongoose

| S.No | Name | Register No. | Department | Section |
|---:|---|---:|---|:---:|
| 1 | NANDHITHA SRI V | 2462118 | 5BT CS (AIML) | B |
| 2 | NEVITA SHARON Y | 2462121 | 5BT CS (AIML) | B |
| 3 | PAVANA MX | 2462178 | 5BT CS (AIML) | B |
| 4 | PRAJWAL S HANGARAGI | 2462125 | 5BT CS (AIML) | B |

---

## Problem Statement

Traditional banking account and transaction processes require secure customer onboarding, account approval, beneficiary management, fund transfers and transaction tracking. The project addresses these requirements by providing a RESTful backend system for managing digital banking operations with authentication, authorization, validation, transaction controls and MongoDB-based data storage.

---

## Tech Stack Used

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

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Nandhu-2629/P10-Digital-Banking.git
cd P10-Digital-Banking
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root.

Use `.env.example` as the reference and replace the placeholder values with your own MongoDB Atlas connection string and secret values.

Do not commit the `.env` file to GitHub.

### 4. Start the Server

For normal execution:

```bash
npm start
```

For development:

```bash
npm run dev
```

The server runs at:

`http://localhost:5000`

Health check:

`GET /api/health`

### 5. Seed Staff Account

To create the staff account:

```bash
npm run seed:staff
```

The staff credentials are configured through the project environment variables.

---

## List of Implemented Modules

The project implements the following 13 functional modules:

1. **Customer Onboarding & KYC Capture** – Allows new customers to register and stores KYC-related information.
2. **Account Approval Workflow** – New accounts remain pending until reviewed and approved by staff.
3. **Account Management** – Customers can view their accounts, account details and account status.
4. **Beneficiary Management** – Customers can add, view and delete trusted beneficiaries.
5. **Fund Transfer Engine** – Allows customers to transfer funds between eligible accounts.
6. **Transaction Ledger** – Maintains transaction records including transaction type, amount, status and reference.
7. **Account Statement Generation** – Generates account statements for a specified date range.
8. **Minimum Balance & Transfer Limits** – Enforces minimum balance requirements and daily transfer limits.
9. **Suspicious Transaction Flagging** – Transactions above the configured threshold can be flagged for staff monitoring.
10. **Account Freeze/Unfreeze** – Staff can freeze or unfreeze customer accounts.
11. **Interest Calculation Job** – Calculates interest for eligible accounts and prevents repeated daily interest calculation.
12. **Staff Monitoring Dashboard** – Provides staff with information about pending approvals, flagged transactions, frozen accounts and recent activities.
13. **Role-Based Access Control (RBAC)** – Restricts staff and customer operations according to their assigned roles.

---

## API Endpoint Reference

### Authentication

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new customer |
| POST | `/api/auth/login` | Login for customer or staff |
| GET | `/api/auth/me` | Get authenticated user profile |

### Account Management

| Method | Path | Description |
|---|---|---|
| GET | `/api/accounts` | Get customer's accounts |
| GET | `/api/accounts/:id` | Get account details |
| PUT | `/api/accounts/:id/approve` | Approve a pending account |
| PUT | `/api/accounts/:id/freeze` | Freeze an account |
| PUT | `/api/accounts/:id/unfreeze` | Unfreeze an account |
| GET | `/api/accounts/:id/statement` | Generate account statement |

### Beneficiary Management

| Method | Path | Description |
|---|---|---|
| POST | `/api/beneficiaries` | Add a beneficiary |
| GET | `/api/beneficiaries/:accountId` | List beneficiaries |
| DELETE | `/api/beneficiaries/:id` | Delete a beneficiary |

### Transactions

| Method | Path | Description |
|---|---|---|
| POST | `/api/transactions/deposit` | Deposit demo funds |
| POST | `/api/transactions/transfer` | Transfer funds |
| GET | `/api/transactions/:accountId` | View transaction ledger |

### Staff Operations

| Method | Path | Description |
|---|---|---|
| GET | `/api/staff/dashboard` | View staff monitoring dashboard |
| GET | `/api/staff/pending-approvals` | View pending account approvals |
| GET | `/api/staff/flagged-transactions` | View suspicious transactions |

### Background Job

| Method | Path | Description |
|---|---|---|
| POST | `/api/jobs/interest` | Run interest calculation job |

### Postman Collection

The Postman collection containing the API requests and testing scenarios is available in:

`postman/P10_Digital_Banking.postman_collection.json`

The collection demonstrates successful API requests along with validation failure and unauthorized access scenarios.

---

## Database Schema Summary

The application uses MongoDB Atlas with Mongoose.

### User Collection

Stores customer and staff information.

Main fields:

- `name`
- `email`
- `passwordHash`
- `role`
- `kycStatus`
- `isActive`

### Account Collection

Stores customer bank account information.

Main fields:

- `userId`
- `accountNumber`
- `type`
- `balance`
- `status`
- `dailyTransferLimit`
- `lastInterestDate`

### Beneficiary Collection

Stores trusted beneficiaries associated with customer accounts.

Main fields:

- Account reference
- Beneficiary account number
- Beneficiary name

A compound uniqueness rule prevents duplicate beneficiaries for the same account.

### Transaction Collection

Stores the transaction ledger.

Main fields:

- Source account
- Destination account
- Transaction type
- Amount
- Status
- Reference
- Timestamp

Indexes are used for transaction-related queries.

### Approval Collection

Stores account approval workflow information used by staff operations.

### Relationships

```text
User
  |
  └── Account
        |
        ├── Beneficiary
        |
        └── Transaction

Account
  |
  └── Approval
```

---

## Known Limitations

- The project is primarily a backend REST API and does not include a full production banking frontend.
- Deposit functionality is provided as a demo operation for project testing.
- Interest calculation is implemented as a project-level job and can also be triggered manually by authorized staff.
- The system is intended for academic demonstration and is not a production-ready banking platform.

---

