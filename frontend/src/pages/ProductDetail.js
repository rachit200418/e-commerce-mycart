import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, addReview, toggleWishlist } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selImg, setSelImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('desc');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getProduct(id).then(res => { setProduct(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!product) return <div className="empty-state"><h3>Product not found</h3></div>;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount;

  const handleAddCart = () => { addToCart(product, qty); toast.success('Added to cart!'); };
  const handleBuyNow = () => { addToCart(product, qty); navigate('/cart'); };

  const handleWishlist = async () => {
    if (!user) return navigate('/login');
    try { const res = await toggleWishlist(id); toast.success(res.data.message); }
    catch { toast.error('Error updating wishlist'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setSubmitting(true);
    try {
      await addReview(id, reviewForm);
      const res = await getProduct(id);
      setProduct(res.data);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding review');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-grid">
          {/* Images */}
          <div className="product-images">
            <div className="img-thumbs">
              {product.images?.map((img, i) => (
                <img key={i} src={img} alt="" className={selImg === i ? 'active' : ''} onClick={() => setSelImg(i)} />
              ))}
            </div>
            <div className="img-main">
              <img src={product.images?.[selImg] || 'https://via.placeholder.com/500'} alt={product.name} />
            </div>
            <div className="img-actions">
              <button className="btn btn-accent btn-lg" onClick={handleAddCart} disabled={!product.stock}>
                🛒 Add to Cart
              </button>
              <button className="btn btn-primary btn-lg" onClick={handleBuyNow} disabled={!product.stock}>
                ⚡ Buy Now
              </button>
              <button className="btn btn-outline btn-lg" onClick={handleWishlist}>
                ♡ Wishlist
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="product-info-section">
            <p className="detail-brand">{product.brand}</p>
            <h1 className="detail-name">{product.name}</h1>
            <p className="detail-seller">Sold by: <strong>{product.seller}</strong></p>

            <div className="detail-rating">
              <span className="stars">★ {product.rating?.toFixed(1)}</span>
              <span className="review-count">{product.numReviews?.toLocaleString()} ratings</span>
              <span className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            <div className="detail-price">
              <span className="price-current">₹{product.price?.toLocaleString()}</span>
              {product.originalPrice > product.price && <>
                <span className="price-original">₹{product.originalPrice?.toLocaleString()}</span>
                <span className="price-discount">{discount}% off</span>
              </>}
            </div>

            <div className="detail-offers">
              <h4>Available Offers</h4>
              <p>💳 10% off on HDFC Bank Cards</p>
              <p>🎁 Get ₹500 off on orders above ₹10,000</p>
              <p>🚚 Free Delivery on orders above ₹499</p>
            </div>

            <div className="qty-selector">
              <label>Quantity:</label>
              <div className="qty-controls">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>

            {/* Tabs */}
            <div className="detail-tabs">
              <div className="tab-buttons">
                <button className={tab === 'desc' ? 'active' : ''} onClick={() => setTab('desc')}>Description</button>
                <button className={tab === 'specs' ? 'active' : ''} onClick={() => setTab('specs')}>Specifications</button>
                <button className={tab === 'reviews' ? 'active' : ''} onClick={() => setTab('reviews')}>Reviews ({product.numReviews})</button>
              </div>

              {tab === 'desc' && <div className="tab-content"><p>{product.description}</p></div>}

              {tab === 'specs' && (
                <div className="tab-content">
                  <table className="specs-table">
                    <tbody>
                      {product.specifications?.map((s, i) => (
                        <tr key={i}>
                          <td className="spec-key">{s.key}</td>
                          <td>{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {tab === 'reviews' && (
                <div className="tab-content">
                  {user && (
                    <form className="review-form" onSubmit={handleReview}>
                      <h4>Write a Review</h4>
                      <div className="form-group">
                        <label>Rating</label>
                        <select className="form-control" value={reviewForm.rating} onChange={e => setReviewForm(p => ({ ...p, rating: Number(e.target.value) }))}>
                          {[5,4,3,2,1].map(r => <option key={r} value={r}>{'★'.repeat(r)} {r}/5</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Comment</label>
                        <textarea className="form-control" rows="3" required value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))} />
                      </div>
                      <button className="btn btn-primary" type="submit" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  )}
                  <div className="reviews-list">
                    {product.reviews?.length === 0 ? <p>No reviews yet. Be the first!</p> :
                      product.reviews?.map((r, i) => (
                        <div key={i} className="review-item">
                          <div className="review-header">
                            <span className="stars">★ {r.rating}</span>
                            <strong>{r.name}</strong>
                            <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p>{r.comment}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
