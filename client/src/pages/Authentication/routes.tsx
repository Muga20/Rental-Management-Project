import AuthUser from './AuthUser';
import Login from './Login';
import PasswordReset from './PasswordReset';
import OtpAuth from './OtpAuth';
import ForgotPassword from './ForgotPassword';
import NewAccount from './NewAccount';

interface Route {
  name: string;
  layout: string;
  path: string;
  component: React.ComponentType<any>;
}

const routes: Route[] = [
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/',
    component: AuthUser,
  },
  {
    name: 'Login',
    layout: '/auth',
    path: '/login',
    component: Login,
  },
  {
    name: 'Otp Auth',
    layout: '/auth',
    path: '/otp',
    component: OtpAuth,
  },
  {
    name: 'Forgot Password',
    layout: '/auth',
    path: '/reset-password',
    component: ForgotPassword,
  },
  {
    name: 'Reset Password',
    layout: '/auth',
    path: '/new-password/:token',
    component: PasswordReset,
  },
  {
    name: 'Reset Password',
    layout: '/auth',
    path: '/new-account/:token',
    component: NewAccount,
  },
];

export default routes;
