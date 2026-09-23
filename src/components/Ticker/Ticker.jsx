import React from 'react';
import './Ticker.css';
const items = ['Handcrafted with love','Free shipping above ₹999','Sterling silver & gold vermeil','Made to last a lifetime','New collection out now'];
const Ticker = () => (
  <div className="ticker">
    <div className="ticker-inner">
      {[...items,...items].map((t,i) => <span key={i}>{t}</span>)}
    </div>
  </div>
);
export default Ticker;
