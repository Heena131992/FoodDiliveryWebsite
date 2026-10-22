import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'orders', label: '🛍️ Live Orders' },
    { id: 'menu', label: '🍔 Food Catalog' },
    { id: 'users', label: '👥 Staff & Riders' },
    { id: 'reviews', label: '⭐ Reviews' },
    { id: 'marketing', label: '🏷️ Marketing' },
    { id: 'settings', label: '⚙️ Settings' }
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="brand">🍕 Foodie Admin</div>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={activeTab === item.id ? 'active' : ''}
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-footer">
        <button className="btn-logout" onClick={() => alert('Logged out!')}>
          Log Out
        </button>
      </div>
    </aside>
  );
}