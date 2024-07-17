import React from 'react';
import { Routes, Route } from 'react-router-dom';
import routes from './routes';

interface RouteConfig {
  name: string;
  layout: string;
  path: string;
  component: React.ComponentType<any>;
}

function AccountsLayout() {
  const getRoutes = (routes: RouteConfig[]) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/account") {
        return (
          <Route key={key} path={prop.path} element={<prop.component />} />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <div>
      <Routes>
        {getRoutes(routes)}
      </Routes>
    </div>
  );
}

export default AccountsLayout;
