import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { searchProducts } from '../services/api';
import { getImageUrl } from '../utils/imageHelper';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query.trim().length > 0) {
      fetchResults();
    } else {
      setResults([]);
    }
  }, [query]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await searchProducts(query);
      setResults(res.data);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (e, product) => {
    e.stopPropagation();
    if (user?.isAdmin) { alert('Admins cannot add to cart.'); return; }
    addToCart({ ...product, img: product.imageUrl });
    setToast(`${product.name} added to cart!`);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div>
      <Navbar />
      {toast && <div className="shop-toast">{toast}</div>}

      <div className="search-page">
        {/* Search Bar */}
        <div className="search-hero">
          <p className="eyebrow">Search</p>
          <h1 className="search-title">Find your <em>perfect</em> piece</h1>
          <div className="search-bar">
            <i className="ti ti-search"></i>
            <input
              type="text"
              placeholder="Search for rings, earrings, bangles..."
              value={query}
              onChange={e => setSearchParams({ q: e.target.value })}
              autoFocus
            />
            {query && (
              <button className="search-clear" onClick={() => setSearchParams({ q: '' })}>
                <i className="ti ti-x"></i>
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="search-results">
          {!query && (
            <div className="search-empty">
              <i className="ti ti-search"></i>
              <p>Start typing to search products</p>
            </div>
          )}

          {loading && <p className="search-loading">Searching...</p>}

          {!loading && query && results.length === 0 && (
            <div className="search-empty">
              <i className="ti ti-mood-empty"></i>
              <p>No products found for "<strong>{query}</strong>"</p>
              <button className="btn-dark" onClick={() => navigate('/shop')}>
                Browse All Products
              </button>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <p className="search-count">
                {results.length} result{results.length !== 1 ? 's' : ''} for "<strong>{query}</strong>"
              </p>
              <div className="search-grid">
                {results.map(p => (
                  <div className="shop-card" key={p.id}>
                    <div className="shop-card-img" onClick={() => navigate(`/product/${p.id}`)}>
                      <img src={getImageUrl(p.imageUrl)} alt={p.name} />
                      {p.badge && (
                        <span className={`shop-badge ${p.badge === 'SALE' ? 'badge-sale' : 'badge-new'}`}>
                          {p.badge}
                        </span>
                      )}
                      <button className="add-btn" onClick={e => handleAdd(e, p)}>
                        Add to Cart
                      </button>
                    </div>
                    <h3 className="shop-card-name" onClick={() => navigate(`/product/${p.id}`)}>
                      {p.name}
                    </h3>
                    <p className="shop-card-price">
                      {p.originalPrice && <del>₹{p.originalPrice}</del>}
                      <span>₹{p.price}</span>
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;