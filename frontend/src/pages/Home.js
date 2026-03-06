import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const banners = [
  { bg: 'linear-gradient(135deg, #2874f0 0%, #1a4baa 100%)', title: 'Big Saving Days', sub: 'Up to 80% off on Electronics', cta: 'Shop Electronics', link: '/products?category=Electronics', emoji: '📱' },
  { bg: 'linear-gradient(135deg, #ff6b2b 0%, #e04820 100%)', title: 'Fashion Fiesta', sub: 'Flat 50-70% off on Top Brands', cta: 'Shop Fashion', link: '/products?category=Fashion', emoji: '👗' },
  { bg: 'linear-gradient(135deg, #26a541 0%, #1a7a30 100%)', title: 'Home Makeover', sub: 'Best prices on Appliances', cta: 'Shop Home', link: '/products?category=Appliances', emoji: '🏠' },
];

const categories = [
  { name: 'Mobiles', emoji: '📱', color: '#e3f2fd' },
  { name: 'Electronics', emoji: '💻', color: '#f3e5f5' },
  { name: 'Fashion', emoji: '👗', color: '#fce4ec' },
  { name: 'Home', emoji: '🛋️', color: '#e8f5e9' },
  { name: 'Appliances', emoji: '🍳', color: '#fff3e0' },
  { name: 'Sports', emoji: '🏃', color: '#e0f2f1' },
  { name: 'Beauty', emoji: '💄', color: '#fce4ec' },
  { name: 'Books', emoji: '📚', color: '#e8eaf6' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProducts({ featured: true, limit: 8 }),
      getProducts({ sort: 'popular', limit: 8 })
    ]).then(([f, t]) => {
      setFeatured(f.data.products);
      setTrending(t.data.products);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setBannerIdx(i => (i + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home">
      {/* Hero Banner */}
      <section className="hero-banner" style={{ background: banners[bannerIdx].bg }}>
        <div className="container banner-content">
          <div>
            <p className="banner-tag">🔥 Limited Time Offer</p>
            <h1>{banners[bannerIdx].title}</h1>
            <p className="banner-sub">{banners[bannerIdx].sub}</p>
            <Link to={banners[bannerIdx].link} className="btn btn-accent btn-lg">{banners[bannerIdx].cta} →</Link>
          </div>
          <div className="banner-emoji">{banners[bannerIdx].emoji}</div>
        </div>
        <div className="banner-dots">
          {banners.map((_, i) => (
            <button key={i} className={`dot ${i === bannerIdx ? 'active' : ''}`} onClick={() => setBannerIdx(i)} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link key={cat.name} to={`/products?category=${cat.name}`} className="category-card" style={{ background: cat.color }}>
                <span className="cat-emoji">{cat.emoji}</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {loading ? (
        <div className="loading-screen"><div className="spinner"></div></div>
      ) : (
        <>
          <section className="products-section">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">⚡ Featured Products</h2>
                <Link to="/products?featured=true" className="see-all">See All →</Link>
              </div>
              <div className="products-grid">{featured.map(p => <ProductCard key={p._id} product={p} />)}</div>
            </div>
          </section>

          {/* Banner Strip */}
          <div className="strip-banner">
            <div className="container strip-inner">
              <div className="strip-item">🚚 Free Delivery on Orders above ₹499</div>
              <div className="strip-item">🔄 Easy 30-Day Returns</div>
              <div className="strip-item">🔒 100% Secure Payments</div>
              <div className="strip-item">⭐ 2 Crore+ Happy Customers</div>
            </div>
          </div>

          <section className="products-section">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">🔥 Trending Now</h2>
                <Link to="/products?sort=popular" className="see-all">See All →</Link>
              </div>
              <div className="products-grid">{trending.map(p => <ProductCard key={p._id} product={p} />)}</div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
