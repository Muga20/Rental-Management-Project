import React from 'react';

const UserCardSkeleton = () => {
  const isDarkMode = false; // Set this based on your application's theme context

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="w-full max-w-sm border border-gray-200 rounded-lg bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark animate-pulse"
        >
          <div className="flex flex-col items-center pb-10 pt-5">
            <div className={`w-24 h-24 mb-3 rounded-full ${isDarkMode ? "bg-gray-300" : "bg-blue-200"}`}></div>
            <div className={`h-4 ${isDarkMode ? "bg-gray-300" : "bg-blue-200"} rounded w-3/4 mb-2`}></div>
            <div className={`h-3 ${isDarkMode ? "bg-gray-300" : "bg-blue-200"} rounded w-1/2 mb-4`}></div>
            <div className={`h-3 ${isDarkMode ? "bg-gray-300" : "bg-blue-200"} rounded w-1/4 mb-2`}></div>
            <div className={`h-3 ${isDarkMode ? "bg-gray-300" : "bg-blue-200"} rounded w-1/4`}></div>
            <div className="flex mt-4 md:mt-6 w-full justify-center">
              <div className={`h-8 ${isDarkMode ? "bg-gray-300" : "bg-blue-200"} rounded w-1/3 me-2`}></div>
              <div className={`h-8 ${isDarkMode ? "bg-gray-300" : "bg-blue-200"} rounded w-1/3`}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserCardSkeleton;
