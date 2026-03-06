import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = cartTotal > 499 ? 0 : 40;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  if (cart.length === 0) return (
    <div className="container">
      <div className="empty-state" style={{marginTop:'60px'}}>
        <div style={{fontSize:'80px'}}>🛒</div>
        <h3>Your cart is empty!</h3>
        <p>Add some products to get started</p>
        <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">My Cart ({cart.length} items)</h1>
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item._id} className="cart-item">
                <Link to={`/products/${item._id}`}>
                  <img src={item.images?.[0] || 'https://via.placeholder.com/100'} alt={item.name} />
                </Link>
                <div className="cart-item-info">
                  <Link to={`/products/${item._id}`} className="cart-item-name">{item.name}</Link>
                  <p className="cart-item-brand">{item.brand}</p>
                  <p className="cart-item-seller">Seller: {item.seller}</p>
                  <div className="cart-item-price">
                    <span className="price-current">₹{(item.price * item.quantity).toLocaleString()}</span>
                    <span className="price-original">₹{(item.originalPrice * item.quantity).toLocaleString()}</span>
                  </div>
                  <div className="cart-item-actions">
                    <div className="qty-controls">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item._id)}>🗑 Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary card">
            <h3>Price Details</h3>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Price ({cart.length} items)</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charges</span>
                <span className={shipping === 0 ? 'text-success' : ''}>
                  {shipping === 0 ? '🎉 FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className="summary-row">
                <span>GST (18%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            {shipping > 0 && <p className="free-delivery-hint">Add ₹{499 - cartTotal} more for FREE delivery</p>}
            <button
              className="btn btn-accent btn-lg btn-block"
              onClick={() => user ? navigate('/checkout') : navigate('/login')}
            >
              {user ? 'Proceed to Checkout →' : 'Login to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
