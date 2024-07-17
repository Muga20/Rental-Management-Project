import Profile from "./Profile";
import Staff from "./Staff";
import CreateNewMember from "./Sub/CreateNewMember";

interface Route {
  name: string;
  layout: string;
  path: string;
  component: React.ComponentType<any>;
}

const accountRoutes: Route[] = [
  {
    name: 'Profile',
    layout: '/dashboard',
    path: '/profile',
    component: Profile,
  },
  {
    name: 'Staff',
    layout: '/dashboard',
    path: '/staff',
    component: Staff,
  },
  {
    name: 'Create New Member',
    layout: '/dashboard',
    path: '/homes/members/create-new-member',
    component: CreateNewMember,
  },
];

export default accountRoutes;
