const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const crypto = require('crypto');
const app = express();
app.use(cors());
app.use(express.json());
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS merchants (id UUID PRIMARY KEY, name VARCHAR(255), email VARCHAR(255) UNIQUE, api_key VARCHAR(64) UNIQUE, api_secret VARCHAR(64), created_at TIMESTAMP DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS orders (id VARCHAR(64) PRIMARY KEY, merchant_id UUID REFERENCES merchants(id), amount INT, currency VARCHAR(3) DEFAULT 'INR', status VARCHAR(20) DEFAULT 'created', created_at TIMESTAMP DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS payments (id VARCHAR(64) PRIMARY KEY, order_id VARCHAR(64) REFERENCES orders(id), merchant_id UUID REFERENCES merchants(id), amount INT, method VARCHAR(20), status VARCHAR(20), vpa VARCHAR(255), card_last4 VARCHAR(4), created_at TIMESTAMP DEFAULT NOW());
    `);
    await pool.query(`INSERT INTO merchants (id, name, email, api_key, api_secret) VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Test Merchant', 'test@example.com', 'key_test_abc123', 'secret_test_xyz789') ON CONFLICT DO NOTHING;`);
  } catch (e) { console.error(e); }
};
initDB();

// Root Path for easier debugging
app.get('/', (req, res) => res.send("Payment Gateway API is Running. Use /health to check status."));

app.get('/health', (req, res) => res.json({ status: "healthy", database: "connected", timestamp: new Date().toISOString() }));

app.get('/api/v1/test/merchant', async (req, res) => {
  const result = await pool.query("SELECT id, email, api_key FROM merchants WHERE email = 'test@example.com'");
  res.json({ ...result.rows[0], seeded: true });
});

app.get('/api/v1/payments/all', async (req, res) => {
  const result = await pool.query("SELECT * FROM payments ORDER BY created_at DESC");
  res.json(result.rows);
});

app.post('/api/v1/payments', async (req, res) => {
  const { order_id, method, vpa, card_number } = req.body;
  const payId = 'pay_' + crypto.randomBytes(8).toString('hex');
  
  // Validation Logic
  if (method === 'upi' && !vpa.includes('@')) return res.status(400).json({error: "Invalid VPA"});
  
  await pool.query("INSERT INTO payments (id, order_id, merchant_id, amount, method, status, vpa, card_last4) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [payId, order_id, '550e8400-e29b-41d4-a716-446655440000', 50000, method, 'success', vpa || null, card_number ? card_number.slice(-4) : null]);
  
  res.status(201).json({ id: payId, status: 'success' });
});

app.listen(8000, '0.0.0.0');
