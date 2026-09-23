import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { CATEGORIES } from '../data/products';
import { getAllProducts } from '../services/api';
import { getImageUrl } from '../utils/imageHelper';
import './ShopPage.css';
const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
const { addToCart, cart } = useCart();  const [toast, setToast] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toggleWishlist, isWishlisted } = useWishlist();
const { user } = useAuth();
  const activeCategory = searchParams.get('category') || 'All Products';

  // Fetch all products from backend when page loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getAllProducts();
        setProducts(res.data);
      } catch (err) {
        setError('Failed to load products. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter on frontend based on selected category
  const filtered = activeCategory === 'All Products'
    ? products
    : activeCategory === 'SALE'
    ? products.filter(p => p.badge === 'SALE')
    : products.filter(p => p.category === activeCategory);

  
  const handleAdd = (e, product) => {
  e.stopPropagation();
  if (user?.isAdmin) { alert('Admins cannot add to cart.'); return; }
  if (product.stock <= 0) { alert('Sorry! This product is out of stock.'); return; }
  
  // Check if adding more than available stock
  const existingItem = cart.find(i => i.id === product.id);
  const currentQty = existingItem ? existingItem.qty : 0;
  if (currentQty + 1 > product.stock) {
    alert(`Sorry! Only ${product.stock} item(s) available in stock.`);
    return;
  }
  
  addToCart({ ...product, img: product.imageUrl });
  setToast(`${product.name} added to cart!`);
  setTimeout(() => setToast(''), 2500);
};

 

  return (
    <div>
      <Navbar />
      {toast && <div className="shop-toast">{toast}</div>}

      <div className="shop-header">
        <p className="eyebrow">Our Collections</p>
        <h1 className="shop-title">Nimoura <em>Jewellery</em></h1>
      </div>

      {/* Category Filter Tabs */}
      <div className="cat-filter-wrap">
        <div className="cat-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-tab ${activeCategory === cat ? 'active' : ''} ${cat === 'SALE' ? 'sale-tab' : ''}`}
              onClick={() => setSearchParams({ category: cat })}
            >
              {cat === 'SALE' ? '🔖 SALE' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="shop-meta">
        <p>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="shop-loading">
          <p>Loading products...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="shop-error">
          <p>{error}</p>
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && (
        <div className="shop-grid">
          {filtered.length === 0 ? (
            <div className="no-products">
              <i className="ti ti-mood-empty"></i>
              <p>No products in this category yet.</p>
            </div>
          ) : (
            filtered.map(p => (
              <div className="shop-card" key={p.id}>
                <div className="shop-card-img" onClick={() => navigate(`/product/${p.id}`)}>
                 <img src={getImageUrl(p.imageUrl)} alt={p.name} />
                  {p.badge && (
                    <span className={`shop-badge ${p.badge === 'SALE' ? 'badge-sale' : 'badge-new'}`}>
                      {p.badge}
                    </span>
                  )}
                <button className="wish-btn" onClick={e => { e.stopPropagation(); toggleWishlist(p); }}>
  <i className={`ti ${isWishlisted(p.id) ? 'ti-heart-filled' : 'ti-heart'}`}></i>
</button>
                 {p.stock > 0 ? (
  <button className="add-btn" onClick={e => handleAdd(e, p)}>Add to Cart</button>
) : (
  <div className="out-of-stock-btn">Out of Stock</div>
)}
                </div>
                <h3 className="shop-card-name" onClick={() => navigate(`/product/${p.id}`)}>{p.name}</h3>
                <p className="shop-card-price">
                  {p.originalPrice && <del>₹{p.originalPrice}</del>}
                  <span>₹{p.price}</span>
                  {p.originalPrice && (
                    <span className="discount">
                      {Math.round((1 - p.price / p.originalPrice) * 100)}% off
                    </span>
                  )}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};
export default ShopPage;