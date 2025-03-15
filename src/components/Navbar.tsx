import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Users, UserPlus, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <QrCode className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">QR Check-In</span>
              <p className="text-xs text-gray-500">Smart Attendance System</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <Users className="h-5 w-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            
            <Link
              to="/scanner"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <QrCode className="h-5 w-5" />
              <span className="hidden sm:inline">Scanner</span>
            </Link>
            
            <Link
              to="/add-user"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <UserPlus className="h-5 w-5" />
              <span className="hidden sm:inline">Add User</span>
            </Link>
            
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 ml-2"
              aria-label="Sign out"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;