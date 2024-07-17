import React from 'react';
import { GoUnverified, GoVerified } from 'react-icons/go';

const AccountActive = ({ isActive }: { isActive: boolean }) => {
  return (
    <div>
      <span
        className={`inline-flex items-center justify-center w-4 h-4 me-2 text-sm font-semibold rounded-full ${
          isActive ? 'bg-green-500' : 'bg-red-500'
        } text-white`}
      >
        {isActive ? <GoVerified /> : <GoUnverified />}
      </span>
    </div>
  );
};

export default AccountActive;
