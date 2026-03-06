import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../utils/api';
import { toast } from 'react-toastify';
import './Checkout.css';

const PAYMENT_METHODS = ['COD', 'UPI', 'Card', 'NetBanking'];

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: user?.name || '', phone: '', street: '', city: '', state: '', pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const shipping = cartTotal > 499 ? 0 : 40;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  const handleOrder = async () => {
    setLoading(true);
    try {
      const items = cart.map(item => ({
        product: item._id, name: item.name, image: item.images?.[0],
        price: item.price, quantity: item.quantity
      }));
      const order = await createOrder({ items, shippingAddress: address, paymentMethod, itemsPrice: cartTotal, shippingPrice: shipping, taxPrice: tax, totalPrice: total });
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${order.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-steps">
          {['Address', 'Order Summary', 'Payment'].map((s, i) => (
            <div key={s} className={`step ${step > i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <span className="step-num">{step > i + 1 ? '✓' : i + 1}</span>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            {step === 1 && (
              <div className="card checkout-section">
                <h2>Delivery Address</h2>
                <div className="form-grid">
                  <div className="form-group"><label>Full Name</label><input className="form-control" value={address.fullName} onChange={e => setAddress(p => ({...p, fullName: e.target.value}))} required /></div>
                  <div className="form-group"><label>Phone</label><input className="form-control" value={address.phone} onChange={e => setAddress(p => ({...p, phone: e.target.value}))} required /></div>
                  <div className="form-group span-2"><label>Street Address</label><input className="form-control" value={address.street} onChange={e => setAddress(p => ({...p, street: e.target.value}))} required /></div>
                  <div className="form-group"><label>City</label><input className="form-control" value={address.city} onChange={e => setAddress(p => ({...p, city: e.target.value}))} required /></div>
                  <div className="form-group"><label>State</label><input className="form-control" value={address.state} onChange={e => setAddress(p => ({...p, state: e.target.value}))} required /></div>
                  <div className="form-group"><label>Pincode</label><input className="form-control" value={address.pincode} onChange={e => setAddress(p => ({...p, pincode: e.target.value}))} required /></div>
                </div>
                <button className="btn btn-primary btn-lg" onClick={() => {
                  if (!address.fullName || !address.phone || !address.street || !address.city || !address.state || !address.pincode)
                    return toast.error('Fill all fields');
                  setStep(2);
                }}>Continue →</button>
              </div>
            )}

            {step === 2 && (
              <div className="card checkout-section">
                <h2>Order Summary</h2>
                {cart.map(item => (
                  <div key={item._id} className="order-item">
                    <img src={item.images?.[0]} alt={item.name} />
                    <div>
                      <p className="order-item-name">{item.name}</p>
                      <p className="order-item-qty">Qty: {item.quantity}</p>
                    </div>
                    <p className="order-item-price">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
                <div className="address-box">
                  <strong>📍 Delivering to:</strong>
                  <p>{address.fullName}, {address.phone}</p>
                  <p>{address.street}, {address.city}, {address.state} - {address.pincode}</p>
                </div>
                <div style={{display:'flex',gap:'12px'}}>
                  <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={() => setStep(3)}>Continue →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card checkout-section">
                <h2>Payment Method</h2>
                <div className="payment-options">
                  {PAYMENT_METHODS.map(pm => (
                    <label key={pm} className={`payment-option ${paymentMethod === pm ? 'selected' : ''}`}>
                      <input type="radio" name="payment" value={pm} checked={paymentMethod === pm} onChange={() => setPaymentMethod(pm)} />
                      <span>{pm === 'COD' ? '💵 Cash on Delivery' : pm === 'UPI' ? '📱 UPI' : pm === 'Card' ? '💳 Credit/Debit Card' : '🏦 Net Banking'}</span>
                    </label>
                  ))}
                </div>
                {paymentMethod === 'UPI' && <input className="form-control" placeholder="Enter UPI ID (e.g. name@upi)" style={{marginBottom:'16px'}} />}
                <div style={{display:'flex',gap:'12px'}}>
                  <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn btn-accent btn-lg" onClick={handleOrder} disabled={loading}>
                    {loading ? 'Placing Order...' : `Place Order ₹${total.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="card checkout-sidebar">
            <h3>Price Summary</h3>
            <div className="summary-rows">
              <div className="summary-row"><span>Items</span><span>₹{cartTotal.toLocaleString()}</span></div>
              <div className="summary-row"><span>Delivery</span><span className={shipping===0?'text-success':''}>{shipping===0?'FREE':`₹${shipping}`}</span></div>
              <div className="summary-row"><span>GST</span><span>₹{tax.toLocaleString()}</span></div>
              <div className="summary-row total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
