import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeProfile } from '../../../types/interfaces'; // Adjust path as per your project structure

interface HomeInfoProps {
  home: HomeProfile;
}

export const HomeInfo: React.FC<HomeInfoProps> = ({ home }) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/home/${home.id}/edit`);
  };

  return (
    <div className="dark:bg-boxdark p-3 border border-stroke dark:border-strokedark shadow-sm rounded-sm bg-white">
      <div className="text-gray-700">
        <div className="grid md:grid-cols-1 text-sm text-center mb-6">
          <div className="flex flex-col items-center">
            <img
              src={home.images}
              alt="Home"
              className="rounded-full w-32 h-32 mb-4"
            />
            <div className="text-2xl font-bold text-black dark:text-white">
              {home.name}
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 text-sm">
          <div className="grid grid-cols-2">
            <div className="px-4 py-2 font-semibold text-black dark:text-white">
              Email
            </div>
            <div className="px-4 py-2 text-black dark:text-white">
              {home.email}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="px-4 py-2 font-semibold text-black dark:text-white">
              Contact No.
            </div>
            <div className="px-4 py-2 text-black dark:text-white">
              {home.phone}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="px-4 py-2 font-semibold text-black dark:text-white">
              Location
            </div>
            <div className="px-4 py-2 text-black dark:text-white">
              {home.location}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="px-4 py-2 font-semibold text-black dark:text-white">
              Home Category
            </div>
            <div className="px-4 py-2 text-black dark:text-white">
              {home.houseCategory}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="px-4 py-2 font-semibold text-black dark:text-white">
              Landlord
            </div>
            <div className="px-4 py-2 text-black dark:text-white">
              {home.landlord_id}
            </div>
          </div>
        </div>
      </div>
      <button
  onClick={handleEditClick}
  className="block w-32 text-blue-800 text-sm font-semibold rounded-lg bg-white border border-gray-300 border-stroke dark:border-strokedark shadow-lg hover:bg-stone-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4 transition-colors duration-300"
>
  Update About
</button>

    </div>
  );
};
