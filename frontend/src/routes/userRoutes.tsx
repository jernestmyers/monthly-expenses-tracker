import { RouteObject } from 'react-router-dom';
import { PrivateRoute } from '../components/PrivateRoute';
import { UserDashboard } from '../components/UserDashboard/UserDashboard';
import { DefaultPageLayout } from '../components/Layouts/DefaultPageLayout';

export const userRoutes: RouteObject[] = [
  {
    path: 'user/settings',
    element: (
      <PrivateRoute>
        <DefaultPageLayout>
          <UserDashboard />
        </DefaultPageLayout>
      </PrivateRoute>
    ),
  },
];
