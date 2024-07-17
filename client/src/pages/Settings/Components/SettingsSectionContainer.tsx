import React from 'react';

interface SettingsSectionContainerProps {
  activeSection: string;
  sections: { id: string; component: React.ReactNode }[];
}

const SettingsSectionContainer: React.FC<SettingsSectionContainerProps> = ({
  activeSection,
  sections,
}) => {
  const activeComponent = sections.find(
    (section) => section.id === activeSection,
  )?.component;
  return (
    <div className="flex-grow overflow-y-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ml-4">
      {activeComponent}
    </div>
  );
};

export default SettingsSectionContainer;