import Dashboard from './Dashboard';
import UsersAndRoles from './UsersAndRoles/Index';
import Calendar from './Layouts/Calendar';
import homeRoutes from '../Homes/routes';
import settingsRoutes from '../Settings/routes';
import accountRoutes from '../Account/routes';
import companyRoutes from '../Company/routes';
import plansRoutes from '../Plans/routes';


interface Route {
  name: string;
  layout: string;
  path: string;
  component: React.ComponentType<any>;
}

const mainRoutes: Route[] = [
  {
    name: 'Dashboard',
    layout: '/dashboard',
    path: '/',
    component: Dashboard,
  },
  {
    name: 'Users and Roles',
    layout: '/dashboard',
    path: '/users-and-roles',
    component: UsersAndRoles,
  },
  {
    name: 'Calendar',
    layout: '/dashboard',
    path: '/calendar',
    component: Calendar,
  },
];

const routes: Route[] = [
  ...mainRoutes,
  ...homeRoutes,
  ...accountRoutes,
  ...settingsRoutes,
  ...companyRoutes,
  ...plansRoutes,
];

export default routes;
