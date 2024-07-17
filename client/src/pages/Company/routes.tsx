import Companies from "./Companies";
import CompanyProfile from "./CompanyProfile";

interface Route {
  name: string;
  layout: string;
  path: string;
  component: React.ComponentType<any>;
}

const companyRoutes: Route[] = [
  {
    name: 'Companies',
    layout: '/company',
    path: '/',
    component: Companies,
  },
  {
    name: 'Company Profile',
    layout: '/company',
    path: '/profile',
    component: CompanyProfile,
  },
];

export default companyRoutes;
