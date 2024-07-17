import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AlertProvider } from './context/AlertContext';
import Loader from './common/Loader';
import AuthLayouts from './pages/Authentication/AuthLayouts';
import DashLayouts from './pages/Dashboard/DashLayouts';
import CookieService from './service/CookiesService';
import AccountsLayout from './pages/Account/AccountsLayout';
import CompanyLayout from './pages/Company/CompanyLayouts';
import HomeLayout from './pages/Homes/HomeLayout';
import PlansLayout from './pages/Plans/PlansLayout';
import SettingsLayout from './pages/Settings/SettingsLayout';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const accessToken = CookieService.get('xx_tgk');
  const isAuthenticated = !!accessToken;

  return loading ? (
    <Loader />
  ) : (
    <>
      <AlertProvider>
        <Routes>
          <Route
            path="/auth/*"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <AuthLayouts />
              )
            }
          />
          <Route
            path="/dashboard/*"
            element={
              isAuthenticated ? <DashLayouts /> : <Navigate to="/auth/verify" />
            }
          />
          <Route
            path="/account/*"
            element={
              isAuthenticated ? (
                <AccountsLayout />
              ) : (
                <Navigate to="/auth/verify" />
              )
            }
          />
          <Route
            path="/company/*"
            element={
              isAuthenticated ? (
                <CompanyLayout />
              ) : (
                <Navigate to="/auth/verify" />
              )
            }
          />
          <Route
            path="/home/*"
            element={
              isAuthenticated ? <HomeLayout /> : <Navigate to="/auth/verify" />
            }
          />
          <Route
            path="/plan/*"
            element={
              isAuthenticated ? <PlansLayout /> : <Navigate to="/auth/verify" />
            }
          />
          <Route
            path="/setting/*"
            element={
              isAuthenticated ? (
                <SettingsLayout />
              ) : (
                <Navigate to="/auth/verify" />
              )
            }
          />
        </Routes>
      </AlertProvider>
    </>
  );
}

export default App;
