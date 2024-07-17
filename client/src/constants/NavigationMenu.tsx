import React from 'react';

interface NavigationMenuProps {
  sections: { id: string; name: string }[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  sections,
  activeSection,
  onSectionChange,
}) => {
  return (
    <div className="flex-grow overflow-y-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex w-full p-2">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`py-2 px-4 my-2 rounded-sm flex-grow ${
              activeSection === section.id
                ? 'bg-neutral-700 text-white'
                : 'bg-gray-500 text-dark'
            }`}
            onClick={() => onSectionChange(section.id)}
          >
            {section.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationMenu;
