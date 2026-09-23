import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getAllProducts, getProductById } from '../services/api';
import { getImageUrl } from '../utils/imageHelper';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(false);
  const { addToCart, cart } = useCart();
const { toggleWishlist, isWishlisted } = useWishlist();
  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await getProductById(id);
      setProduct(res.data);
      // fetch related products same category
      const allRes = await getAllProducts();
      const rel = allRes.data.filter(p => p.category === res.data.category && p.id !== res.data.id).slice(0, 3);
      setRelated(rel);
    } catch (err) {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
  if (user?.isAdmin) { alert('Admins cannot add to cart.'); return; }
  if (product.stock <= 0) { alert('Sorry! This product is out of stock.'); return; }
  if (qty > product.stock) {
    alert(`Sorry! Only ${product.stock} item(s) available.`);
    return;
  }

  // Check cart quantity too
  const existingItem = cart.find(i => i.id === product.id);
  const currentQty = existingItem ? existingItem.qty : 0;
  if (currentQty + qty > product.stock) {
    alert(`Sorry! Only ${product.stock - currentQty} more item(s) can be added.`);
    return;
  }

  for (let i = 0; i < qty; i++) addToCart({ ...product, img: product.imageUrl });
  setToast(true);
  setTimeout(() => setToast(false), 2500);
};
  const handleBuyNow = () => {
    if (user?.isAdmin) {
      alert('Admins cannot place orders. Please login as a customer.');
      return;
    }
    handleAdd();
    navigate('/cart');
  };

  if (loading) return (
    <div>
      <Navbar />
      <div className="prod-loading">
        <p>Loading product...</p>
      </div>
      <Footer />
    </div>
  );

  if (!product) return (
    <div>
      <Navbar />
      <div className="not-found">
        <h2>Product not found</h2>
        <button className="btn-dark" onClick={() => navigate('/shop')}>Back to Shop</button>
      </div>
      <Footer />
    </div>
  );

  return (
    <div>
      <Navbar />
      {toast && <div className="prod-toast">Added to cart ✓</div>}

      {/* Breadcrumb */}
      <div className="prod-breadcrumb">
        <span onClick={() => navigate('/')}>Home</span>
        <span> / </span>
        <span onClick={() => navigate('/shop')}>Shop</span>
        <span> / </span>
        <span onClick={() => navigate(`/shop?category=${product.category}`)}>{product.category}</span>
        <span> / </span>
        <span className="active">{product.name}</span>
      </div>

      <div className="prod-page">
        <div className="prod-img-section">
          <img 
  src={getImageUrl(product.imageUrl)} 
  alt={product.name} 
  className="prod-main-img" 
/>
        </div>

        <div className="prod-info">
          <p className="prod-cat-label">{product.category}</p>
          <h1 className="prod-name">{product.name}</h1>

          <div className="prod-price-row">
            {product.originalPrice && <del className="prod-original">₹{product.originalPrice}</del>}
            <span className="prod-current">₹{product.price}</span>
            {product.originalPrice && (
              <span className="prod-off">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% off
              </span>
            )}
          </div>

          {product.badge && (
            <span className={`prod-badge-tag ${product.badge === 'SALE' ? 'sale' : 'new'}`}>
              {product.badge}
            </span>
          )}
          <button 
  className="prod-wish-btn"
  onClick={() => toggleWishlist(product)}
>
  <i className={`ti ${isWishlisted(product.id) ? 'ti-heart-filled' : 'ti-heart'}`}></i>
  {isWishlisted(product.id) ? ' Wishlisted' : ' Add to Wishlist'}
</button>

          <p className="prod-desc">
            {product.description || 'Handcrafted with care and attention to detail. This piece is made in small batches ensuring quality and uniqueness. Perfect for everyday wear or special occasions.'}
          </p>

          <div className="prod-qty-row">
            <span className="prod-qty-label">Quantity</span>
            <div className="qty-ctrl">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>

        {user?.isAdmin ? (
  <div className="admin-block-msg">
    <i className="ti ti-info-circle"></i>
    <span>You are logged in as Admin. <span onClick={() => navigate('/admin')} style={{color:'var(--gold)',cursor:'pointer'}}>Go to Admin Panel</span></span>
  </div>
) : product.stock > 0 ? (
  <div className="prod-actions">
    <button className="btn-dark prod-add-btn" onClick={handleAdd}>Add to Cart</button>
    <button className="btn-light prod-buy-btn" onClick={handleBuyNow}>Buy Now</button>
  </div>
) : (
  <div className="out-of-stock-msg">
    <i className="ti ti-alert-circle"></i>
    <span>Out of Stock — Check back soon!</span>
  </div>
)}
{product.stock > 0 && product.stock <= 5 && (
  <p className="low-stock">Only {product.stock} left!</p>
)}

          <div className="prod-meta">
            <div className="prod-meta-row"><i className="ti ti-truck-delivery"></i><span>Free shipping above ₹999</span></div>
            <div className="prod-meta-row"><i className="ti ti-refresh"></i><span>7-day easy returns</span></div>
            <div className="prod-meta-row"><i className="ti ti-award"></i><span>100% authentic, hallmarked</span></div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="related">
          <div className="section-head" style={{ textAlign: 'center', marginBottom: 40, padding: '0 48px' }}>
            <p className="eyebrow">You might also like</p>
            <h2 className="section-title">More from <em>{product.category}</em></h2>
          </div>
          <div className="related-grid">
            {related.map(p => (
              <div className="related-card" key={p.id} onClick={() => navigate(`/product/${p.id}`)}>
                <img 
  src={getImageUrl(p.imageUrl)} 
  alt={p.name} 
/>
                <h4>{p.name}</h4>
                <p>₹{p.price}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ProductPage;