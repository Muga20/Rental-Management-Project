import React from 'react';

interface HouseSelectedContainerProps {
  activeSection: string;
  sections: { id: string; component: React.ReactNode }[];
}

const HouseSelectedContainer: React.FC<HouseSelectedContainerProps> = ({
  activeSection,
  sections,
}) => {
  const activeComponent = sections.find(
    (section) => section.id === activeSection,
  )?.component;
  return (
    <div className="flex-grow container mx-auto sm:px-4 pt-6 pb-8">
      {activeComponent}
    </div>
  );
};

export default HouseSelectedContainer;
