import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-banner">
          <h2>Login</h2>
          <p>Get access to your Orders, Wishlist and Recommendations</p>
          <div className="auth-banner-img">🛍️</div>
        </div>
        <div className="auth-form-section">
          <h3>Enter your details</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input className="form-control" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="form-control" type="password" placeholder="Enter password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required />
            </div>
            <p className="auth-hint">By continuing, you agree to FlitCart's Terms of Use and Privacy Policy.</p>
            <button className="btn btn-accent btn-block btn-lg" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="demo-creds">
            <p>Demo Admin: admin@flitcart.com / admin123</p>
          </div>
          <p className="auth-switch">New to FlitCart? <Link to="/register">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
}
