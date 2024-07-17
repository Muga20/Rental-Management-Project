// NavigationMenuTwo.js
import React from 'react';

interface NavigationMenuTwoProps {
  sections: { id: string; name: string }[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const NavigationMenuTwo: React.FC<NavigationMenuTwoProps> = ({
  sections,
  activeSection,
  onSectionChange,
}) => {
  return (
    <div className="w-52 overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="shadow w-full my-2">
        {sections.map((section) => (
          <div key={section.id}>
            <button
              className={`py-2 px-4 my-2 rounded-sm w-full ${
                activeSection === section.id
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-500 text-dark'
              }`}
              onClick={() => onSectionChange(section.id)}
            >
              {section.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavigationMenuTwo;
