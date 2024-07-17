import React from 'react';

const HomeSkeleton = () => {
  const isDarkMode = false; // Set this based on your application's theme context

  const skeletons = Array.from({ length: 6 }).map((_, index) => (
    <div key={index} className="w-full m-4 rounded-xl overflow-hidden bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Card content */}
      <div className={`relative dark:bg-white bg-boxdark  h-40 mb-4 rounded-lg`}></div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className={`block w-3/4 h-6 dark:bg-white bg-boxdark  rounded mb-2`}></div>
        </div>
        <div className={`w-1/2 h-4 dark:bg-white bg-boxdark  rounded mb-1`}></div>
        <div className="flex items-center gap-2 mt-2">
          <span className={`flex items-center dark:bg-white bg-boxdark  w-1/4 h-4 rounded`}></span>
          <span className={`flex items-center dark:bg-white bg-boxdark  w-1/4 h-4 rounded`}></span>
          <span className={`flex items-center dark:bg-white bg-boxdark  w-1/4 h-4 rounded`}></span>
        </div>
      </div>
      <div className="p-6 pt-3">
        <button className={`w-full h-10 dark:bg-white bg-boxdark  rounded-lg`}></button>
      </div>
    </div>
  ));

  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{skeletons}</div>;
};

export default HomeSkeleton;
