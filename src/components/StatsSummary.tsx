import React from 'react';
import { UserCheck, UserX, CreditCard, Calendar } from 'lucide-react';

interface StatsSummaryProps {
  totalAttendees: number;
  checkedIn: number;
  paidAttendees: number;
}

const StatsSummary = ({ totalAttendees, checkedIn, paidAttendees }: StatsSummaryProps) => {
  const checkInPercentage = totalAttendees > 0 ? Math.round((checkedIn / totalAttendees) * 100) : 0;
  const paidPercentage = totalAttendees > 0 ? Math.round((paidAttendees / totalAttendees) * 100) : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Attendees */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <Calendar className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Total Attendees</p>
          <p className="text-2xl font-bold">{totalAttendees}</p>
        </div>
      </div>
      
      {/* Checked In */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="bg-green-100 p-3 rounded-full mr-4">
          <UserCheck className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Checked In</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold">{checkedIn}</p>
            <p className="ml-2 text-sm text-green-600">{checkInPercentage}%</p>
          </div>
        </div>
      </div>
      
      {/* Not Checked In */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="bg-yellow-100 p-3 rounded-full mr-4">
          <UserX className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Not Checked In</p>
          <p className="text-2xl font-bold">{totalAttendees - checkedIn}</p>
        </div>
      </div>
      
      {/* Payment Status */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className="bg-purple-100 p-3 rounded-full mr-4">
          <CreditCard className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Payment Received</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold">{paidAttendees}</p>
            <p className="ml-2 text-sm text-purple-600">{paidPercentage}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;