import { useNavigate } from 'react-router-dom';
import './Categories.css';

const cats = [
  { name:'Rings',     img:'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=500&q=80' },
  { name:'Earrings',  img:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80' },
  { name:'Neckpiece', img:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80' },
  { name:'Bracelets', img:'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=500&q=80' },
];

const Categories = () => {
  const navigate = useNavigate();
  return (
    <section className="categories">
      <div className="section-head">
        <p className="eyebrow">Browse by category</p>
        <h2 className="section-title">Shop <em>collections</em></h2>
      </div>
      <div className="cat-grid">
        {cats.map(c => (
          <div className="cat-card" key={c.name} onClick={() => navigate(`/shop?category=${c.name}`)}>
            <img src={c.img} alt={c.name} />
            <div className="cat-overlay">
              <p className="cat-name">{c.name}</p>
              <p className="cat-cta">Shop Now →</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Categories;
