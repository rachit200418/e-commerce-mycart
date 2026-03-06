import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';
import './ProductList.css';

const SORT_OPTIONS = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Rating', value: 'rating' },
  { label: 'Popularity', value: 'popular' },
];

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const featured = searchParams.get('featured') || '';

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (category) params.category = category;
    if (search) params.search = search;
    if (sort) params.sort = sort;
    if (featured) params.featured = featured;

    getProducts(params)
      .then(res => { setProducts(res.data.products); setTotal(res.data.total); setPages(res.data.pages); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [category, search, sort, page, featured]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const update = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <div className="product-list-page">
      <div className="container">
        <div className="products-main">
          <div className="products-header">
            <div>
              <h2>{search ? `Results for "${search}"` : category || 'All Products'}</h2>
              <p className="results-count">{total.toLocaleString()} results</p>
            </div>
            <select className="form-control sort-select" value={sort} onChange={e => update('sort', e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="loading-screen"><div className="spinner"></div></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div style={{fontSize:'60px'}}>🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search term</p>
            </div>
          ) : (
            <>
              <div className="products-grid">{products.map(p => <ProductCard key={p._id} product={p} />)}</div>
              {pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`page-btn ${page === p ? 'active' : ''}`}
                      onClick={() => { const np = new URLSearchParams(searchParams); np.set('page', p); setSearchParams(np); }}
                    >{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}