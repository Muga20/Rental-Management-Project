import  { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../layout/DefaultLayout';
import NavigationMenu from '../../../constants/NavigationMenu';
import SectionContainer from '../../../constants/SectionContainer';
import Users from './Users';
import SearchBar from '../../../components/Search/SearchBar';
import { useFetchRoles } from '../../../constants/Roles';
import { Section } from '../../../types/interfaces';


const Index = () => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [sectionsMenuOne, setSectionsMenuOne] = useState<Section[]>([]);
  const { roles } = useFetchRoles();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    if (roles.length > 0) {
      const roleSections = roles.map((role: { name: string }) => ({
        id: role.name,
        name: role.name,
        component: (
          <Users
            selectedRole={role.name}
            searchQuery={searchQuery}
            status={status}
          />
        ),
      }));
      setSectionsMenuOne(roleSections);
      setActiveSection(roleSections.length > 0 ? roleSections[0].name : '');
    }

  }, [roles, searchQuery, status]);

  const handleSectionChange = (sectionName: string) => {
    setActiveSection(sectionName);
  };

  const handleSearch = (query: string, filters: { status: string }) => {
    setSearchQuery(query);
    setStatus(filters.status); 
  };

  const combinedSections = [...sectionsMenuOne,];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Users and Role " />
      <div className="pb-3">
        <SearchBar
          onSearch={handleSearch}
          status={status}
          startDate={''}
          endDate={''}
          paymentType={''}
          location={''}
          paymentStatus={''}
          placeholder={'Search by Users Names'}

          visibleFields={{
            status: true,
            startDate: false,
            endDate: false,
            paymentType: false,
            location: false,
            paymentStatus: false,
          }}
        />
      </div>

      <div className="flex h-full min-h-screen">
        <div className="flex-shrink-0">
          <NavigationMenu
            sections={sectionsMenuOne}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />
       
        </div>
        <SectionContainer
          activeSection={activeSection}
          sections={combinedSections}
        />
      </div>
    </DefaultLayout>
  );
};

export default Index;
