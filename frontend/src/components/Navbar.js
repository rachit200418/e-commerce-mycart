import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logoutUser, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  const categories = ['Mobiles', 'Electronics', 'Fashion', 'Home', 'Appliances', 'Books', 'Sports', 'Beauty'];

  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="container navbar-inner">
          <Link to="/" className="logo">
            <span className="logo-flit">My</span><span className="logo-cart">Cart</span>
          </Link>

          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </form>

          <nav className="nav-actions">
            {user ? (
              <div className="nav-dropdown">
                <button className="nav-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>{user.name.split(' ')[0]}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <div className="dropdown-menu">
                  <Link to="/profile">My Profile</Link>
                  <Link to="/orders">My Orders</Link>
                  {isAdmin && <Link to="/admin">Admin Panel</Link>}
                  <button onClick={logoutUser}>Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline btn-sm" style={{color:'#fff',borderColor:'rgba(255,255,255,0.7)'}}>Login</Link>
            )}

            <Link to="/cart" className="nav-cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              <span>Cart</span>
            </Link>
          </nav>
        </div>
      </div>

      <div className="navbar-cats">
        <div className="container">
          <div className="cats-list">
            {categories.map(cat => (
              <Link key={cat} to={`/products?category=${cat}`} className="cat-link">{cat}</Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}