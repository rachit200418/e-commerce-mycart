import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../utils/api';
import './Orders.css';

const STATUS_COLOR = {
  'Processing': 'badge-warning', 'Confirmed': 'badge-primary', 'Shipped': 'badge-primary',
  'Out for Delivery': 'badge-primary', 'Delivered': 'badge-success', 'Cancelled': 'badge-danger', 'Returned': 'badge-danger'
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders().then(res => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  if (orders.length === 0) return (
    <div className="container">
      <div className="empty-state" style={{marginTop:'60px'}}>
        <div style={{fontSize:'80px'}}>📦</div>
        <h3>No orders yet</h3>
        <p>You haven't placed any orders yet</p>
        <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    </div>
  );

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card card">
              <div className="order-card-header">
                <div>
                  <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}</p>
                </div>
                <div style={{textAlign:'right'}}>
                  <span className={`badge ${STATUS_COLOR[order.orderStatus] || 'badge-primary'}`}>{order.orderStatus}</span>
                  <p className="order-total">₹{order.totalPrice?.toLocaleString()}</p>
                </div>
              </div>
              <div className="order-items-preview">
                {order.items?.slice(0, 3).map((item, i) => (
                  <div key={i} className="order-preview-item">
                    <img src={item.image || item.product?.images?.[0]} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <p className="qty-price">Qty: {item.quantity} · ₹{item.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {order.items?.length > 3 && <p className="more-items">+{order.items.length - 3} more items</p>}
              </div>
              <div className="order-card-footer">
                <p>Payment: <strong>{order.paymentMethod}</strong> · {order.paymentStatus}</p>
                <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">View Details →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
