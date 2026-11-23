import React, { useState, useEffect } from 'react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card-box">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Live Orders Pipeline</h2>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Incoming kitchen & delivery tracking</p>
        </div>
        <button onClick={fetchOrders} style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', background: '#f8fafc', fontWeight: '600' }}>
          🔄 Refresh
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', color: '#94a3b8' }}>No live orders found.</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order._id}>
                  <td><strong>#{order._id.slice(-6)}</strong></td>
                  <td>
                    <div><strong>{order.customer?.name}</strong></div>
                    <small style={{ color: '#64748b' }}>{order.customer?.phone}</small>
                  </td>
                  <td>{order.items?.map(i => `${i.name} (x${i.quantity})`).join(', ')}</td>
                  <td><strong>${Number(order.totalAmount).toFixed(2)}</strong></td>
                  <td><span className="badge-status" style={{ background: '#f1f5f9' }}>{order.paymentType}</span></td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontWeight: '600' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      style={{ background: '#ff9800', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '450px', position: 'relative' }}>
            <span onClick={() => setSelectedOrder(null)} style={{ position: 'absolute', right: '16px', top: '12px', cursor: 'pointer', fontSize: '20px' }}>&times;</span>
            <h3 style={{ marginBottom: '14px' }}>Order Details #{selectedOrder._id.slice(-6)}</h3>
            <p><strong>Customer:</strong> {selectedOrder.customer?.name} ({selectedOrder.customer?.phone})</p>
            <p style={{ marginTop: '8px' }}><strong>Address:</strong> {selectedOrder.customer?.address}</p>
            <div style={{ margin: '14px 0', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
              <strong>Items:</strong>
              <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                {selectedOrder.items?.map((it, idx) => (
                  <li key={idx}>{it.name} &times; {it.quantity} — ${(it.price * it.quantity).toFixed(2)}</li>
                ))}
              </ul>
            </div>
            <p style={{ fontSize: '16px' }}><strong>Total:</strong> ${Number(selectedOrder.totalAmount).toFixed(2)} via {selectedOrder.paymentType}</p>
          </div>
        </div>
      )}
    </div>
  );
}