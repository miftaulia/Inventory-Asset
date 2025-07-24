import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
