import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

function CompanyProfile() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Company Profile" />
      <div>Profile</div>
    </DefaultLayout>
  );
}

export default CompanyProfile;
