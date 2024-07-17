import React from 'react';
import { useNavigate } from 'react-router-dom';
import SVGIcons from '../Icons/SVGIcons';

interface FormIncludesProps {
  title: string;
}

const FormIncludes: React.FC<FormIncludesProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="border-b border-stroke py-4 px-7 dark:border-strokedark flex justify-between items-center">
        <h3 className="font-medium text-black dark:text-white">{title}</h3>

        <button
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
          onClick={() => navigate(-1)}
        >
         <SVGIcons iconName="close" />
        </button>
      </div>
    </div>
  );
};

export default FormIncludes;
