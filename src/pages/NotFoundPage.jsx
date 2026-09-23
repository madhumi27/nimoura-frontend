import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '120px 48px' }}>
        <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
          404
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 300, color: 'var(--brown-dark)', marginBottom: 16 }}>
          Page not <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>found</em>
        </h1>
        <p style={{ fontSize: 13, color: 'var(--brown-muted)', marginBottom: 40, fontWeight: 300 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn-dark" onClick={() => navigate('/')}>Go Home</button>
          <button className="btn-light" onClick={() => navigate('/shop')}>Shop Now</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFoundPage;