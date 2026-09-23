import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Story.css';
const Story = () => {
  const navigate = useNavigate();
  return (
    <section className="story">
      <div className="story-img">
        <img src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80" alt="Jewellery craftsmanship" />
      </div>
      <div className="story-text">
        <p className="eyebrow">Our promise</p>
        <h2 className="story-title">Made by hand,<br />made <em>for you</em></h2>
        <p className="story-desc">Every Nimoura piece begins as a sketch and ends as something you'll wear for years. No mass production — just care, craft, and intention poured into each design.</p>
        <button className="btn-dark" onClick={() => navigate('/about')}>Discover Our Story</button>
      </div>
    </section>
  );
};
export default Story;
