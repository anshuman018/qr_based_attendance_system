import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, CheckCircle, XCircle, RefreshCcw, Filter } from 'lucide-react';
import StatsSummary from '../components/StatsSummary';

interface User {
  id: string;
  name: string;
  phone: string;
  payment_status: boolean;
  checked_in: boolean;
  check_in_time: string | null;
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'checked-in' | 'not-checked-in' | 'paid' | 'unpaid'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    // First apply text search
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    // Then apply filters
    switch(filter) {
      case 'checked-in':
        return matchesSearch && user.checked_in;
      case 'not-checked-in':
        return matchesSearch && !user.checked_in;
      case 'paid':
        return matchesSearch && user.payment_status;
      case 'unpaid':
        return matchesSearch && !user.payment_status;
      default:
        return matchesSearch;
    }
  });

  const checkedInCount = users.filter(user => user.checked_in).length;
  const paidCount = users.filter(user => user.payment_status).length;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Attendees</h1>
      
      <StatsSummary 
        totalAttendees={users.length} 
        checkedIn={checkedInCount}
        paidAttendees={paidCount}
      />
      
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
          title="Filter"
        >
          <Filter className="h-4 w-4 text-gray-600" />
        </button>
        
        <button 
          onClick={fetchUsers}
          className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
          title="Refresh"
        >
          <RefreshCcw className="h-4 w-4 text-gray-600" />
        </button>
      </div>
      
      {isFilterOpen && (
        <div className="mb-4 p-3 bg-white rounded-md shadow-sm border border-gray-100">
          <p className="text-xs font-medium text-gray-700 mb-2">Filter by:</p>
          <div className="flex flex-wrap gap-2">
            <button 
              className={`text-xs px-2 py-1 rounded-full ${filter === 'all' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`text-xs px-2 py-1 rounded-full ${filter === 'checked-in' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setFilter('checked-in')}
            >
              Present
            </button>
            <button 
              className={`text-xs px-2 py-1 rounded-full ${filter === 'not-checked-in' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setFilter('not-checked-in')}
            >
              Absent
            </button>
            <button 
              className={`text-xs px-2 py-1 rounded-full ${filter === 'paid' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setFilter('paid')}
            >
              Paid
            </button>
            <button 
              className={`text-xs px-2 py-1 rounded-full ${filter === 'unpaid' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setFilter('unpaid')}
            >
              Unpaid
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {filteredUsers.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.phone}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.checked_in ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {user.checked_in ? 'Present' : 'Absent'}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.payment_status ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'}`}>
                        {user.payment_status ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </div>
                  {user.check_in_time && (
                    <p className="text-xs text-gray-500 mt-1">
                      Checked in: {new Date(user.check_in_time).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              {searchTerm || filter !== 'all' ? 'No matching attendees found' : 'No attendees yet'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;