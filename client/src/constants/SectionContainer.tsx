import React from 'react';

interface SectionContainerProps {
  activeSection: string;
  sections: { id: string; component: React.ReactNode }[];
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  activeSection,
  sections,
}) => {
  const activeComponent = sections.find(
    (section) => section.id === activeSection,
  )?.component;
  return (
    <div className="flex-grow overflow-y-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {activeComponent}
    </div>
  );
};

export default SectionContainer;
