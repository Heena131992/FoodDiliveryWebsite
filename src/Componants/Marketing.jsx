import React, { useState, useEffect } from 'react';

export default function Marketing() {
  const [tab, setTab] = useState('coupons');
  const [coupons, setCoupons] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState('');

  const fetchData = async () => {
    try {
      if (tab === 'coupons') {
        const res = await fetch('http://localhost:5000/api/admin/coupons');
        const data = await res.json();
        if (data.success) setCoupons(data.data);
      } else {
        const res = await fetch('http://localhost:5000/api/admin/subscribers');
        const data = await res.json();
        if (data.success) setSubscribers(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.toUpperCase(), discountPercent: Number(discount) })
      });
      const data = await res.json();
      if (data.success) {
        setCouponCode('');
        setDiscount('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCoupon = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/admin/coupons/${id}/toggle`, { method: 'PUT' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    if (subscribers.length === 0) return alert('No emails to export');
    const content = 'data:text/csv;charset=utf-8,Email,Date\n' + subscribers.map(s => `${s.email},${new Date(s.subscribedAt).toISOString()}`).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(content);
    link.download = 'subscribers.csv';
    link.click();
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  return (
    <div className="card-box">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setTab('coupons')} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '700', background: tab === 'coupons' ? '#fff7ed' : 'transparent', color: tab === 'coupons' ? '#ea580c' : '#64748b' }}>
            🏷️ Discount Coupons
          </button>
          <button onClick={() => setTab('subscribers')} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '700', background: tab === 'subscribers' ? '#fff7ed' : 'transparent', color: tab === 'subscribers' ? '#ea580c' : '#64748b' }}>
            📬 Newsletter Emails
          </button>
        </div>
        {tab === 'subscribers' && (
          <button onClick={exportCSV} style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', background: '#f8fafc', fontWeight: '600' }}>
            📥 Export CSV
          </button>
        )}
      </div>

      {tab === 'coupons' ? (
        <div>
          <form onSubmit={handleCreateCoupon} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input type="text" placeholder="COUPON CODE (e.g. FOODIE20)" required style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', textTransform: 'uppercase' }} value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
            <input type="number" placeholder="Discount %" min="1" max="100" required style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '120px' }} value={discount} onChange={(e) => setDiscount(e.target.value)} />
            <button type="submit" style={{ background: '#ff9800', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Add Coupon</button>
          </form>

          <table>
            <thead>
              <tr><th>Code</th><th>Discount</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c._id}>
                  <td><code style={{ background: '#ffedd5', color: '#c2410c', padding: '4px 8px', borderRadius: '4px', fontWeight: '700' }}>{c.code}</code></td>
                  <td><strong>{c.discountPercent}% OFF</strong></td>
                  <td><span className={`badge-status ${c.isActive ? 'bg-green' : 'bg-yellow'}`}>{c.isActive ? 'Active' : 'Disabled'}</span></td>
                  <td>
                    <button onClick={() => toggleCoupon(c._id)} style={{ border: '1px solid #cbd5e1', background: 'transparent', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer' }}>
                      {c.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <table>
          <thead>
            <tr><th>#</th><th>Subscriber Email</th><th>Joined Date</th></tr>
          </thead>
          <tbody>
            {subscribers.map((s, idx) => (
              <tr key={s._id}>
                <td>{idx + 1}</td>
                <td><strong>{s.email}</strong></td>
                <td>{new Date(s.subscribedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}