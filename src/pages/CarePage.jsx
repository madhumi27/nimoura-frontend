import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './CarePage.css';
const tips = [
  { icon:'ti-droplet-off', title:'Avoid Water',     desc:'Remove jewellery before swimming, showering, or washing hands to prevent tarnish.' },
  { icon:'ti-flask-off',   title:'No Chemicals',    desc:'Keep away from perfume, lotions, and cleaning products. Apply these first, jewellery last.' },
  { icon:'ti-box',         title:'Store Carefully', desc:'Store each piece separately in a soft pouch or box to avoid scratches.' },
  { icon:'ti-sun-off',     title:'Avoid Sunlight',  desc:'Prolonged exposure to direct sunlight can fade gold vermeil over time.' },
  { icon:'ti-brush',       title:'Clean Gently',    desc:'Use a soft dry cloth to polish. For silver, a silver-specific cloth works best.' },
  { icon:'ti-heart',       title:'Wear with Love',  desc:'The oils from your skin actually help maintain sterling silver\'s natural shine.' },
];
const CarePage = () => (
  <div>
    <Navbar />
    <div className="care-hero">
      <p className="eyebrow">Jewellery Care</p>
      <h1 className="care-title">Keep your pieces <em>beautiful</em></h1>
      <p className="care-sub">A little care goes a long way. Here's how to love your Nimoura jewellery.</p>
    </div>
    <div className="care-grid">
      {tips.map(t => (
        <div className="care-card" key={t.title}>
          <i className={`ti ${t.icon}`}></i>
          <h3>{t.title}</h3><p>{t.desc}</p>
        </div>
      ))}
    </div>
    <Footer />
  </div>
);
export default CarePage;
