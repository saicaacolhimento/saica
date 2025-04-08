import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
} 