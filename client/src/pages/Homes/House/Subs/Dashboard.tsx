import React from 'react';
import HouseDateAndTime from './DashboardSubs/HouseDateAndTime';
import { Unit, User, Lease } from '../../../../types/interfaces';
import Balances from './DashboardSubs/Balances';

interface DashboardProps {
  unit: Unit | null;
  user: User | null;
  lease: Lease | null;
  loading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ unit, user, lease, loading }) => {
  return (
    <div>
      <div className="bg-white dark:bg-boxdark border-t border-b sm:border-l sm:border-r sm:rounded shadow mb-6">
        
        <HouseDateAndTime user={user} lease={lease} loading={loading} />
        <Balances unit={unit} loading={loading} user={null} lease={null} />
      </div>
    </div>
  );
};
