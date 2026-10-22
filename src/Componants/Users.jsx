import React, { useState, useEffect } from 'react';

export default function Users() {
  const [tab, setTab] = useState('riders');
  const [riders, setRiders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showRiderModal, setShowRiderModal] = useState(false);
  const [riderForm, setRiderForm] = useState({ name: '', phone: '', vehicleNo: '' });

  const fetchData = async () => {
    try {
      if (tab === 'riders') {
        const res = await fetch('http://localhost:5000/api/admin/riders');
        const data = await res.json();
        if (data.success) setRiders(data.data);
      } else {
        const res = await fetch('http://localhost:5000/api/admin/customers');
        const data = await res.json();
        if (data.success) setCustomers(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRider = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/riders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(riderForm)
      });
      const data = await res.json();
      if (data.success) {
        setShowRiderModal(false);
        setRiderForm({ name: '', phone: '', vehicleNo: '' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateRiderStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/admin/riders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  return (
    <div className="card-box">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setTab('riders')} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '700', background: tab === 'riders' ? '#fff7ed' : 'transparent', color: tab === 'riders' ? '#ea580c' : '#64748b' }}>
            🛵 Delivery Partners
          </button>
          <button onClick={() => setTab('customers')} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '700', background: tab === 'customers' ? '#fff7ed' : 'transparent', color: tab === 'customers' ? '#ea580c' : '#64748b' }}>
            👥 Registered Customers
          </button>
        </div>
        {tab === 'riders' && (
          <button onClick={() => setShowRiderModal(true)} style={{ background: '#ff9800', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
            + Register Rider
          </button>
        )}
      </div>

      {tab === 'riders' ? (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr><th>Rider</th><th>Phone</th><th>Vehicle No</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {riders.map(r => (
                <tr key={r._id}>
                  <td><strong>{r.name}</strong></td>
                  <td>{r.phone}</td>
                  <td><code>{r.vehicleNo}</code></td>
                  <td><span className="badge-status bg-green">{r.status}</span></td>
                  <td>
                    <select value={r.status} onChange={(e) => updateRiderStatus(r._id, e.target.value)} style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <option value="Available">Available</option>
                      <option value="On Delivery">On Delivery</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr><th>Customer</th><th>Phone</th><th>Address</th><th>Orders</th><th>Spent</th></tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c._id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c._id}</td>
                  <td>{c.address}</td>
                  <td>{c.totalOrders}</td>
                  <td><strong>${Number(c.totalSpent).toFixed(2)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showRiderModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '400px', position: 'relative' }}>
            <span onClick={() => setShowRiderModal(false)} style={{ position: 'absolute', right: '16px', top: '12px', cursor: 'pointer', fontSize: '20px' }}>&times;</span>
            <h3 style={{ marginBottom: '14px' }}>Register Delivery Rider</h3>
            <form onSubmit={handleAddRider} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Full Name" required style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} value={riderForm.name} onChange={(e) => setRiderForm({ ...riderForm, name: e.target.value })} />
              <input type="tel" placeholder="Phone" required style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} value={riderForm.phone} onChange={(e) => setRiderForm({ ...riderForm, phone: e.target.value })} />
              <input type="text" placeholder="Vehicle Plate" required style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} value={riderForm.vehicleNo} onChange={(e) => setRiderForm({ ...riderForm, vehicleNo: e.target.value })} />
              <button type="submit" style={{ marginTop: '10px', background: '#ff9800', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Register</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}