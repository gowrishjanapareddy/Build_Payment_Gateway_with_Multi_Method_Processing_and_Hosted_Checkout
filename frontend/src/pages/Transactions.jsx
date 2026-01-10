import React, { useState, useEffect } from 'react';

export default function Transactions() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/payments/all')
      .then(r => r.json())
      .then(data => setPayments(data));
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Transaction History</h1>
      <a href="/dashboard">← Back to Dashboard</a>
      <br /><br />
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th>Payment ID</th>
            <th>Order ID</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.order_id}</td>
              {/* Divide by 100 to show Rupees instead of Paise */}
              <td>₹{(p.amount / 100).toFixed(2)}</td>
              <td>{p.method}</td>
              <td style={{ color: p.status === 'success' ? 'green' : 'red' }}>
                {p.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
