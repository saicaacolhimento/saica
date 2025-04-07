import { Outlet } from 'react-router-dom';
import { Banner } from '@/components/Banner';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Banner />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
} 