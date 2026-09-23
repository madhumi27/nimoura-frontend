import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './AboutPage.css';
const AboutPage = () => (
  <div>
    <Navbar />
    <section className="about-hero">
      <div className="about-text">
        <p className="eyebrow">Our Story</p>
        <h1 className="about-title">Born from <em>friendship</em><br />and a love for craft</h1>
        <p className="about-desc">Nimoura began as a small stall between two best friends who believed jewellery should feel personal, not mass-produced. Every piece we make carries that same spirit — handcrafted with care, made to be worn for years.</p>
      </div>
      <div className="about-img">
        <img src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80" alt="Nimoura craftsmanship" />
      </div>
    </section>
    <section className="about-values">
      {[
        { title:'Handcrafted', desc:'Every piece is made by hand in small batches. No factories, no shortcuts.' },
        { title:'Intentional',  desc:'We design with purpose — each shape, weight and finish is a considered choice.' },
        { title:'Lasting',      desc:'We use only certified sterling silver, gold vermeil, and rose gold. Made to last.' },
      ].map(v => (
        <div className="value-card" key={v.title}>
          <h3>{v.title}</h3><p>{v.desc}</p>
        </div>
      ))}
    </section>
    <Footer />
  </div>
);
export default AboutPage;
