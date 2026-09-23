import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handle = async () => {
    setError('');
    setLoading(true);

    if (tab === 'login') {
      const result = await login(form.email, form.password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } else {
      if (!form.name || !form.email || !form.password) {
        setError('All fields are required.');
        setLoading(false);
        return;
      }
      const result = await register(form.name, form.email, form.password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    }
    setLoading(false);
  };

  const f = key => ({
    value: form[key],
    onChange: e => setForm(f => ({ ...f, [key]: e.target.value }))
  });

  return (
    <div>
      <Navbar />
      <div className="login-page">
        <div className="login-box">
          <div className="login-logo">Nimoura</div>

          <div className="login-tabs">
            <button className={tab === 'login' ? 'active' : ''} onClick={() => { setTab('login'); setError(''); }}>Login</button>
            <button className={tab === 'register' ? 'active' : ''} onClick={() => { setTab('register'); setError(''); }}>Register</button>
          </div>

          {tab === 'register' && (
            <div className="login-field">
              <label>Full Name</label>
              <input placeholder="Your name" {...f('name')} />
            </div>
          )}

          <div className="login-field">
            <label>Email</label>
            <input type="email" placeholder="your@email.com" {...f('email')} />
          </div>

          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              {...f('password')}
              onKeyDown={e => e.key === 'Enter' && handle()}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button
            className="btn-dark login-btn"
            onClick={handle}
            disabled={loading}
          >
            {loading ? 'Please wait...' : tab === 'login' ? 'Login' : 'Create Account'}
          </button>

          {tab === 'login' && (
            <p className="admin-hint">
              Admin? Use admin@nimoura.com to access the admin panel.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;