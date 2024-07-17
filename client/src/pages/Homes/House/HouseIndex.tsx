import { useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { Dashboard } from './Subs/Dashboard';
import { MdSpaceDashboard, MdAutoGraph } from 'react-icons/md';
import HouseNavMenu from './Components/HouseNavMenu';
import HouseSelectedContainer from './Components/HouseSelectedContainer';
import { FaGear } from "react-icons/fa6";
import { GiPayMoney } from "react-icons/gi";
import { HousePayments } from './Subs/HousePayments';
import { useLeaseData } from './Constants/HouseData'; 
import { HouseSettings } from './Subs/HouseSettings';

export const HouseIndex = () => {
  const [activeSection, setActiveSection] = useState('house');
  const { unit, user, lease, loading } = useLeaseData();

  const sections = [
    {
      id: 'house',
      icon: <MdSpaceDashboard />,
      name: 'House',
      component: <Dashboard unit={unit} user={user} lease={lease} loading={loading} />,
    },
    {
      id: 'payments',
      icon: <GiPayMoney />,
      name: 'Payments',
      component: <HousePayments />,
    },
    {
      id: 'stats',
      icon: <MdAutoGraph />,
      name: 'Stats',
      component: <Dashboard unit={unit} user={user} lease={lease} loading={loading} />,
    },
    {
      id: 'settings',
      icon: <FaGear />,
      name: 'Settings',
      component: <HouseSettings unit={unit} user={user} lease={lease} loading={loading}  />,
    },
  ];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="House" />
      <div className="bg-grey-lighter flex flex-col min-h-screen w-full">
        <div>
          <HouseNavMenu
            sections={sections}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        <HouseSelectedContainer
          activeSection={activeSection}
          sections={sections}
        />
      </div>
    </DefaultLayout>
  );
};
