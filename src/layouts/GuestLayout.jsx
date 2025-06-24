import { Outlet } from 'react-router-dom';
import GuestSidebar from '../components/GuestSidebar';

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <GuestSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
