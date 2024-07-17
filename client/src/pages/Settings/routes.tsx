import Index from "./Index";
import CreatePlan from "./Plans/CreatePlan";

interface Route {
  name: string;
  layout: string;
  path: string;
  component: React.ComponentType<any>;
}

const settingsRoutes: Route[] = [
  {
    name: 'Settings',
    layout: '/setting',
    path: '/',
    component: Index,
  },
  {
    name: 'Create Plan',
    layout: '/setting',
    path: '/plan/create-plan',
    component: CreatePlan,
  },
];

export default settingsRoutes;
