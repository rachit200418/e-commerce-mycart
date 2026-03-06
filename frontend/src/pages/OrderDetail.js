import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, cancelOrder } from '../utils/api';
import { toast } from 'react-toastify';
import './OrderDetail.css';

const TRACK_STEPS = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id).then(res => { setOrder(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      const res = await cancelOrder(id);
      setOrder(res.data);
      toast.success('Order cancelled');
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!order) return <div className="empty-state"><h3>Order not found</h3></div>;

  const currentStep = TRACK_STEPS.indexOf(order.orderStatus);

  return (
    <div className="order-detail-page">
      <div className="container">
        <button className="btn btn-outline btn-sm back-btn" onClick={() => navigate('/orders')}>← Back to Orders</button>

        <div className="order-detail-grid">
          <div className="order-main">
            {/* Tracking */}
            {!['Cancelled', 'Returned'].includes(order.orderStatus) && (
              <div className="card tracking-card">
                <h3>Order Tracking</h3>
                <div className="track-steps">
                  {TRACK_STEPS.map((step, i) => (
                    <div key={step} className={`track-step ${i <= currentStep ? 'done' : ''} ${i === currentStep ? 'current' : ''}`}>
                      <div className="track-dot"></div>
                      <div className="track-line"></div>
                      <p className="track-label">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {order.orderStatus === 'Cancelled' && (
              <div className="card" style={{padding:'20px',marginBottom:'16px',background:'#fff5f5',border:'1px solid #ffcdd2'}}>
                <h3 style={{color:'var(--danger)'}}>❌ Order Cancelled</h3>
                <p style={{fontSize:'14px',marginTop:'8px'}}>Your order has been cancelled successfully.</p>
              </div>
            )}

            {/* Items */}
            <div className="card order-items-card">
              <h3>Order Items</h3>
              {order.items?.map((item, i) => (
                <div key={i} className="detail-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-meta">Qty: {item.quantity}</p>
                    <p className="item-meta">₹{item.price?.toLocaleString()} each</p>
                  </div>
                  <p className="item-total">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-sidebar">
            <div className="card" style={{padding:'20px',marginBottom:'16px'}}>
              <h3 style={{marginBottom:'16px'}}>Order Info</h3>
              <p className="info-row"><strong>Order ID:</strong> #{order._id.slice(-8).toUpperCase()}</p>
              <p className="info-row"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}</p>
              <p className="info-row"><strong>Status:</strong> {order.orderStatus}</p>
              <p className="info-row"><strong>Payment:</strong> {order.paymentMethod} · {order.paymentStatus}</p>
            </div>

            <div className="card" style={{padding:'20px',marginBottom:'16px'}}>
              <h3 style={{marginBottom:'16px'}}>Delivery Address</h3>
              <p style={{fontSize:'14px',lineHeight:'1.7'}}><strong>{order.shippingAddress?.fullName}</strong><br/>{order.shippingAddress?.phone}<br/>{order.shippingAddress?.street}<br/>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
            </div>

            <div className="card" style={{padding:'20px'}}>
              <h3 style={{marginBottom:'16px'}}>Price Breakdown</h3>
              <div className="summary-rows">
                <div className="summary-row"><span>Items</span><span>₹{order.itemsPrice?.toLocaleString()}</span></div>
                <div className="summary-row"><span>Delivery</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
                <div className="summary-row"><span>GST</span><span>₹{order.taxPrice?.toLocaleString()}</span></div>
                <div className="summary-row total"><span>Total</span><span>₹{order.totalPrice?.toLocaleString()}</span></div>
              </div>
              {!['Cancelled', 'Delivered', 'Shipped', 'Out for Delivery'].includes(order.orderStatus) && (
                <button className="btn btn-outline btn-block" style={{marginTop:'16px',color:'var(--danger)',borderColor:'var(--danger)'}} onClick={handleCancel}>Cancel Order</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
