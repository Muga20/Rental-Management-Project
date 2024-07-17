import React from 'react';

interface Section {
  id: string;
  name: string;
  icon?: React.ReactNode;
  component: React.ReactNode;
}

interface HouseNavMenuProps {
  sections: Section[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const HouseNavMenu: React.FC<HouseNavMenuProps> = ({
  sections,
  activeSection,
  onSectionChange,
}) => {
  return (
    <div className="hidden bg-white dark:bg-boxdark md:block md:bg-white md:border-b">
      <div className="container mx-auto px-4">
        <div className="md:flex">
          {sections.map((section) => (
            <div key={section.id} className="flex -mb-px mr-8">
              <button
                className={`no-underline font-bold text-black dark:text-white md:text-blue-dark flex items-center py-4 border-b ${
                  activeSection === section.id
                    ? 'border-[#1A222C]'
                    : 'border-transparent'
                }`}
                onClick={() => onSectionChange(section.id)}
              >
                {section.icon && <span className="mr-2">{section.icon}</span>}
                {section.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HouseNavMenu;
