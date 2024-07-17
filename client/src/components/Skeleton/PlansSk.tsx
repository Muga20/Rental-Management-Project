import React from 'react';

const PlansSk = () => {
  const isDarkMode = false; // Set this based on your application's theme context

  const skeletonCards = Array.from({ length: 3 }).map((_, index) => (
    <div
      key={index}
      className="flex flex-col mx-4 mb-8 text-center text-gray-900 rounded-lg border border-gray-100 dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark "
      style={{ width: 'calc(47% - 2rem)' }}
    >
      <div className={`animate-pulse ${isDarkMode ? 'bg-gray-800' : 'bg-blue-200'} h-16 rounded mb-4`}></div>
      <div className={`animate-pulse ${isDarkMode ? 'bg-gray-800' : 'bg-blue-200'} h-4 rounded mb-2`}></div>
      <div className={`animate-pulse ${isDarkMode ? 'bg-gray-800' : 'bg-blue-200'} h-4 rounded mb-1`}></div>
      <div className={`animate-pulse ${isDarkMode ? 'bg-gray-800' : 'bg-blue-200'} h-4 rounded mb-4`}></div>
      <div className="flex justify-center items-baseline my-8">
        <span className={`animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-blue-300'} h-8 w-20 block rounded-lg`}></span>
      </div>
     
      <button className={`animate-pulse ${isDarkMode ? 'bg-gray-700' : 'bg-blue-300'} h-10 rounded-lg`} disabled></button>
    </div>
   
  ));

  return <>{skeletonCards}</>;
};

export default PlansSk;
