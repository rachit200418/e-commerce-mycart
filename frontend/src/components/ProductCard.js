import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount;

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success('Added to cart!');
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-img-wrap">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={product.name}
          loading="lazy"
        />
        {discount > 0 && <span className="product-discount">{discount}% off</span>}
        {product.stock === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
      </div>
      <div className="product-info">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <span className="stars">★ {product.rating?.toFixed(1)}</span>
          <span className="review-count">({product.numReviews?.toLocaleString()})</span>
        </div>
        <div className="product-price">
          <span className="price-current">₹{product.price?.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="price-original">₹{product.originalPrice?.toLocaleString()}</span>
          )}
        </div>
        {product.seller && <p className="product-seller">by {product.seller}</p>}
        <button
          className="btn btn-accent btn-sm add-cart-btn"
          onClick={handleAdd}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : '+ Add to Cart'}
        </button>
      </div>
    </Link>
  );
}
