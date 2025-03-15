import React from 'react';
import { UserCheck, CreditCard, Users } from 'lucide-react';

interface StatsSummaryProps {
  totalAttendees: number;
  checkedIn: number;
  paidAttendees: number;
}

const StatsSummary = ({ totalAttendees, checkedIn, paidAttendees }: StatsSummaryProps) => {
  const checkInPercentage = totalAttendees > 0 ? Math.round((checkedIn / totalAttendees) * 100) : 0;
  const paidPercentage = totalAttendees > 0 ? Math.round((paidAttendees / totalAttendees) * 100) : 0;
  
  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {/* Total Attendees */}
      <div className="bg-white rounded-lg shadow p-3 flex flex-col items-center justify-center">
        <Users className="h-5 w-5 text-blue-600 mb-1" />
        <p className="text-xs text-gray-500">Total</p>
        <p className="text-lg font-bold">{totalAttendees}</p>
      </div>
      
      {/* Checked In */}
      <div className="bg-white rounded-lg shadow p-3 flex flex-col items-center justify-center">
        <UserCheck className="h-5 w-5 text-green-600 mb-1" />
        <p className="text-xs text-gray-500">Present</p>
        <div className="flex flex-col items-center">
          <p className="text-lg font-bold">{checkedIn}</p>
          <p className="text-xs text-green-600">{checkInPercentage}%</p>
        </div>
      </div>
      
      {/* Payment Status */}
      <div className="bg-white rounded-lg shadow p-3 flex flex-col items-center justify-center">
        <CreditCard className="h-5 w-5 text-purple-600 mb-1" />
        <p className="text-xs text-gray-500">Paid</p>
        <div className="flex flex-col items-center">
          <p className="text-lg font-bold">{paidAttendees}</p>
          <p className="text-xs text-purple-600">{paidPercentage}%</p>
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;