import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateMe } from '../utils/api';
import { toast } from 'react-toastify';
import './Profile.css';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateMe(form);
      setUser(res.data);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-grid">
          <div className="profile-sidebar card">
            <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
            {user?.role === 'admin' && <span className="badge badge-primary" style={{marginTop:'8px'}}>Admin</span>}
          </div>
          <div className="card profile-form-card">
            <h2>Personal Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="form-control" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required />
                </div>
                <div className="form-group">
                  <label>Email (cannot change)</label>
                  <input className="form-control" value={user?.email} disabled style={{background:'#f5f5f5'}} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input className="form-control" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} placeholder="+91 9876543210" />
                </div>
                <div className="form-group">
                  <label>Member Since</label>
                  <input className="form-control" value={new Date(user?.createdAt).toLocaleDateString('en-IN', {month:'long',year:'numeric'})} disabled style={{background:'#f5f5f5'}} />
                </div>
              </div>
              <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
