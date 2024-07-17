import React from 'react';
import LeaseHouse from './SettingsSubs/LeaseHouse';
import { Lease, Unit, User } from '../../../../types/interfaces';

interface HouseSettingsProps {
  unit: Unit | null;
  user: User | null;
  lease: Lease | null;
  loading: boolean;
}

export const HouseSettings: React.FC<HouseSettingsProps> = ({  unit, user, lease, loading }) => {
  return (
    <div>
      <div className="flex flex-wrap -mx-4">
        <LeaseHouse unit={unit} user={user} lease={lease} loading={loading} />
      </div>
    </div>
  );
};
