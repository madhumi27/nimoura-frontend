import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './Navbar.css';

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Nimoura</Link>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/shop" onClick={() => setMenuOpen(false)}>Collections</Link></li>
        <li><Link to="/shop?category=SALE" onClick={() => setMenuOpen(false)}>Sale</Link></li>
        <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
        <li><Link to="/care" onClick={() => setMenuOpen(false)}>Care Guide</Link></li>
        {user && !user.isAdmin && (
          <li><Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link></li>
        )}
        {user?.isAdmin && (
          <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link></li>
        )}
      </ul>

      <div className="nav-icons">
        {/* Search */}
        <i className="ti ti-search" onClick={() => navigate('/search')} title="Search" />

        {/* Wishlist — only for users */}
        {!user?.isAdmin && (
          <div className="cart-wrap" onClick={() => navigate('/wishlist')}>
            <i className="ti ti-heart" title="Wishlist" />
            {wishlist.length > 0 && (
              <span className="cart-badge">{wishlist.length}</span>
            )}
          </div>
        )}

        {/* Cart — only for users */}
        {!user?.isAdmin && (
          <div className="cart-wrap" onClick={() => navigate('/cart')}>
            <i className="ti ti-shopping-bag" title="Cart" />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </div>
        )}

        {/* User account */}
        {user ? (
          <div className="user-menu">
            <span className="user-name">{user.name}</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        ) : (
          <i className="ti ti-user" onClick={() => navigate('/login')} title="Login" />
        )}

        <i className="ti ti-menu-2 hamburger" onClick={() => setMenuOpen(!menuOpen)} />
      </div>
    </nav>
  );
};

export default Navbar;