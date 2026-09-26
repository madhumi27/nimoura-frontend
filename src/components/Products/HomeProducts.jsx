import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getAllProducts } from '../../services/api';
import { getImageUrl } from '../../utils/imageHelper';
import './HomeProducts.css';

const HomeProducts = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        // show only first 3 as featured
        setProducts(res.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAdd = (e, product) => {
    e.stopPropagation();
    if (user?.isAdmin) {
      alert('Admins cannot add to cart.');
      return;
    }
    addToCart({ ...product, img: product.imageUrl });
    setToast(`${product.name} added!`);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <section className="home-products">
      <div className="section-head">
        <p className="eyebrow">Curated for you</p>
        <h2 className="section-title">Bestselling <em>pieces</em></h2>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--brown-muted)', padding: '40px 0' }}>
          Loading products...
        </p>
      ) : (
        <div className="hp-grid">
          {products.map(p => (
            <div className="hp-card" key={p.id}>
              <div className="hp-img" onClick={() => navigate(`/product/${p.id}`)}>
                <img 
  src={getImageUrl(p.imageUrl)} 
  alt={p.name} 
/>
                {p.badge && <span className="hp-badge">{p.badge}</span>}
                {!user?.isAdmin && (
                  <button className="hp-add" onClick={e => handleAdd(e, p)}>
                    Add to Cart
                  </button>
                )}
              </div>
              <p className="hp-cat">{p.category}</p>
              <h3 className="hp-name" onClick={() => navigate(`/product/${p.id}`)}>
                {p.name}
              </h3>
              <p className="hp-price">
                {p.originalPrice && <del>₹{p.originalPrice}</del>}
                <span>₹{p.price}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="hp-cta">
          <button className="btn-dark" onClick={() => navigate('/shop')}>
            View All Products
          </button>
        </div>
      )}
    </section>
  );
};

export default HomeProducts;