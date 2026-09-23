import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getImageUrl } from '../utils/imageHelper';
import './WishlistPage.css';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (product) => {
    if (user?.isAdmin) { alert('Admins cannot add to cart.'); return; }
    addToCart({ ...product, img: product.imageUrl });
    removeFromWishlist(product.id);
  };

  return (
    <div>
      <Navbar />
      <div className="wishlist-page">
        <div className="wishlist-header">
          <p className="eyebrow">Saved items</p>
          <h1 className="wishlist-title">My <em>Wishlist</em></h1>
          {wishlist.length > 0 && (
            <p className="wishlist-count">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</p>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <i className="ti ti-heart"></i>
            <h2>Your wishlist is empty</h2>
            <p>Save your favourite pieces here and come back to them anytime.</p>
            <button className="btn-dark" onClick={() => navigate('/shop')}>
              Browse Collection
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map(product => (
              <div className="wishlist-card" key={product.id}>
                <div className="wishlist-img" onClick={() => navigate(`/product/${product.id}`)}>
                  <img src={getImageUrl(product.imageUrl)} alt={product.name} />
                  {product.badge && (
                    <span className={`shop-badge ${product.badge === 'SALE' ? 'badge-sale' : 'badge-new'}`}>
                      {product.badge}
                    </span>
                  )}
                  <button
                    className="wishlist-remove"
                    onClick={e => { e.stopPropagation(); removeFromWishlist(product.id); }}
                    title="Remove from wishlist"
                  >
                    <i className="ti ti-heart-filled"></i>
                  </button>
                </div>
                <p className="wishlist-cat">{product.category}</p>
                <h3 className="wishlist-name" onClick={() => navigate(`/product/${product.id}`)}>
                  {product.name}
                </h3>
                <p className="wishlist-price">
                  {product.originalPrice && <del>₹{product.originalPrice}</del>}
                  <span>₹{product.price}</span>
                </p>
                <button
                  className="btn-dark wishlist-add-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Move to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;