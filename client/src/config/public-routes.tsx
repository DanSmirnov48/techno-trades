import { JSX } from 'react';
import { ProtectedRouteProps, UserRole } from '@/components/ProtectedRoute';
import { Cart, CkeckoutSuccess, Deals, Explore, Home, NotFound, ProductDetails } from '@/_root/pages';

export interface PublicRoute {
  path: string;
  outlet: JSX.Element;
  isProtected?: boolean;
  allowedRoles?: UserRole[];
  protectedRouteProps?: ProtectedRouteProps;
}

const publicRoutes: PublicRoute[] = [
  {
    path: '/',
    outlet: <Home />,
  },
  {
    path: '/explore',
    outlet: <Explore />,
  },
  {
    path: '/cart',
    outlet: <Cart />,
  },
  {
    path: '/checkout-success',
    outlet: <CkeckoutSuccess />,
    isProtected: true,
    allowedRoles: ['admin', 'user'],
  },
  {
    path: '/deals',
    outlet: <Deals />,
  },
  {
    path: '/products/:slug',
    outlet: <ProductDetails />,
  },
  {
    path: '*',
    outlet: <NotFound />,
  },
];

export default publicRoutes;