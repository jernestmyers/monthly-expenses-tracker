import { RouteObject } from 'react-router-dom';
import { PrivateRoute } from '../components/PrivateRoute';
import { UserDashboard } from '../components/UserDashboard';
import { Header } from '../components/Header';

export const userRoutes: RouteObject[] = [
  {
    path: 'user/settings',
    element: (
      <PrivateRoute>
        <>
          <Header />
          <UserDashboard />
        </>
      </PrivateRoute>
    ),
  },
];
