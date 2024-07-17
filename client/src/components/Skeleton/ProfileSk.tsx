import React from 'react';

const ProfileSk = () => {
  const isDarkMode = false; // You can set this based on your application's theme context

  return (
    <div>
      {/* Placeholder for the profile cover */}
      <div className={`relative z-20 h-35 md:h-65 animate-pulse ${isDarkMode ? "dark:bg-[#37404F]" : "bg-blue-200"} rounded-tl-sm rounded-tr-sm`}>
      </div>

      {/* Profile details container */}
      <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
        {/* Placeholder for the profile image */}
        <div className={`relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full ${isDarkMode ? "dark:bg-[#37404F]/20" : "bg-blue-200/20"} p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3 flex justify-center items-center animate-pulse`}>
          <div className="rounded-full w-38 h-40" style={{ backgroundColor: isDarkMode ? "#37404F" : "#E0E7FF" }}>
          </div>
        </div>

        {/* Placeholder for user details */}
        <div className="mt-4">
          <h3 className={`${isDarkMode ? "dark:bg-[#37404F]" : "bg-blue-200"} w-3/4 h-6 mb-1.5 text-2xl font-semibold rounded animate-pulse`}></h3>
          <p className={`${isDarkMode ? "dark:bg-[#37404F]" : "bg-blue-200"} w-1/2 h-4 font-medium rounded animate-pulse`}></p>

          {/* Placeholder for user info grid */}
          <div className={`${isDarkMode ? "dark:bg-[#37404F]" : "bg-blue-200"} mx-auto mt-4.5 mb-5.5 grid max-w-94 grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1`}>
            <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 xsm:flex-row">
              <span className={`${isDarkMode ? "dark:bg-[#37404F]" : "bg-blue-200"} w-5 h-5 rounded-full font-semibold text-black dark:text-white animate-pulse`}></span>
              <span className={`${isDarkMode ? "dark:bg-[#37404F]" : "bg-blue-200"} w-12 h-4 text-sm rounded animate-pulse`}></span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 xsm:flex-row">
              <span className={`${isDarkMode ? "dark:bg-[#37404F]" : "bg-blue-200"} w-5 h-5 rounded-full font-semibold text-black dark:text-white animate-pulse`}></span>
              <span className={`${isDarkMode ? "dark:bg-[#37404F]" : "bg-blue-200"} w-12 h-4 text-sm rounded animate-pulse`}></span>
            </div>
          </div>

          {/* Placeholder for about me section */}
          <div className={`${isDarkMode ? "dark:bg-[#37404F]" : "bg-blue-200"} mx-auto max-w-180 mt-4.5`}>
            <h4 className={`${isDarkMode ? "dark:bg-[#37404F]" : "bg-blue-200"} w-20 h-4 font-semibold rounded animate-pulse`}></h4>
            <p className={`${isDarkMode ? "dark:bg-[#37404F]" : "bg-blue-200"} w-full h-4 rounded animate-pulse`}></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSk;
