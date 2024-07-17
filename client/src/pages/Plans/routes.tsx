import Checkout from "./Checkout";
import Index from "./Index";
import Subscriptions from "./Subscriptions";

interface Route {
  name: string;
  layout: string;
  path: string;
  component: React.ComponentType<any>;
}

const plansRoutes: Route[] = [
  {
    name: 'Plans',
    layout: '/plans',
    path: '/',
    component: Index,
  },
  {
    name: 'Subscriptions',
    layout: '/plans',
    path: '/subscriptions',
    component: Subscriptions,
  },
  {
    name: 'Checkout',
    layout: '/plans',
    path: '/checkout',
    component: Checkout,
  },
];

export default plansRoutes;
