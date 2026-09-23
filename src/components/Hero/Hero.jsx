import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero-left">
        <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&q=80" alt="Woman wearing gold jewellery" />
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-right">
        <p className="eyebrow">New Arrivals · Summer 2025</p>
        <h1 className="hero-title">Where gold<br />meets <em>quiet</em><br />beauty</h1>
        <p className="hero-desc">Handcrafted jewellery made in small batches — for the woman who wears her story close to the skin.</p>
        <div className="hero-btns">
          <button className="btn-dark" onClick={() => navigate('/shop')}>Shop Collection</button>
          <button className="btn-light" onClick={() => navigate('/about')}>Our Story</button>
        </div>
        <div className="hero-stats">
          <div className="stat"><span className="stat-num">200+</span><span className="stat-label">Unique Pieces</span></div>
          <div className="stat"><span className="stat-num">4.9★</span><span className="stat-label">Avg Rating</span></div>
          <div className="stat"><span className="stat-num">100%</span><span className="stat-label">Handcrafted</span></div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
