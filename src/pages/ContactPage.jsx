import { useState } from 'react';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';
import './ContactPage.css';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (!form.message.trim()) e.message = 'Required';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitted(true);
  };

  const f = key => ({
    value: form[key],
    onChange: e => {
      setForm(f => ({ ...f, [key]: e.target.value }));
      setErrors(er => ({ ...er, [key]: '' }));
    }
  });

  return (
    <div>
      <Navbar />
      <div className="contact-page">

        {/* Header */}
        <div className="contact-header">
          <p className="eyebrow">Get in touch</p>
          <h1 className="contact-title">Contact <em>Us</em></h1>
          <p className="contact-sub">We'd love to hear from you — questions, custom orders, or just to say hello!</p>
        </div>

        <div className="contact-body">
          {/* Contact Info */}
          <div className="contact-info">
            <div className="contact-info-card">
              <i className="ti ti-brand-instagram"></i>
              <div>
                <h4>Instagram</h4>
                <p>@nimoura_jewels</p>
                <a href="https://instagram.com/nimoura_jewels" target="_blank" rel="noreferrer">
                  Follow us →
                </a>
              </div>
            </div>
            <div className="contact-info-card">
              <i className="ti ti-mail"></i>
              <div>
                <h4>Email</h4>
                <p>nimoura@gmail.com</p>
                <a href="mailto:nimoura@gmail.com">Send email →</a>
              </div>
            </div>
            <div className="contact-info-card">
              <i className="ti ti-clock"></i>
              <div>
                <h4>Response Time</h4>
                <p>We reply within 24 hours</p>
              </div>
            </div>
            <div className="contact-info-card">
              <i className="ti ti-map-pin"></i>
              <div>
                <h4>Location</h4>
                <p>Chennai, Tamil Nadu, India</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrap">
            {submitted ? (
              <div className="contact-success">
                <i className="ti ti-circle-check"></i>
                <h2>Message Sent!</h2>
                <p>Thank you for reaching out, {form.name}! We'll get back to you within 24 hours.</p>
                <button className="btn-dark" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h3>Send us a message</h3>
                <div className="contact-form">
                  <div className={`cf-group ${errors.name ? 'err' : ''}`}>
                    <label>Your Name *</label>
                    <input placeholder="Your name" {...f('name')} />
                    {errors.name && <span className="err-msg">{errors.name}</span>}
                  </div>
                  <div className={`cf-group ${errors.email ? 'err' : ''}`}>
                    <label>Email *</label>
                    <input type="email" placeholder="your@email.com" {...f('email')} />
                    {errors.email && <span className="err-msg">{errors.email}</span>}
                  </div>
                  <div className="cf-group full">
                    <label>Subject</label>
                    <input placeholder="e.g. Custom order enquiry" {...f('subject')} />
                  </div>
                  <div className={`cf-group full ${errors.message ? 'err' : ''}`}>
                    <label>Message *</label>
                    <textarea
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      {...f('message')}
                    />
                    {errors.message && <span className="err-msg">{errors.message}</span>}
                  </div>
                </div>
                <button className="btn-dark contact-submit" onClick={handleSubmit}>
                  Send Message
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;