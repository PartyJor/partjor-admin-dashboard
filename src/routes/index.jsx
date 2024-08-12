// import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// project-imports
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import ComponentsRoutes from './ComponentsRoutes';

// import { SimpleLayoutType } from 'config';
// import SimpleLayout from 'layout/Simple';
// import Loadable from 'components/Loadable';

import Login from 'pages/auth/auth1/login';
// render - landing page
// const PagesLanding = Loadable(lazy(() => import('pages/landing')));

// ==============================|| ROUTES RENDER ||============================== //

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Login />
    },
    LoginRoutes,
    ComponentsRoutes,
    MainRoutes
  ],
  { basename: import.meta.env.VITE_APP_BASE_NAME }
);

export default router;
