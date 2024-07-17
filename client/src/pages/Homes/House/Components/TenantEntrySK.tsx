import React from 'react';

export const TenantEntrySK = () => {
  return (
    <div>
      <div className="bg-white dark:bg-boxdark border-t border-b sm:rounded sm:border shadow animate-pulse">
        <div className="border-b">
          <div className="flex justify-between px-6 -mb-px">
            <h3 className="text-black dark:text-white py-4 font-normal text-lg">
              Loading...
            </h3>
          </div>
        </div>
        <div className="text-center px-6 py-4">
          <div className="py-8">
            <div className="mb-4">
              <div className="bg-gray-200 h-16 w-16 rounded-full mx-auto"></div>
            </div>
            <p className="text-2xl text-black dark:text-white font-medium mb-4">
              Loading data...
            </p>
            <div className="flex justify-center">
              <div className="bg-gray-200 h-12 w-24 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
