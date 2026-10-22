import React, { useState, useEffect } from 'react';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/reviews');
      const data = await res.json();
      if (data.success) setReviews(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFeature = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/admin/reviews/${id}/toggle-feature`, { method: 'PUT' });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Delete review permanently?')) return;
    try {
      await fetch(`http://localhost:5000/api/admin/reviews/${id}`, { method: 'DELETE' });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2>Customer Feedback & Reviews</h2>
        <p style={{ color: '#64748b', fontSize: '13px' }}>Feature high quality testimonials on the homepage</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {reviews.map(r => (
          <div key={r._id} className="card-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <img src={r.avatar} alt={r.customerName} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <strong>{r.customerName}</strong>
                  <div style={{ color: '#ff9800', fontSize: '13px' }}>{'★'.repeat(r.rating)}</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>"{r.comment}"</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '14px' }}>
              <button
                onClick={() => toggleFeature(r._id)}
                style={{ border: 'none', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', background: r.isFeatured ? '#dcfce7' : '#f1f5f9', color: r.isFeatured ? '#15803d' : '#64748b' }}
              >
                {r.isFeatured ? '★ Featured on Home' : '☆ Not Featured'}
              </button>
              <button onClick={() => deleteReview(r._id)} style={{ border: 'none', background: 'transparent', color: '#ef4444', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}