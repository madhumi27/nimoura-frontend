import React, { useState } from 'react';
import './Newsletter.css';
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return (
    <div className="newsletter">
      <p className="eyebrow">Join the Nimoura circle</p>
      <h2 className="nl-title">First to know, always</h2>
      <p className="nl-sub">New drops, exclusive offers & jewellery stories — right to your inbox.</p>
      {done ? <p className="nl-thanks">You're in! ✦ Thank you for subscribing.</p> : (
        <div className="nl-form">
          <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          <button onClick={() => email && setDone(true)}>Subscribe</button>
        </div>
      )}
    </div>
  );
};
export default Newsletter;
