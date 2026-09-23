import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api, { validatePromoCode } from '../services/api';
import { getImageUrl } from '../utils/imageHelper';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = totalPrice >= 999 ? 0 : 99;
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const discount = appliedPromo ? appliedPromo.discountAmount : 0;
  const grandTotal = totalPrice + shipping - discount;

  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
  if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter valid 10-digit phone number';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
      if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter valid 6-digit pincode';

    return e;
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const res = await validatePromoCode(promoCode, totalPrice + shipping);
      setAppliedPromo(res.data);
    } catch (err) {
      setPromoError(err.response?.data?.error || 'Invalid promo code');
    } finally {
      setPromoLoading(false);
    }
  };

  const handlePayment = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (!user) { navigate('/login'); return; }

    setLoading(true);
    setError('');

    try {
      const orderRes = await api.post('/api/payment/create-order', {
        amount: grandTotal
      });

      const { orderId: razorpayOrderId, amount, currency, keyId } = orderRes.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'Nimoura',
        description: 'Handcrafted Jewellery',
        order_id: razorpayOrderId,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: '#c4956a',
        },
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/api/payment/verify', {
  razorpayOrderId: response.razorpay_order_id,
  razorpayPaymentId: response.razorpay_payment_id,
  razorpaySignature: response.razorpay_signature,
  fullName: form.name,
  email: form.email,
  phone: form.phone,
  address: form.address,
  city: form.city,
  pincode: form.pincode,
  state: form.state,
  promoCode: appliedPromo ? appliedPromo.code : null,
  discountAmount: appliedPromo ? appliedPromo.discountAmount : 0,
  items: cart.map(item => ({
    productId: item.id,
    quantity: item.qty
  }))
});

            setOrderId(verifyRes.data.orderId);
            setPaymentId(response.razorpay_payment_id);
            clearCart();
            setPlaced(true);
          } catch (err) {
            setError('Payment verified but order saving failed. Contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError('Payment cancelled. Please try again.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      setError('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  // Order success screen
  if (placed) return (
    <div>
      <Navbar />
      <div className="order-success">
        <i className="ti ti-circle-check"></i>
        <h2>Payment Successful!</h2>
        <p>Thank you, {form.name}! Your order has been placed.</p>
        <div className="success-details">
          <div className="success-row">
            <span>Order ID</span>
            <strong>#{orderId}</strong>
          </div>
          <div className="success-row">
            <span>Payment ID</span>
            <strong>{paymentId}</strong>
          </div>
          <div className="success-row">
            <span>Amount Paid</span>
            <strong>₹{grandTotal}</strong>
          </div>
          <div className="success-row">
            <span>Email</span>
            <strong>{form.email}</strong>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
          <button className="btn-dark" onClick={() => navigate('/orders')}>View My Orders</button>
          <button className="btn-light" onClick={() => navigate('/shop')}>Continue Shopping</button>
        </div>
      </div>
      <Footer />
    </div>
  );

  // Empty cart
  if (cart.length === 0) return (
    <div>
      <Navbar />
      <div className="order-success">
        <h2>Your cart is empty</h2>
        <button className="btn-dark" onClick={() => navigate('/shop')}>Shop Now</button>
      </div>
      <Footer />
    </div>
  );

  const f = (key) => ({
    value: form[key],
    onChange: e => {
      setForm(f => ({ ...f, [key]: e.target.value }));
      setErrors(er => ({ ...er, [key]: '' }));
    }
  });

  return (
    <div>
      <Navbar />
      <div className="checkout-page">
        <div className="checkout-form-wrap">
          <p className="eyebrow">Delivery Details</p>
          <h1 className="checkout-title">Checkout</h1>

          {!user && (
            <div className="login-reminder">
              <i className="ti ti-info-circle"></i>
              <span>Please <span className="login-link" onClick={() => navigate('/login')}>login</span> before placing your order.</span>
            </div>
          )}

          <div className="form-grid">
            <div className={`form-group ${errors.name ? 'err' : ''}`}>
              <label>Full Name *</label>
              <input placeholder="Your name" {...f('name')} />
              {errors.name && <span className="err-msg">{errors.name}</span>}
            </div>
            <div className={`form-group ${errors.email ? 'err' : ''}`}>
              <label>Email *</label>
              <input type="email" placeholder="your@email.com" {...f('email')} />
              {errors.email && <span className="err-msg">{errors.email}</span>}
            </div>
            <div className={`form-group ${errors.phone ? 'err' : ''}`}>
              <label>Phone *</label>
<input
  placeholder="10-digit mobile number"
  maxLength={10}
  onKeyPress={e => !/[0-9]/.test(e.key) && e.preventDefault()}
  {...f('phone')}
/>              {errors.phone && <span className="err-msg">{errors.phone}</span>}
            </div>
            <div className={`form-group full ${errors.address ? 'err' : ''}`}>
              <label>Address *</label>
              <input placeholder="House no, Street, Area" {...f('address')} />
              {errors.address && <span className="err-msg">{errors.address}</span>}
            </div>
            <div className={`form-group ${errors.city ? 'err' : ''}`}>
              <label>City *</label>
              <input placeholder="City" {...f('city')} />
              {errors.city && <span className="err-msg">{errors.city}</span>}
            </div>
            <div className={`form-group ${errors.pincode ? 'err' : ''}`}>
              <label>Pincode *</label>
<input
  placeholder="6-digit pincode"
  maxLength={6}
  onKeyPress={e => !/[0-9]/.test(e.key) && e.preventDefault()}
  {...f('pincode')}
/>
              {errors.pincode && <span className="err-msg">{errors.pincode}</span>}
            </div>
            <div className="form-group">
              <label>State</label>
              <input placeholder="State" {...f('state')} />
            </div>
          </div>

          {/* Promo Code Section */}
          <div className="promo-section">
            <p className="eyebrow" style={{ marginBottom: 12 }}>Promo Code</p>
            {appliedPromo ? (
              <div className="promo-applied">
                <div className="promo-success">
                  <i className="ti ti-circle-check"></i>
                  <span>
                    <strong>{appliedPromo.code}</strong> applied!
                    You save ₹{appliedPromo.discountAmount.toFixed(0)}
                  </span>
                </div>
                <button className="promo-remove" onClick={() => setAppliedPromo(null)}>
                  Remove
                </button>
              </div>
            ) : (
              <div className="promo-input-row">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }}
                />
                <button
                  className="promo-apply-btn"
                  onClick={handleApplyPromo}
                  disabled={promoLoading}
                >
                  {promoLoading ? '...' : 'Apply'}
                </button>
              </div>
            )}
            {promoError && <p className="promo-error">{promoError}</p>}
          </div>

          {error && (
            <p style={{ color: '#c44', fontSize: 13, marginTop: 16, padding: '12px 16px', background: '#fff0f0', border: '1px solid #f0c0c0' }}>
              {error}
            </p>
          )}
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h3>Your Order</h3>
          {cart.map(item => (
            <div className="co-item" key={item.id}>
              <img src={getImageUrl(item.img || item.imageUrl)} alt={item.name} />
              <div>
                <p className="co-name">{item.name}</p>
                <p className="co-qty">Qty: {item.qty}</p>
              </div>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}
          <div className="co-divider"></div>
          <div className="co-row"><span>Subtotal</span><span>₹{totalPrice}</span></div>
          <div className="co-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? <span style={{ color: '#2a7a4b' }}>FREE</span> : `₹${shipping}`}</span>
          </div>
          {shipping > 0 && (
            <p style={{ fontSize: 11, color: 'var(--gold)', marginBottom: 10 }}>
              Add ₹{999 - totalPrice} more for free shipping
            </p>
          )}
          {appliedPromo && (
            <div className="co-row" style={{ color: '#2a7a4b' }}>
              <span>Discount ({appliedPromo.code})</span>
              <span>- ₹{appliedPromo.discountAmount.toFixed(0)}</span>
            </div>
          )}
          <div className="co-row co-total"><span>Total</span><span>₹{grandTotal}</span></div>

          <div className="payment-methods">
            <p className="pay-methods-label">Accepted Payments</p>
            <div className="pay-icons">
              <span>UPI</span>
              <span>Card</span>
              <span>NetBanking</span>
              <span>Wallet</span>
            </div>
          </div>

          <button
            className="btn-dark place-btn"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? 'Opening Payment...' : `Pay ₹${grandTotal}`}
          </button>
          <p className="secure-note">
            <i className="ti ti-lock"></i> 100% Secure payments via Razorpay
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;