import { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';

import { RolesIndex } from './Roles/RolesIndex';
import PaymentIndex from './Payment/PaymentIndex';
import PlansIndex from './Plans/PlansIndex';
import CreateCompany from './Company/CreateCompany';
import CompanyIndex from './Company/CompanyIndex';
import PaymentChannelsIndex from './Payment/PaymentChannelsIndex';
import SettingsNavigationMenu from './Components/SettingsNavigationMenu';
import SettingsSectionContainer from './Components/SettingsSectionContainer';

const Index = () => {
  const [activeSection, setActiveSection] = useState('roles');

  const sections = [
    { id: 'roles', name: 'Roles Management ', component: <RolesIndex /> },
    {
      id: 'payments',
      name: 'Payments Management ',
      component: <PaymentIndex />,
    },
    {
      id: 'payments_channels',
      name: 'Payments Channels ',
      component: <PaymentChannelsIndex />,
    },
    {
      id: 'plans',
      name: 'Plans and subscription Management ',
      component: <PlansIndex />,
    },
    {
      id: 'company_management',
      name: `Company Management`,
      component: <CompanyIndex />,
    },

    {
      id: 'create_company_and_owner',
      name: 'Create a Company and its Owner',
      component: <CreateCompany />,
    },
   
  ];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Settings and Management " />

      <div className="flex h-full min-h-screen">
        <div className="flex-shrink-0">
          <SettingsNavigationMenu
            sections={sections}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>
        <SettingsSectionContainer activeSection={activeSection} sections={sections} />
      </div>
    </DefaultLayout>
  );
};

export default Index;
