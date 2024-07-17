import React, { useState, useEffect } from 'react';
import { FaHouseChimneyWindow, FaBriefcase } from 'react-icons/fa6';
import { useUserData } from '../../constants/UserData';
import ProfileSk from '../../components/Skeleton/ProfileSk';
import { ProfileImage } from './Sub/ProfileImage/ProfileImage';
import { UserData } from '../../types/interfaces';

const ProfileInfo: React.FC = () => {
  const { userData, userRoles, loading } = useUserData();
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const delayProfileRender = setTimeout(() => {
      setShowProfile(true);
    }, 3000);

    return () => clearTimeout(delayProfileRender);
  }, []);

  if (loading || !showProfile || !userData) {
    return <ProfileSk />;
  }

  return (
    <div>
      <div>
        <div className="relative z-20 h-35 md:h-65">
          <img
            src={userData?.detail.coverPhoto}
            alt="profile cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
        </div>

        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <ProfileImage userData={userData as UserData} />
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {userData?.detail.first_name} {userData?.detail.middle_name}{' '}
              {userData?.detail.last_name}
            </h3>
            <p className="font-medium">{userRoles.join(', ')}</p>
            <div className="mx-auto mt-4.5 mb-5.5 grid max-w-94 grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">
                  <FaBriefcase />
                </span>
                <span className="text-sm">
                  {' '}
                  {userData?.company?.name || 'N/A'}{' '}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">
                  <FaHouseChimneyWindow />
                </span>
                <span className="text-sm">Posts</span>
              </div>
            </div>
            <div className="mx-auto max-w-180">
              <h4 className="font-semibold text-black dark:text-white">
                About Me
              </h4>
              <p className="mt-4.5">{userData?.detail.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
