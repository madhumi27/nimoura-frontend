import { useNavigate } from 'react-router-dom';
import './Footer.css';
const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo">Nimoura</span>
          <p>Handcrafted jewellery made with intention. Each piece is a quiet celebration of the woman who wears it.</p>
          <div className="socials">
  <a href="https://instagram.com/nimoura_jewels" target="_blank" rel="noreferrer">
    <i className="ti ti-brand-instagram" title="Instagram"></i>
  </a>
  <a href="https://facebook.com/nimoura" target="_blank" rel="noreferrer">
    <i className="ti ti-brand-facebook" title="Facebook"></i>
  </a>
  <a href="https://pinterest.com/nimoura" target="_blank" rel="noreferrer">
    <i className="ti ti-brand-pinterest" title="Pinterest"></i>
  </a>
</div>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            {['Earrings','Bangles','Rings','Bracelets','Anklets','Hipchain'].map(c => (
              <li key={c} onClick={() => navigate(`/shop?category=${c}`)}>{c}</li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <ul>
            <li>Shipping Info</li>
            <li >Size Guide</li>
            <li onClick={() => navigate('/care')}>Care Instructions</li>
            <li onClick={() => navigate('/contact')}>Contact Us</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>About</h4>
          <ul>
            <li onClick={() => navigate('/about')}>Our Story</li>
            <li >Sustainability</li>
            <li  onClick={() => window.open('https://instagram.com/nimoura_jewels', '_blank')}>Instagram</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Nimoura. All rights reserved.</p>
        <p style={{fontSize:11,color:'#c4b4a4'}}>Made with ♡ in India</p>
      </div>
    </footer>
  );
};
export default Footer;
