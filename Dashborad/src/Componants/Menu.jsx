import React, { useState, useEffect } from 'react';

export default function Menu() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Burger', price: '', image: '' });

  const fetchMenu = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/menu');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price: Number(formData.price) })
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setFormData({ name: '', category: 'Burger', price: '', image: '' });
        fetchMenu();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStock = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/admin/menu/${id}/toggle-stock`, { method: 'PUT' });
      fetchMenu();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this food item?')) return;
    try {
      await fetch(`http://localhost:5000/api/admin/menu/${id}`, { method: 'DELETE' });
      fetchMenu();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2>Menu & Catalog Management</h2>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Control dishes, availability, and prices</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ background: '#ff9800', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          + Add New Item
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
        {items.map(item => (
          <div key={item._id} className="card-box" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <img src={item.image} alt={item.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'; }} />
            <div style={{ padding: '16px', flex: 1 }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#ff9800', fontWeight: '700' }}>{item.category}</span>
              <h4 style={{ margin: '4px 0 8px 0' }}>{item.name}</h4>
              <div style={{ fontSize: '18px', fontWeight: '800' }}>${Number(item.price).toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
              <button
                onClick={() => toggleStock(item._id)}
                style={{ border: 'none', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', background: item.isAvailable ? '#dcfce7' : '#fee2e2', color: item.isAvailable ? '#15803d' : '#b91c1c' }}
              >
                {item.isAvailable ? '● In Stock' : '✕ Out of Stock'}
              </button>
              <button onClick={() => deleteItem(item._id)} style={{ border: 'none', background: 'transparent', color: '#ef4444', fontWeight: '600', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '420px', position: 'relative' }}>
            <span onClick={() => setShowModal(false)} style={{ position: 'absolute', right: '16px', top: '12px', cursor: 'pointer', fontSize: '20px' }}>&times;</span>
            <h3 style={{ marginBottom: '16px' }}>Add New Dish</h3>
            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Name</label>
                <input type="text" required style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '4px' }} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Category</label>
                <select style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '4px' }} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <option value="Burger">Burger</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Fast Food">Fast Food</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Price ($)</label>
                <input type="number" step="0.01" required style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '4px' }} value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Image URL</label>
                <input type="url" required style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '4px' }} value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
              </div>
              <button type="submit" style={{ marginTop: '10px', background: '#ff9800', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Save Food Item</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}