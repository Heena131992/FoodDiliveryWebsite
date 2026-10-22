import React, { useState } from 'react';
import './App.css';


import Sidebar from "./Componants/Sidebar";
import Header from "./Componants/Header";
import Dashboard from "./Componants/Dashboard";
import Orders from "./Componants/Orders";
import Menu from "./Componants/Menu";
import Users from "./Componants/Users";
import Reviews from "./Componants/Reviews";
import Marketing from "./Componants/Marketing";
import Settings from "./Componants/Settings";

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-wrapper">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="main-wrapper">
        <Header />

        <main className="content-area">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'orders' && <Orders />}
          {activeTab === 'menu' && <Menu />}
          {activeTab === 'users' && <Users />}
          {activeTab === 'reviews' && <Reviews />}
          {activeTab === 'marketing' && <Marketing />}
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}