import React, { useState, useEffect } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    restaurantName: '',
    contactPhone: '',
    deliveryFee: 0,
    minOrderForFreeDelivery: 0,
    taxPercent: 0,
    address: '',
    isStoreOpen: true
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) setSettings(data.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) alert('Store settings saved successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card-box" style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
        <h2>Restaurant Operational Settings</h2>
        <p style={{ color: '#64748b', fontSize: '13px' }}>Configure store availability and delivery charges</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '16px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
          <div>
            <strong>Online Store Ordering</strong>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Turn off to pause taking online orders temporarily</p>
          </div>
          <input
            type="checkbox"
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            checked={settings.isStoreOpen}
            onChange={(e) => setSettings({ ...settings, isStoreOpen: e.target.checked })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Restaurant Name</label>
            <input type="text" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '4px' }} value={settings.restaurantName} onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Support Phone</label>
            <input type="text" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '4px' }} value={settings.contactPhone} onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Base Delivery Fee ($)</label>
            <input type="number" step="0.01" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '4px' }} value={settings.deliveryFee} onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })} />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Free Delivery Threshold ($)</label>
            <input type="number" step="0.01" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '4px' }} value={settings.minOrderForFreeDelivery} onChange={(e) => setSettings({ ...settings, minOrderForFreeDelivery: Number(e.target.value) })} />
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Physical Store Address</label>
          <input type="text" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '4px' }} value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
        </div>

        <button type="submit" style={{ marginTop: '24px', background: '#ff9800', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>
          Save Configuration
        </button>
      </form>
    </div>
  );
}