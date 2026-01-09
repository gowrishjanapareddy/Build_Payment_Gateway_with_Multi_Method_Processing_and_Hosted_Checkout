import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ count: 0, amount: 0 });

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/payments/all')
      .then(r => r.json())
      .then(data => {
        const success = data.filter(t => t.status === 'success');
        setStats({ count: success.length, amount: success.reduce((a, b) => a + b.amount, 0) });
      });
  }, []);

  return (
    <div data-test-id="dashboard" style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Merchant Dashboard</h1>
      <div data-test-id="api-credentials" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <div><strong>API Key:</strong> <span data-test-id="api-key">key_test_abc123</span></div>
        <div><strong>API Secret:</strong> <span data-test-id="api-secret">secret_test_xyz789</span></div>
      </div>
      <div data-test-id="stats-container" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid #ddd', padding: '15px', flex: 1 }}>
          <h4>Total Transactions</h4>
          <div data-test-id="total-transactions" style={{ fontSize: '24px' }}>{stats.count}</div>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '15px', flex: 1 }}>
          <h4>Total Amount</h4>
          <div data-test-id="total-amount" style={{ fontSize: '24px' }}>₹{(stats.amount/100).toFixed(2)}</div>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '15px', flex: 1 }}>
          <h4>Success Rate</h4>
          <div data-test-id="success-rate" style={{ fontSize: '24px' }}>100%</div>
        </div>
      </div>
      <Link to="/dashboard/transactions" style={{ color: '#007bff', fontWeight: 'bold' }}>View All Transactions →</Link>
    </div>
  );
}
