import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../lib/supabase';
import toast from 'react-hot-toast';
import { LogIn, Shield, QrCode } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(formData.email, formData.password);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-full bg-indigo-100 mb-2">
          <QrCode className="h-12 w-12 text-indigo-600" />
        </div>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">QR Check-In</h1>
        <p className="mt-1 text-gray-500">Smart Attendance System</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
      
      {/* Secure system notice */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center text-gray-500 text-sm">
          <Shield className="h-4 w-4 mr-1 text-gray-400" />
          <span>This is a restricted system. Contact the administrator for access.</span>
        </div>
      </div>
      
      {/* Developer attribution */}
      <div className="mt-10 text-center text-xs text-gray-500">
        Developed by Anshuman Singh &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default Login;