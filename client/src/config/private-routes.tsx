import { JSX } from 'react';
import { UserRole } from '@/components/root/ProtectedRoute';
import { Dashboard, Account, Orders, Notifications, Appearance, Favourites, Tables, ProductCreateForm, Categories, Archive } from '@/_dashboard/pages';

export interface dashboardRoutesProps {
  path: string;
  outlet: JSX.Element;
  allowedRoles: UserRole[];
  additionalProps: {
    redirectPath?: string;
    [key: string]: any;
  };
}

const dashboardRoutes: dashboardRoutesProps[] = [
  {
    path: '/dashboard',
    outlet: <Dashboard />,
    allowedRoles: ['admin'],
    additionalProps: {
      redirectPath: '/dashboard/account/:id',
    },
  },
  {
    path: '/dashboard/account/:id',
    outlet: <Account />,
    allowedRoles: ['admin', 'user'],
    additionalProps: {},
  },
  {
    path: '/dashboard/my-orders/:id',
    outlet: <Orders />,
    allowedRoles: ['admin', 'user'],
    additionalProps: {},
  },
  {
    path: '/dashboard/notifications/:id',
    outlet: <Notifications />,
    allowedRoles: ['admin', 'user'],
    additionalProps: {},
  },
  {
    path: '/dashboard/appearance/:id',
    outlet: <Appearance />,
    allowedRoles: ['admin', 'user'],
    additionalProps: {},
  },
  {
    path: '/dashboard/favourites/:id',
    outlet: <Favourites />,
    allowedRoles: ['admin', 'user'],
    additionalProps: {},
  },
  {
    path: '/dashboard/data-tables',
    outlet: <Tables />,
    allowedRoles: ['admin'],
    additionalProps: {},
  },
  {
    path: '/dashboard/archive',
    outlet: <Archive />,
    allowedRoles: ['admin'],
    additionalProps: {},
  },
  {
    path: '/dashboard/new-product',
    outlet: <ProductCreateForm />,
    allowedRoles: ['admin'],
    additionalProps: {},
  },
  {
    path: '/dashboard/categories',
    outlet: <Categories />,
    allowedRoles: ['admin'],
    additionalProps: {},
  },
];

export default dashboardRoutes;