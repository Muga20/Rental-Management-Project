
import CreateHome from "./HomeSubs/CreateHome";
import EditHomeInfo from "./HomeSubs/EditHomeInfo";
import CreateHomePaymentChannel from "./HomeSubs/Payments/CreateHomePaymentChannel";
import ModifyHomepymentChannel from "./HomeSubs/Payments/ModifyHomepymentChannel";
import { HouseIndex } from "./House/HouseIndex";
import NewTenant from "./House/Subs/SettingsSubs/NewTenant";
import Index from "./Index";
import MyHome from "./MyHome";
import { SingleHome } from "./SingleHome";
import UnitsIndex from "./Units/UnitsIndex";

interface Route {
  name: string;
  layout: string;
  path: string;
  component: React.ComponentType<any>;
}

const homeRoutes: Route[] = [
  {
    name: 'Homes',
    layout: '/home',
    path: '/',
    component: Index,
  },
  {
    name: 'My Home',
    layout: '/home',
    path: '/my-house',
    component: MyHome,
  },
  {
    name: 'Create New Home',
    layout: '/home',
    path: '/create-new-home',
    component: CreateHome,
  },
  {
    name: 'Edit Home Info',
    layout: '/home',
    path: '/:id/edit',
    component: EditHomeInfo,
  },
  {
    name: 'Single Home',
    layout: '/home',
    path: '/:id',
    component: SingleHome,
  },
  {
    name: 'Create Home Payment Channel',
    layout: '/home',
    path: '/:id/create-payment',
    component: CreateHomePaymentChannel,
  },
  {
    name: 'Modify Home Payment Channel',
    layout: '/home',
    path: '/edit-payment/:id',
    component: ModifyHomepymentChannel,
  },
  {
    name: 'Units',
    layout: '/home',
    path: '/unit/:id',
    component: UnitsIndex,
  },
  {
    name: 'House',
    layout: '/home',
    path: '/house/:id',
    component: HouseIndex,
  },
  {
    name: 'House',
    layout: '/home',
    path: '/house/lease-page/:id',
    component: NewTenant,
  },
];

export default homeRoutes;
