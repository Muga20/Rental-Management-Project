import React from 'react';
import { useNavigate } from 'react-router-dom';

const defaultSvg = (
  <svg
    className="w-24 h-24 mb-3 rounded-full shadow-lg"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

function NewMemberSk() {
  const navigate = useNavigate();

  const createMember = () => {
    navigate("/dashboard/homes/members/create-new-member");
  };

  return (
    <div  className="w-full max-w-sm border border-gray-200 rounded-lg  bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-col items-center pb-10 pt-5">
        <div className="w-24 h-24 mb-3 rounded-full shadow-lg bg-gray-200 flex items-center justify-center">
          {defaultSvg}
        </div>
        <h5 className="mb-1 text-xl font-medium text-gray-900">
          {/* Add member name here */}
        </h5>
        <span className="block text-xs text-gray-500">
          {/* Add member role or description here */}
        </span>
        <div className="flex mt-4 md:mt-6">
          <button
            onClick={createMember}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            Add a member
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewMemberSk;
