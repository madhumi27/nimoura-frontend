import React from 'react';
import './Features.css';
const feats = [
  { icon:'ti-truck-delivery', title:'Free Shipping',   sub:'Orders above ₹999' },
  { icon:'ti-refresh',        title:'Easy Returns',    sub:'7-day hassle-free' },
  { icon:'ti-lock',           title:'Secure Checkout', sub:'Razorpay secured' },
  { icon:'ti-award',          title:'Hallmarked',      sub:'Certified materials only' },
];
const Features = () => (
  <div className="features">
    {feats.map(f => (
      <div className="feat" key={f.title}>
        <i className={`ti ${f.icon}`}></i>
        <p className="feat-t">{f.title}</p>
        <p className="feat-s">{f.sub}</p>
      </div>
    ))}
  </div>
);
export default Features;
