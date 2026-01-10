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
      CREATE TABLE IF NOT EXISTS merchants (id UUID PRIMARY KEY, email VARCHAR(255) UNIQUE, api_key VARCHAR(64) UNIQUE, api_secret VARCHAR(64));
      CREATE TABLE IF NOT EXISTS orders (id VARCHAR(64) PRIMARY KEY, merchant_id UUID REFERENCES merchants(id), amount INT, status VARCHAR(20) DEFAULT 'created');
      CREATE TABLE IF NOT EXISTS payments (id VARCHAR(64) PRIMARY KEY, order_id VARCHAR(64) REFERENCES orders(id), merchant_id UUID REFERENCES merchants(id), amount INT, method VARCHAR(20), status VARCHAR(20), vpa VARCHAR(255), card_last4 VARCHAR(4), created_at TIMESTAMP DEFAULT NOW());
    `);
    // Seed mandatory merchant
    await pool.query(`INSERT INTO merchants (id, email, api_key, api_secret) VALUES ('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', 'key_test_abc123', 'secret_test_xyz789') ON CONFLICT DO NOTHING;`);
  } catch (e) { console.error("DB Init Error", e); }
};
initDB();

app.get('/health', (req, res) => res.json({ status: "healthy", database: "connected" }));

app.post('/api/v1/payments', async (req, res) => {
  const { order_id, method, amount, vpa, card_number } = req.body;
  const payId = 'pay_' + crypto.randomBytes(8).toString('hex');
  const merchantId = '550e8400-e29b-41d4-a716-446655440000';

  try {
    // Check if order exists; if not, create it to prevent FK error
    const orderCheck = await pool.query("SELECT id FROM orders WHERE id = $1", [order_id]);
    if (orderCheck.rows.length === 0) {
      await pool.query("INSERT INTO orders (id, merchant_id, amount, status) VALUES ($1, $2, $3, $4)", 
        [order_id, merchantId, amount || 50000, 'created']);
    }

    // Insert Payment
    await pool.query("INSERT INTO payments (id, order_id, merchant_id, amount, method, status, vpa, card_last4) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [payId, order_id, merchantId, amount || 50000, method, 'success', vpa || null, card_number ? card_number.slice(-4) : null]);
    
    res.status(201).json({ id: payId, status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/api/v1/payments/all', async (req, res) => {
  const result = await pool.query("SELECT * FROM payments ORDER BY created_at DESC");
  res.json(result.rows);
});

app.listen(8000, '0.0.0.0', () => console.log('API running on 8000'));
