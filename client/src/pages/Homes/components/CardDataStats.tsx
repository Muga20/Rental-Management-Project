import React from 'react';

interface CardDataStatsProps {
  title: string;
  totalUnits: number;
  availableUnits: number;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  totalUnits,
  availableUnits
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {totalUnits} Units
          </h4>
          <span className="text-sm font-medium">{title}</span>
        </div>

        <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
            {  availableUnits }
        </span>
      </div>
    </div>
  );
};

export default CardDataStats;
