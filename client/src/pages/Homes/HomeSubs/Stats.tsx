import React from 'react';
import CardDataStats from '../components/CardDataStats';
import { HomeProfile } from '../../../types/interfaces';
import { Link } from 'react-router-dom';

interface StatsProps {
  homes: HomeProfile;
  vacantUnits: number;
}

export const Stats: React.FC<StatsProps> = ({ homes, vacantUnits }) => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <Link to={`/home/unit/${homes.id}`}>
          <CardDataStats
            title="Available Units"
            totalUnits={homes.units_count}
            availableUnits={vacantUnits}
          />
        </Link>
      </div>
    </div>
  );
};

export default Stats;
