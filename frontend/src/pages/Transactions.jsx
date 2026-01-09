import React, { useState, useEffect } from 'react';

export default function Transactions() {
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/payments/all')
      .then(r => r.json())
      .then(setTxs);
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h2>Transaction History</h2>
      <a href="/dashboard" style={{marginBottom: '20px', display: 'block'}}>← Back to Dashboard</a>
      <table data-test-id="transactions-table" border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f8f9fa' }}>
          <tr>
            <th>Payment ID</th>
            <th>Order ID</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {txs.map(t => (
            <tr key={t.id} data-test-id="transaction-row" data-payment-id={t.id}>
              <td data-test-id="payment-id">{t.id}</td>
              <td data-test-id="order-id">{t.order_id}</td>
              <td data-test-id="amount">{t.amount}</td>
              <td data-test-id="method">{t.method}</td>
              <td data-test-id="status">{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
