import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../services/api';
import { getImageUrl } from '../utils/imageHelper';
import './OrdersPage.css';

const statusColors = {
  PENDING:   { bg: '#fff8e1', color: '#f59e0b' },
  CONFIRMED: { bg: '#e8f5e9', color: '#2a7a4b' },
  SHIPPED:   { bg: '#e3f2fd', color: '#1565c0' },
  DELIVERED: { bg: '#f3e8ff', color: '#7c3aed' },
  CANCELLED: { bg: '#fff0f0', color: '#c44' },
};

const OrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getMyOrders();
      setOrders(res.data);
    } catch (err) {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="orders-page">
        <div className="orders-header">
          <p className="eyebrow">Your purchases</p>
          <h1 className="orders-title">My <em>Orders</em></h1>
        </div>

        {loading && <p className="orders-loading">Loading your orders...</p>}
        {error && <p className="orders-error">{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <div className="orders-empty">
            <i className="ti ti-shopping-bag"></i>
            <h2>No orders yet</h2>
            <p>Looks like you haven't ordered anything yet.</p>
            <button className="btn-dark" onClick={() => navigate('/shop')}>
              Start Shopping
            </button>
          </div>
        )}

        {!loading && orders.map(order => {
          const statusStyle = statusColors[order.status] || statusColors.PENDING;
          return (
            <div className="order-card" key={order.id}>
              <div className="order-card-header">
                <div>
                  <p className="order-id">Order #{order.id}</p>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="order-status" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                  {order.status}
                </div>
              </div>

              <div className="order-items">
                {order.items?.map(item => (
                  <div className="order-item-row" key={item.id}>
                    <img
                      src={getImageUrl(item.product?.imageUrl)}
                      alt={item.product?.name}
                      onError={e => e.target.style.display = 'none'}
                    />
                    <div>
                      <p className="oi-name">{item.product?.name}</p>
                      <p className="oi-meta">{item.product?.category} · Qty: {item.quantity}</p>
                    </div>
                    <span className="oi-price">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <div className="order-address">
                  <i className="ti ti-map-pin"></i>
                  <span>{order.address}, {order.city} — {order.pincode}</span>
                </div>
                <div className="order-total">
                  Total: <strong>₹{order.grandTotal}</strong>
                  {order.shippingCharge === 0 && <span className="free-ship"> + FREE shipping</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;