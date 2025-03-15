import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Users, UserPlus, LogOut, Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-indigo-100 p-1.5 rounded-lg">
              <QrCode className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="text-lg font-bold text-gray-900">QR Check-In</span>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
            >
              <Users className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/scanner"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
            >
              <QrCode className="h-4 w-4" />
              <span>Scanner</span>
            </Link>
            
            <Link
              to="/add-user"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add User</span>
            </Link>
            
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
        
        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 border-t border-gray-100">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              <Users className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/scanner"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              <QrCode className="h-5 w-5" />
              <span>Scanner</span>
            </Link>
            
            <Link
              to="/add-user"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50"
            >
              <UserPlus className="h-5 w-5" />
              <span>Add User</span>
            </Link>
            
            <button
              onClick={() => {
                handleSignOut();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;