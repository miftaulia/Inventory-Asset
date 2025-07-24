import React, { useEffect, useState, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import supabase from './supabaseClient';
import './assets/tailwind.css';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import GuestLayout from './layouts/GuestLayout';

// Auth Pages
const Login = React.lazy(() => import('./pages/Auth/Login'));
const Register = React.lazy(() => import('./pages/Auth/Register'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const ListBarang = React.lazy(() => import('./pages/admin/assets/ListBarang'));
const AddBarang = React.lazy(() => import('./pages/admin/assets/AddBarang'));
const EditBarang = React.lazy(() => import('./pages/admin/assets/EditBarang'));
const HapusBarang = React.lazy(() => import('./pages/admin/assets/HapusBarang'));
const AdminPeminjamanAset = React.lazy(() => import('./pages/admin/PeminjamanAset'));
const Laporan = React.lazy(() => import('./pages/admin/Laporan'));
const Kategori = React.lazy(() => import('./pages/admin/kategori/Kategori'));
const AddKategori = React.lazy(() => import('./pages/admin/kategori/AddKategori'));
const EditKategori = React.lazy(() => import('./pages/admin/kategori/EditKategori'));
const KelolaUser = React.lazy(() => import('./pages/admin/kelolaUser'));
const EditProfileAdmin = React.lazy(() => import('./pages/admin/EditProfile'));
const AdminFAQ = React.lazy(() => import('./pages/admin/AdminFAQ'));
const AdminMessages = React.lazy(() => import('./pages/admin/AdminMessages'));

// Guest Pages
const GuestDashboard = React.lazy(() => import('./pages/guest/Dashboard'));
const GuestPeminjamanAset = React.lazy(() => import('./pages/guest/peminjaman/PeminjamanAset'));
const Riwayat = React.lazy(() => import('./pages/guest/peminjaman/riwayat'));
const EditProfile = React.lazy(() => import('./pages/guest/EditProfile'));
const GuestFAQ = React.lazy(() => import('./pages/guest/GuestFAQ'));
const Bantuan = React.lazy(() => import('./pages/guest/laporan'));

// Landing Page
const LandingPage = React.lazy(() => import('./landing/LandingPage'));

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user || null;
      setUser(sessionUser);
      setRole(sessionUser?.user_metadata?.role || null);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null;
      setUser(user);
      setRole(user?.user_metadata?.role || null);
    });

    return () => {
      listener.subscription?.unsubscribe();
    };
  }, []);

  if (loading) return <div className="p-4">Loading app...</div>;

  return (
    <Suspense fallback={<div className="p-4">Loading page...</div>}>
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            user ? (
              role === 'admin' ? <Navigate to="/admin/dashboard" /> :
              <Navigate to="/guest/dashboard" />
            ) : (
              <LandingPage />
            )
          }
        />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        </Route>

        {/* Admin Routes */}
        {user && role === 'admin' && (
          <Route element={<MainLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/assets" element={<ListBarang />} />
            <Route path="/admin/assets/add" element={<AddBarang />} />
            <Route path="/admin/assets/edit/:id" element={<EditBarang />} />
            <Route path="/admin/assets/delete/:id" element={<HapusBarang />} />
            <Route path="/admin/Peminjaman" element={<AdminPeminjamanAset />} />
            <Route path="/admin/Laporan" element={<Laporan />} />
            <Route path="/admin/kategori" element={<Kategori />} />
            <Route path="/admin/kategori/add" element={<AddKategori />} />
            <Route path="/admin/kategori/edit/:id" element={<EditKategori />} />
            <Route path="/admin/kelola-user" element={<KelolaUser />} />
            <Route path="/admin/EditProfile" element={<EditProfileAdmin />} />
            <Route path="/admin/faq" element={<AdminFAQ />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
          </Route>
        )}

        {/* Guest Routes */}
        {user && role === 'guest' && (
          <Route element={<GuestLayout />}>
            <Route path="/guest/dashboard" element={<GuestDashboard />} />
            <Route path="/guest/peminjaman" element={<GuestPeminjamanAset />} />
            <Route path="/guest/riwayat" element={<Riwayat />} />
            <Route path="/guest/edit-profile" element={<EditProfile />} />
            <Route path="/guest/faq" element={<GuestFAQ />} />
            <Route path="/guest/bantuan" element={<Bantuan />} />
            
          </Route>
        )}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default App;
