import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await register(form);
      loginUser(res.data);
      toast.success('Account created! Welcome to FlitCart 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-banner">
          <h2>Looks like you're new here!</h2>
          <p>Sign up with your details to get started</p>
          <div className="auth-banner-img">🎁</div>
        </div>
        <div className="auth-form-section">
          <h3>Create your account</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Full Name</label><input className="form-control" placeholder="Rachit Gaur" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required /></div>
            <div className="form-group"><label>Email</label><input className="form-control" type="email" placeholder="your@gmail.com" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required /></div>
            <div className="form-group"><label>Phone</label><input className="form-control" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} /></div>
            <div className="form-group"><label>Password</label><input className="form-control" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required /></div>
            <p className="auth-hint">By creating an account, you agree to our Terms & Privacy Policy.</p>
            <button className="btn btn-accent btn-block btn-lg" type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
