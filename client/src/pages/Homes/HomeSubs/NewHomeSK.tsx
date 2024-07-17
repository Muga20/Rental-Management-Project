import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NewHomeSK: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateHome = () => {
    navigate('/home/create-new-home');
  };

  return (
    <div className="w-full m-4 p-6 bg-blue-gray-900 rounded-xl shadow-lg bg-white py-6  dark:border-strokedark dark:bg-boxdark ">
      <div className="h-40 mb-4 bg-gray-700 rounded-lg"></div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h5 className="block w-3/4 h-6 bg-gray-700 rounded mb-2"></h5>
        </div>

        <div className="w-1/2 h-4 bg-gray-700 rounded mb-1"></div>

        <div className="flex items-center gap-2 mt-2">
          <span className="flex items-center text-gray-300 w-1/4 h-4 bg-gray-700 rounded"></span>
          <span className="flex items-center text-gray-300 w-1/4 h-4 bg-gray-700 rounded"></span>
          <span className="flex items-center text-gray-300 w-1/4 h-4 bg-gray-700 rounded"></span>
        </div>
      </div>
      <div className="p-6 pt-3">
        <button
          className="w-full h-10 bg-gray-700 rounded-lg"
          onClick={handleCreateHome}
        >
          <div className="flex items-center justify-center">
            <FaPlus className="text-2xl " />
            <span className="ml-2 text-lg ">Click to add a new house</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default NewHomeSK;
