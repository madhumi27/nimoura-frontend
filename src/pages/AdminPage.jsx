import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/products';
import api, { addProduct, createPromoCode, deactivatePromoCode, deleteProduct, getAllOrders, getAllProducts, getAllPromoCodes, updateOrderStatus, uploadImage } from '../services/api';
import './AdminPage.css';

const statusColors = {
  PENDING:   { bg: '#fff8e1', color: '#f59e0b' },
  CONFIRMED: { bg: '#e8f5e9', color: '#2a7a4b' },
  SHIPPED:   { bg: '#e3f2fd', color: '#1565c0' },
  DELIVERED: { bg: '#f3e8ff', color: '#7c3aed' },
  CANCELLED: { bg: '#fff0f0', color: '#c44' },
};

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [tab, setTab] = useState('products');
  const [saved, setSaved] = useState('');
  const [imgMode, setImgMode] = useState('upload');
  const [uploading, setUploading] = useState(false);
  const [restockQty, setRestockQty] = useState({});
  const [form, setForm] = useState({
    name: '', category: 'Earrings', price: '',
    originalPrice: '', badge: '', imageUrl: '', description: '', stock: ''
  });
  const [promoCodes, setPromoCodes] = useState([]);
  const [promoForm, setPromoForm] = useState({
    code: '', discountType: 'PERCENTAGE', discountValue: '', minimumOrder: '', usageLimit: ''
  });
  const [promoSaved, setPromoSaved] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchPromoCodes();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await getAllProducts();
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchPromoCodes = async () => {
    try {
      const res = await getAllPromoCodes();
      setPromoCodes(res.data);
    } catch (err) {
      console.error('Failed to fetch promo codes', err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB!'); return; }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadImage(formData);
      setForm(f => ({ ...f, imageUrl: res.data.imageUrl }));
    } catch (err) {
      alert('Image upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.price) { setSaved('❌ Name and price are required.'); return; }
    try {
      const payload = {
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        badge: form.badge || null,
        imageUrl: form.imageUrl || null,
        description: form.description || null,
        stock: form.stock ? parseInt(form.stock) : 0,
      };
      await addProduct(payload);
      setSaved('✓ Product added successfully!');
      setTimeout(() => setSaved(''), 3000);
      setForm({ name: '', category: 'Earrings', price: '', originalPrice: '', badge: '', imageUrl: '', description: '', stock: '' });
      fetchProducts();
      setTab('products');
    } catch (err) {
      setSaved('❌ Failed to add product. Try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(p => p.filter(prod => prod.id !== id));
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const handleRestock = async (productId) => {
    const qty = parseInt(restockQty[productId]);
    if (!qty || qty < 1) { alert('Enter a valid quantity!'); return; }
    try {
      await api.put(`/api/products/${productId}/restock?quantity=${qty}`);
      setRestockQty(prev => ({ ...prev, [productId]: '' }));
      fetchProducts();
    } catch (err) {
      alert('Restock failed. Try again.');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Failed to update order status.');
    }
  };

  const handleCreatePromo = async () => {
    if (!promoForm.code || !promoForm.discountValue) { setPromoSaved('❌ Code and discount value are required.'); return; }
    try {
      await createPromoCode({
        code: promoForm.code.toUpperCase(),
        discountType: promoForm.discountType,
        discountValue: parseFloat(promoForm.discountValue),
        minimumOrder: promoForm.minimumOrder ? parseFloat(promoForm.minimumOrder) : null,
        usageLimit: promoForm.usageLimit ? parseInt(promoForm.usageLimit) : null,
      });
      setPromoSaved('✓ Promo code created!');
      setTimeout(() => setPromoSaved(''), 3000);
      setPromoForm({ code: '', discountType: 'PERCENTAGE', discountValue: '', minimumOrder: '', usageLimit: '' });
      fetchPromoCodes();
    } catch (err) {
      setPromoSaved('❌ ' + (err.response?.data?.error || 'Failed to create promo code'));
    }
  };

  const handleDeactivatePromo = async (id) => {
    if (!window.confirm('Deactivate this promo code?')) return;
    try {
      await deactivatePromoCode(id);
      fetchPromoCodes();
    } catch (err) {
      alert('Failed to deactivate promo code.');
    }
  };

  if (!user || !user.isAdmin) return (
    <div>
      <Navbar />
      <div className="admin-denied">
        <i className="ti ti-lock"></i>
        <h2>Admin Access Only</h2>
        <p>Please login with admin credentials.</p>
        <button className="btn-dark" onClick={() => navigate('/login')}>Go to Login</button>
      </div>
      <Footer />
    </div>
  );

  const f = key => ({
    value: form[key],
    onChange: e => setForm(f => ({ ...f, [key]: e.target.value }))
  });

  return (
    <div>
      <Navbar />
      <div className="admin-page">
        <div className="admin-header">
          <h1 className="admin-title">Admin <em>Panel</em></h1>
          <p className="admin-sub">Welcome back, {user.name}</p>
        </div>

        <div className="admin-tabs">
          <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>
            All Products ({products.length})
          </button>
          <button className={tab === 'add' ? 'active' : ''} onClick={() => setTab('add')}>
            + Add New Product
          </button>
          <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>
            All Orders ({orders.length})
          </button>
          <button className={tab === 'promo' ? 'active' : ''} onClick={() => setTab('promo')}>
            Promo Codes
          </button>
        </div>

        {/* Add Product Tab */}
        {tab === 'add' && (
          <div className="admin-form">
            <h3>Add New Product</h3>
            <div className="admin-form-grid">
              <div className="af-group full">
                <label>Product Name *</label>
                <input placeholder="e.g. Gold Hoop Earrings" {...f('name')} />
              </div>
              <div className="af-group">
                <label>Category *</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.filter(c => c !== 'All Products' && c !== 'SALE').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="af-group">
                <label>Badge</label>
                <select value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}>
                  <option value="">None</option>
                  <option value="SALE">SALE</option>
                  <option value="New">New</option>
                </select>
              </div>
              <div className="af-group">
                <label>Sale Price (₹) *</label>
                <input type="number" placeholder="e.g. 299" {...f('price')} />
              </div>
              <div className="af-group">
                <label>Original Price (₹)</label>
                <input type="number" placeholder="e.g. 599 (optional)" {...f('originalPrice')} />
              </div>
              <div className="af-group">
                <label>Stock Quantity *</label>
                <input type="number" placeholder="e.g. 10" {...f('stock')} />
              </div>

              {/* Image Upload */}
              <div className="af-group full">
                <label>Product Image</label>
                <div className="img-toggle">
                  <button className={imgMode === 'url' ? 'active' : ''} onClick={() => setImgMode('url')} type="button">Paste URL</button>
                  <button className={imgMode === 'upload' ? 'active' : ''} onClick={() => setImgMode('upload')} type="button">Upload from Device</button>
                </div>
                {imgMode === 'url' ? (
                  <input placeholder="https://... paste image link here" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
                ) : (
                  <div className="upload-area">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" id="img-upload" />
                    <label htmlFor="img-upload" className="upload-label">
                      {uploading ? <span>Uploading...</span> : (
                        <><i className="ti ti-cloud-upload"></i><span>Click to select image</span><small>JPG, PNG, WEBP — max 5MB</small></>
                      )}
                    </label>
                  </div>
                )}
                {form.imageUrl && (
                  <div className="img-preview-wrap">
<img src={getImageUrl(form.imageUrl)} alt="preview" className="img-preview" />
                    <button className="img-remove" onClick={() => setForm(f => ({ ...f, imageUrl: '' }))} type="button">✕</button>
                  </div>
                )}
              </div>

              <div className="af-group full">
                <label>Description</label>
                <input placeholder="Short product description" {...f('description')} />
              </div>
            </div>
            {saved && <p className={`admin-saved ${saved.includes('❌') ? 'err' : ''}`}>{saved}</p>}
            <button className="btn-dark admin-add-btn" onClick={handleAdd}>Add Product</button>
          </div>
        )}

        {/* Products List Tab */}
        {tab === 'products' && (
          <div className="admin-product-list">
            {loadingProducts ? (
              <p style={{ padding: 32, color: 'var(--brown-muted)' }}>Loading products...</p>
            ) : products.length === 0 ? (
              <p style={{ padding: 32, color: 'var(--brown-muted)' }}>No products yet. Add your first product!</p>
            ) : (
              products.map(p => (
                <div className="admin-prod-row" key={p.id}>
                  <img
                  src={getImageUrl(p.imageUrl)}
                    alt={p.name}
                    onError={e => e.target.style.display = 'none'}
                  />
                  <div className="apr-info">
                    <h4>{p.name}</h4>
                    <p>{p.category} {p.badge && <span className="apr-badge">{p.badge}</span>}</p>
                    <p className={`apr-stock-label ${p.stock === 0 ? 'out' : p.stock <= 5 ? 'low' : 'in'}`}>
                      {p.stock === 0 ? '❌ Out of Stock' : p.stock <= 5 ? `⚠️ Low Stock: ${p.stock} left` : `✅ In Stock: ${p.stock}`}
                    </p>
                  </div>
                  <div className="apr-price">
                    <span className="apr-current">₹{p.price}</span>
                    {p.originalPrice && <del className="apr-orig">₹{p.originalPrice}</del>}
                  </div>
                  <div className="apr-restock">
                    <input
                      type="number"
                      placeholder="Add qty"
                      className="restock-input"
                      value={restockQty[p.id] || ''}
                      onChange={e => setRestockQty(prev => ({ ...prev, [p.id]: e.target.value }))}
                      min="1"
                    />
                    <button className="restock-btn" onClick={() => handleRestock(p.id)}>
                      Restock
                    </button>
                  </div>
                  <button className="apr-delete" onClick={() => handleDelete(p.id)}>
                    <i className="ti ti-trash"></i> Delete
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div className="admin-orders">
            {loadingOrders ? (
              <p style={{ padding: 32, color: 'var(--brown-muted)' }}>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p style={{ padding: 32, color: 'var(--brown-muted)' }}>No orders yet.</p>
            ) : (
              orders.map(order => {
                const statusStyle = statusColors[order.status] || statusColors.PENDING;
                return (
                  <div className="admin-order-card" key={order.id}>
                    <div className="aoc-header">
                      <div>
                        <p className="aoc-id">Order #{order.id}</p>
                        <p className="aoc-customer">{order.fullName} · {order.email} · {order.phone}</p>
                        <p className="aoc-address">{order.address}, {order.city}, {order.pincode}</p>
                        {order.promoCode && (
  <p className="aoc-promo">
    🎟️ Promo: <strong>{order.promoCode}</strong> — Discount: ₹{order.discountAmount}
  </p>
)}
                        <p className="aoc-date">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="aoc-right">
                        <span className="aoc-total">₹{order.grandTotal}</span>
                        <div className="aoc-status" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                          {order.status}
                        </div>
                        <select className="aoc-status-select" value={order.status} onChange={e => handleStatusChange(order.id, e.target.value)}>
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                    </div>
                    <div className="aoc-items">
                      {order.items?.map(item => (
                        <div className="aoc-item" key={item.id}>
                          <img
src={getImageUrl(item.product?.imageUrl)}
                            alt={item.product?.name}
                            onError={e => e.target.style.display = 'none'}
                          />
                          <span>{item.product?.name}</span>
                          <span>Qty: {item.quantity}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Promo Codes Tab */}
        {tab === 'promo' && (
          <div className="admin-promo">
            <div className="admin-form">
              <h3>Create Promo Code</h3>
              <div className="admin-form-grid">
                <div className="af-group">
                  <label>Code *</label>
                  <input placeholder="e.g. NIMOURA10" value={promoForm.code} onChange={e => setPromoForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} />
                </div>
                <div className="af-group">
                  <label>Discount Type *</label>
                  <select value={promoForm.discountType} onChange={e => setPromoForm(f => ({ ...f, discountType: e.target.value }))}>
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>
                <div className="af-group">
                  <label>Discount Value *</label>
                  <input type="number" placeholder={promoForm.discountType === 'PERCENTAGE' ? 'e.g. 10 for 10%' : 'e.g. 100 for ₹100'} value={promoForm.discountValue} onChange={e => setPromoForm(f => ({ ...f, discountValue: e.target.value }))} />
                </div>
                <div className="af-group">
                  <label>Minimum Order (₹)</label>
                  <input type="number" placeholder="e.g. 500 (optional)" value={promoForm.minimumOrder} onChange={e => setPromoForm(f => ({ ...f, minimumOrder: e.target.value }))} />
                </div>
                <div className="af-group">
                  <label>Usage Limit</label>
                  <input type="number" placeholder="e.g. 100 (optional)" value={promoForm.usageLimit} onChange={e => setPromoForm(f => ({ ...f, usageLimit: e.target.value }))} />
                </div>
              </div>
              {promoSaved && <p className={`admin-saved ${promoSaved.includes('❌') ? 'err' : ''}`}>{promoSaved}</p>}
              <button className="btn-dark admin-add-btn" onClick={handleCreatePromo}>Create Promo Code</button>
            </div>

            <div className="promo-list">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 300, marginBottom: 16 }}>All Promo Codes</h3>
              {promoCodes.length === 0 ? (
                <p style={{ color: 'var(--brown-muted)', fontSize: 13 }}>No promo codes yet.</p>
              ) : (
                promoCodes.map(promo => (
                  <div className="promo-row" key={promo.id}>
                    <div className="promo-row-info">
                      <span className="promo-code-tag">{promo.code}</span>
                      <span className="promo-type">{promo.discountType === 'PERCENTAGE' ? `${promo.discountValue}% off` : `₹${promo.discountValue} off`}</span>
                      {promo.minimumOrder && <span className="promo-min">Min order: ₹{promo.minimumOrder}</span>}
                      <span className="promo-usage">Used: {promo.usedCount}{promo.usageLimit ? `/${promo.usageLimit}` : ''}</span>
                    </div>
                    <div className="promo-row-right">
                      <span className={`promo-status ${promo.active ? 'active' : 'inactive'}`}>{promo.active ? 'Active' : 'Inactive'}</span>
                      {promo.active && (
                        <button className="apr-delete" onClick={() => handleDeactivatePromo(promo.id)}>
                          <i className="ti ti-x"></i> Deactivate
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;