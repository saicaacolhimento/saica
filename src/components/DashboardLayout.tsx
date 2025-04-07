
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import NotificationsPanel from './NotificationsPanel';

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="md:hidden">
          <MobileMenu />
        </div>
        <main className="flex-1 p-4">
          <Navigation />
          <div className="mt-6">
            <Outlet />
          </div>
        </main>
        <NotificationsPanel />
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
