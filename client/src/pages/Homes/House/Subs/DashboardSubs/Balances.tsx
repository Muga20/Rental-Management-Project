import React from 'react';
import { Lease, User, Unit } from '../../../../../types/interfaces';

interface HouseDateAndTimeProps {
  user: User | null;
  lease: Lease | null;
  unit: Unit | null;
  loading: boolean;
}

const Balances: React.FC<HouseDateAndTimeProps> = ({
  unit,
  loading,
}) => {
  return (
    <div>
      <div className="flex flex-wrap justify-center">
        <div className="w-full sm:w-1/2 lg:w-1/3 text-center py-8">
          <div className="border-b sm:border-r lg:border-b-0">
            <div className="text-black dark:text-white mb-2">
              <span className="text-3xl align-top text-black dark:text-white">
                Ksh
              </span>
              <span className="text-5xl text-green-500">21,404</span>
              <span className="text-3xl align-top text-black dark:text-white">
                .74
              </span>
            </div>
            <div className="text-sm uppercase text-black dark:text-white tracking-wide">
              Paid Rent
            </div>
            <div className="text-red-500 font-bold">Balance: Ksh 3,596.26</div>
            <div className="text-white">Payable Rent: Ksh {unit?.payableRent ?? 'N/A'}</div>
          </div>
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/3 text-center py-8">
          <div className="border-b sm:border-r lg:border-b-0 lg:border-l">
            <div className="text-black dark:text-white mb-2">
              <span className="text-3xl align-top text-black dark:text-white">
                Ksh
              </span>
              <span className="text-5xl text-green-500">12,998</span>
              <span className="text-3xl align-top text-black dark:text-white">
                .48
              </span>
            </div>
            <div className="text-sm uppercase text-black dark:text-white tracking-wide">
              Paid Water Bill
            </div>
            <div className="text-red-500 font-bold">Balance: Ksh 2,001.52</div>
            <div className="text-white">Payable Water Bill: Ksh {unit?.payableWaterBill ?? 'N/A'}</div>
          </div>
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/3 text-center py-8">
          <div>
            <div className="text-black dark:text-white mb-2">
              <span className="text-3xl align-top text-black dark:text-white">
                Ksh
              </span>
              <span className="text-5xl text-green-500">154</span>
              <span className="text-3xl align-top text-black dark:text-white">
                .45
              </span>
            </div>
            <div className="text-sm uppercase text-black dark:text-white tracking-wide">
              Paid Garbage Bill
            </div>
            <div className="text-red-500 font-bold">Balance: Ksh 45.55</div>
            <div className="text-white">Payable Garbage Bill: Ksh {unit?.payableGarbageBill ?? 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balances;
