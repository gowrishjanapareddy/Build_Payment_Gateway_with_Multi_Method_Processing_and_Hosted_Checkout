# Payment Gateway: Multi-Method Processing & Hosted Checkout

## Project Overview
This project is a fully containerized, production-ready payment gateway implementation. It features:
- Automated merchant onboarding system  
- Real-time analytics dashboard  
- Secure hosted checkout supporting **UPI** and **Card** payments with industry-standard validation logic  

---

## System Architecture
The application follows a **microservices architecture** to ensure modularity and scalability.

### Services
- **API Service (Port 8000)**  
  Node.js + Express backend managing the payment state machine and validation logic.

- **Merchant Dashboard (Port 3000)**  
  React-based frontend for tracking transactions and managing API credentials.

- **Hosted Checkout (Port 3001)**  
  Consumer-facing portal for secure payment processing via UPI and Card.

- **Database (Port 5432)**  
  PostgreSQL instance for persistent storage of merchant, order, and transaction data.

---

## API Documentation
All administrative and payment endpoints require authentication using the following headers:

```
X-Api-Key
X-Api-Secret
```

### 1. Health Check
**GET /health**

Returns system connectivity and database status.

---

### 2. Test Merchant (Evaluation Seed)
**GET /api/v1/test/merchant**

Returns auto-seeded merchant credentials used for automated evaluation.

---

### 3. Create Order
**POST /api/v1/orders**

**Request Body**
```json
{
  "amount": 50000,
  "currency": "INR"
}
```

**Response**
```json
{
  "id": "order_GRTU9qkdaQPHpoHN",
  "status": "created"
}
```

---

### 4. Create Payment
**POST /api/v1/payments**

**Card Payment**
```json
{
  "order_id": "...",
  "method": "card",
  "card_number": "4111..."
}
```

**UPI Payment**
```json
{
  "order_id": "...",
  "method": "upi",
  "vpa": "user@bank"
}
```

---

## Database Schema
The database consists of three core tables managing the payment lifecycle:

### Merchants
- Stores unique merchant identifiers
- API credentials

### Orders
- Requested amount
- Currency
- Linked merchant ID

### Payments
- Transaction attempts
- Payment methods
- Final payment statuses

---

## Validation Logic

### UPI
- Regex-based validation for Virtual Payment Address (VPA)

### Cards
- **Luhn Algorithm** for checksum validation  
- **Network Detection**
  - Visa: Starts with `4`
  - Mastercard: Starts with `5`
- **Expiry Date Validation** to ensure the card is not expired

---

## Setup Instructions

### Prerequisites
- Docker
- Docker Compose

### Start Services
Run the following command from the project root directory:

```bash
docker-compose up -d --build
```

### Access Applications
- **Merchant Dashboard:** http://localhost:3000  
- **Hosted Checkout:** http://localhost:3001  
- **API Backend:** http://localhost:8000/health

---
