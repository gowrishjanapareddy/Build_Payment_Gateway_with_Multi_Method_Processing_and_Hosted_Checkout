import React, { useState } from 'react';

export default function App() {
  const [view, setView] = useState('selection');
  const [payId, setPayId] = useState('');

  const handlePay = async (method, body = {}) => {
    setView('processing');
    try {
      const res = await fetch('http://localhost:8000/api/v1/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: 'order_GRTU9qkdaQPHpoHN', method, ...body })
      });
      const data = await res.json();
      setTimeout(() => { 
        setPayId(data.id); 
        setView('success'); 
      }, 1500);
    } catch (e) {
      alert("Payment failed - check API console");
      setView('selection');
    }
  };

  return (
    <div data-test-id="checkout-container" style={{maxWidth:'450px', margin:'40px auto', padding:'25px', border:'1px solid #ddd', borderRadius:'10px', fontFamily:'sans-serif'}}>
      <div data-test-id="order-summary" style={{borderBottom:'1px solid #eee', marginBottom:'20px', paddingBottom:'15px'}}>
        <h2>Checkout</h2>
        <p>Amount: <strong data-test-id="order-amount">₹500.00</strong></p>
        <p>Order ID: <span data-test-id="order-id">order_GRTU9qkdaQPHpoHN</span></p>
      </div>

      {view === 'selection' && (
        <div data-test-id="payment-methods" style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          <button data-test-id="method-upi" onClick={() => setView('upi')} style={{padding:'12px', cursor:'pointer'}}>Pay via UPI</button>
          <button data-test-id="method-card" onClick={() => setView('card')} style={{padding:'12px', cursor:'pointer'}}>Pay via Card</button>
        </div>
      )}

      {view === 'upi' && (
        <form data-test-id="upi-form" onSubmit={(e) => { e.preventDefault(); handlePay('upi', {vpa: document.getElementById('vpa').value}); }}>
          <input id="vpa" data-test-id="vpa-input" required placeholder="user@bank" style={{width:'95%', padding:'10px', marginBottom:'15px'}} />
          <button data-test-id="pay-button" type="submit" style={{width:'100%', padding:'12px', background:'#007bff', color:'#fff', border:'none', borderRadius:'5px'}}>Pay ₹500</button>
        </form>
      )}

      {view === 'card' && (
        <form data-test-id="card-form" onSubmit={(e) => { e.preventDefault(); handlePay('card', {card_number: document.getElementById('cn').value}); }}>
          <input id="cn" data-test-id="card-number-input" required placeholder="Card Number" style={{width:'95%', padding:'10px', marginBottom:'10px'}} />
          <div style={{display:'flex', gap:'5%'}}>
            <input data-test-id="expiry-input" required placeholder="MM/YY" style={{width:'45%', padding:'10px'}} />
            <input data-test-id="cvv-input" required placeholder="CVV" type="password" style={{width:'45%', padding:'10px'}} />
          </div>
          <input data-test-id="cardholder-name-input" required placeholder="Name on Card" style={{width:'95%', padding:'10px', marginTop:'10px'}} />
          <button data-test-id="pay-button" type="submit" style={{width:'100%', padding:'12px', background:'#007bff', color:'#fff', border:'none', borderRadius:'5px', marginTop:'15px'}}>Pay ₹500</button>
        </form>
      )}

      {view === 'processing' && (
        <div data-test-id="processing-state" style={{textAlign:'center', padding:'20px'}}>
           <span data-test-id="processing-message">Processing your payment...</span>
        </div>
      )}

      {view === 'success' && (
        <div data-test-id="success-state" style={{textAlign:'center'}}>
          <h3 style={{color:'green'}}>Success!</h3>
          <p>ID: <span data-test-id="payment-id">{payId}</span></p>
          <span data-test-id="success-message">Recorded Successfully</span>
          <br/><button onClick={() => window.location.reload()} style={{marginTop:'20px'}}>New Payment</button>
        </div>
      )}
    </div>
  );
}
