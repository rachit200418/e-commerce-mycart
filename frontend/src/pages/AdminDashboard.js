import React, { useState, useEffect } from 'react';
import { getAllProducts, getAllOrders, getAllUsers, updateOrderStatus, createProduct } from '../utils/api';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

// Reuse getProducts from api
import { getProducts, updateOrderStatus as updateStatus } from '../utils/api';
import * as api from '../utils/api';

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({ name:'',description:'',price:'',originalPrice:'',category:'Electronics',brand:'',stock:'',images:[''],isFeatured:false,seller:'' });

  useEffect(() => {
    if (tab === 'orders') {
      setLoading(true);
      api.getAllOrders().then(r => setOrders(r.data)).finally(() => setLoading(false));
    } else if (tab === 'products') {
      setLoading(true);
      api.getProducts({limit:100}).then(r => setProducts(r.data.products)).finally(() => setLoading(false));
    } else if (tab === 'users') {
      setLoading(true);
      api.getAllUsers().then(r => setUsers(r.data)).finally(() => setLoading(false));
    }
  }, [tab]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.updateOrderStatus(orderId, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? {...o, orderStatus: status} : o));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.createProduct({...newProduct, price: Number(newProduct.price), originalPrice: Number(newProduct.originalPrice), stock: Number(newProduct.stock)});
      toast.success('Product created!');
      setNewProduct({ name:'',description:'',price:'',originalPrice:'',category:'Electronics',brand:'',stock:'',images:[''],isFeatured:false,seller:'' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const totalRevenue = orders.filter(o => o.orderStatus !== 'Cancelled').reduce((s, o) => s + (o.totalPrice || 0), 0);

  return (
    <div className="admin-page">
      <div className="container">
        <h1>Admin Dashboard</h1>
        <div className="admin-tabs">
          {['overview','orders','products','add-product','users'].map(t => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t === 'add-product' ? '+ Add Product' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="admin-overview">
            <div className="stat-cards">
              <div className="stat-card"><div className="stat-icon">📦</div><h3>{orders.length || '—'}</h3><p>Total Orders</p></div>
              <div className="stat-card"><div className="stat-icon">💰</div><h3>₹{totalRevenue ? totalRevenue.toLocaleString() : '—'}</h3><p>Revenue</p></div>
              <div className="stat-card"><div className="stat-icon">🛍️</div><h3>{products.length || '—'}</h3><p>Products</p></div>
              <div className="stat-card"><div className="stat-icon">👥</div><h3>{users.length || '—'}</h3><p>Users</p></div>
            </div>
            <div className="admin-quick">
              <p>Use the tabs above to manage your store. Switch to <strong>Orders</strong> to update delivery status, <strong>Products</strong> to manage inventory, and <strong>Add Product</strong> to list new items.</p>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div className="card admin-table-card">
            <h2>All Orders ({orders.length})</h2>
            {loading ? <div className="loading-screen"><div className="spinner"></div></div> : (
              <div className="table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td>#{order._id.slice(-8).toUpperCase()}</td>
                        <td>{order.user?.name}<br/><small>{order.user?.email}</small></td>
                        <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                        <td>₹{order.totalPrice?.toLocaleString()}</td>
                        <td><span className="badge badge-primary">{order.orderStatus}</span></td>
                        <td>
                          <select className="form-control" style={{fontSize:'12px',padding:'4px 8px'}} value={order.orderStatus}
                            onChange={e => handleStatusChange(order._id, e.target.value)}>
                            {['Processing','Confirmed','Shipped','Out for Delivery','Delivered','Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'products' && (
          <div className="card admin-table-card">
            <h2>Products ({products.length})</h2>
            {loading ? <div className="loading-screen"><div className="spinner"></div></div> : (
              <div className="table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th></tr></thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td style={{display:'flex',alignItems:'center',gap:'10px'}}>
                          <img src={p.images?.[0]} alt="" style={{width:'40px',height:'40px',objectFit:'contain',background:'#f5f5f5',borderRadius:'4px'}} />
                          <span style={{fontSize:'13px',fontWeight:'500'}}>{p.name}</span>
                        </td>
                        <td>{p.category}</td>
                        <td>₹{p.price?.toLocaleString()}</td>
                        <td><span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}`}>{p.stock}</span></td>
                        <td>⭐ {p.rating?.toFixed(1)} ({p.numReviews})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'add-product' && (
          <div className="card admin-table-card">
            <h2>Add New Product</h2>
            <form onSubmit={handleCreateProduct}>
              <div className="form-grid-3">
                <div className="form-group span-2"><label>Product Name</label><input className="form-control" value={newProduct.name} onChange={e => setNewProduct(p=>({...p,name:e.target.value}))} required /></div>
                <div className="form-group"><label>Brand</label><input className="form-control" value={newProduct.brand} onChange={e => setNewProduct(p=>({...p,brand:e.target.value}))} /></div>
                <div className="form-group span-3"><label>Description</label><textarea className="form-control" rows="3" value={newProduct.description} onChange={e => setNewProduct(p=>({...p,description:e.target.value}))} required /></div>
                <div className="form-group"><label>Price (₹)</label><input className="form-control" type="number" value={newProduct.price} onChange={e => setNewProduct(p=>({...p,price:e.target.value}))} required /></div>
                <div className="form-group"><label>Original Price (₹)</label><input className="form-control" type="number" value={newProduct.originalPrice} onChange={e => setNewProduct(p=>({...p,originalPrice:e.target.value}))} /></div>
                <div className="form-group"><label>Stock</label><input className="form-control" type="number" value={newProduct.stock} onChange={e => setNewProduct(p=>({...p,stock:e.target.value}))} required /></div>
                <div className="form-group"><label>Category</label>
                  <select className="form-control" value={newProduct.category} onChange={e => setNewProduct(p=>({...p,category:e.target.value}))}>
                    {['Electronics','Fashion','Home','Books','Sports','Beauty','Toys','Grocery','Mobiles','Appliances'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Seller</label><input className="form-control" value={newProduct.seller} onChange={e => setNewProduct(p=>({...p,seller:e.target.value}))} /></div>
                <div className="form-group"><label>Image URL</label><input className="form-control" value={newProduct.images[0]} onChange={e => setNewProduct(p=>({...p,images:[e.target.value]}))} /></div>
                <div className="form-group" style={{display:'flex',alignItems:'center',gap:'8px',marginTop:'24px'}}>
                  <input type="checkbox" checked={newProduct.isFeatured} onChange={e => setNewProduct(p=>({...p,isFeatured:e.target.checked}))} id="featured" />
                  <label htmlFor="featured" style={{marginBottom:0}}>Featured Product</label>
                </div>
              </div>
              <button className="btn btn-primary btn-lg" type="submit">Create Product</button>
            </form>
          </div>
        )}

        {tab === 'users' && (
          <div className="card admin-table-card">
            <h2>Users ({users.length})</h2>
            {loading ? <div className="loading-screen"><div className="spinner"></div></div> : (
              <div className="table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-success'}`}>{u.role}</span></td>
                        <td>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                        <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
