import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import ProfileInfo from './ProfileInfo';
import Settings from './Settings';
import Security from './Security';
import Auth from './Auth';
import NavigationMenu from '../../constants/NavigationMenu';
import SectionContainer from '../../constants/SectionContainer';

const Profile = () => {
  const [activeSection, setActiveSection] = useState('profileInfo');

  const sections = [
    { id: 'profileInfo', name: 'Profile', component: <ProfileInfo /> },
    { id: 'settings', name: 'Settings', component: <Settings /> },
    { id: 'security', name: 'Security', component: <Security /> },
    { id: 'authentication', name: 'Auth', component: <Auth /> },
  ];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Profile" />

      <div className="mb-3">
        <NavigationMenu
          sections={sections}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>
      <SectionContainer activeSection={activeSection} sections={sections} />
    </DefaultLayout>
  );
};

export default Profile;
