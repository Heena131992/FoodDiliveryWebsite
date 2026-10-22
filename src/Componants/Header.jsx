import React from 'react';

export default function Header() {
  return (
    <header className="top-header">
      <div className="search-box">
        <input type="text" placeholder="Search orders, customers, or food..." />
      </div>
      <div className="user-profile">
        <span className="badge-bell">🔔 3 Live Alerts</span>
        <strong>Admin</strong>
      </div>
    </header>
  );
}