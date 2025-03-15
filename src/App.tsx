import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import AddUser from './pages/AddUser';
import Login from './pages/Login';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Simple protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) return <div className="p-4 text-center">Loading...</div>;
    if (!session) return <Navigate to="/login" />;
    return <>{children}</>;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {session && <Navbar />}
        <main className="container mx-auto px-3 py-4 flex-grow max-w-3xl">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/scanner" element={
              <ProtectedRoute>
                <Scanner />
              </ProtectedRoute>
            } />
            <Route path="/add-user" element={
              <ProtectedRoute>
                <AddUser />
              </ProtectedRoute>
            } />
            {/* Redirect all other paths to dashboard if logged in, otherwise to login */}
            <Route path="*" element={session ? <Navigate to="/" /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-center" toastOptions={{
          duration: 2000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '14px',
            maxWidth: '80%',
            padding: '8px 16px'
          },
        }} />
      </div>
    </Router>
  );
}

export default App;