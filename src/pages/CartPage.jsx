import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageHelper';
import './CartPage.css';

const CartPage = () => {
  const { cart, totalItems, totalPrice, removeFromCart, updateQty } = useCart();
  const navigate = useNavigate();
  const shipping = totalPrice >= 999 ? 0 : 99;
  const grandTotal = totalPrice + shipping;

  return (
    <div>
      <Navbar />
      <div className="cart-page">
        <div className="cart-header">
          <p className="eyebrow">Your Bag</p>
          <h1 className="cart-title">Shopping <em>Cart</em></h1>
          {totalItems > 0 && <p className="cart-count">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>}
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <i className="ti ti-shopping-bag"></i>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <button className="btn-dark" onClick={() => navigate('/shop')}>Start Shopping</button>
          </div>
        ) : (
          <div className="cart-body">
            <div className="cart-items">
              {cart.map(item => (
                <div className="cart-item" key={item.id}>
<img src={getImageUrl(item.img || item.imageUrl)} alt={item.name} onClick={() => navigate(`/product/${item.id}`)} />                  <div className="cart-item-info">
                    <p className="cart-item-cat">{item.category}</p>
                    <h3 className="cart-item-name" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h3>
                    <p className="cart-item-price">₹{item.price} each</p>
                    <div className="cart-qty">
                      <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                     <button onClick={() => {
  if (item.qty + 1 > (item.stock || 999)) {
    alert(`Only ${item.stock} available in stock!`);
    return;
  }
  updateQty(item.id, item.qty + 1);
}}>+</button>
                    </div>
                  </div>
                  <div className="cart-item-right">
                    <span className="cart-item-total">₹{item.price * item.qty}</span>
                    <button className="cart-remove" onClick={() => removeFromCart(item.id)}>
                      <i className="ti ti-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row"><span>Subtotal</span><span>₹{totalPrice}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span className="free">FREE</span> : `₹${shipping}`}</span></div>
              {shipping > 0 && <p className="ship-hint">Add ₹{999 - totalPrice} more for free shipping</p>}
              <div className="summary-row total-row"><span>Total</span><span>₹{grandTotal}</span></div>
              <button className="btn-dark checkout-btn" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
              <button className="btn-light cont-btn" onClick={() => navigate('/shop')}>Continue Shopping</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
export default CartPage;
