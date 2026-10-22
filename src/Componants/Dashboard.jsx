// src/Components/Dashboard.jsx
import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    todayRevenue: 0,
    liveOrdersCount: 0,
    deliveredCount: 0,
    totalCustomers: 0
  });

  return (
    <div>
      {/* Top KPI Metrics */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <p>Today's Revenue</p>
          <h3>${stats.todayRevenue.toFixed(2)}</h3>
        </div>
        <div className="kpi-card">
          <p>Live Orders</p>
          <h3 style={{ color: '#ea580c' }}>{stats.liveOrdersCount}</h3>
        </div>
        <div className="kpi-card">
          <p>Delivered Today</p>
          <h3 style={{ color: '#16a34a' }}>{stats.deliveredCount}</h3>
        </div>
        <div className="kpi-card">
          <p>Active Customers</p>
          <h3>{stats.totalCustomers}</h3>
        </div>
      </div>

      {/* Split Grid */}
      <div className="dash-split-grid">
        <div className="card-box">
          <h3 style={{ marginBottom: '16px' }}>Live Kitchen Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#1042</td>
                <td>Guy Hawkins</td>
                <td>$18.50</td>
                <td><span className="badge-status bg-yellow">Preparing</span></td>
              </tr>
              <tr>
                <td>#1041</td>
                <td>Sarah Smith</td>
                <td>$34.00</td>
                <td><span className="badge-status bg-orange">Out for Delivery</span></td>
              </tr>
              <tr>
                <td>#1040</td>
                <td>John Doe</td>
                <td>$12.99</td>
                <td><span className="badge-status bg-green">Delivered</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card-box">
          <h3 style={{ marginBottom: '16px' }}>Top Popular Food</h3>
          <p style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
            <strong>1. Double Beef Burger</strong>
            <br />
            <small style={{ color: '#64748b' }}>84 orders today</small>
          </p>
          <p style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
            <strong>2. Italian Spaghetti</strong>
            <br />
            <small style={{ color: '#64748b' }}>62 orders today</small>
          </p>
          <p style={{ padding: '10px 0' }}>
            <strong>3. Lasagna Special</strong>
            <br />
            <small style={{ color: '#64748b' }}>45 orders today</small>
          </p>
        </div>
      </div>
    </div>
  );
}