import { JSX } from 'react';
import { Cart, CkeckoutSuccess, Deals, Explore, Home, NotFound, PopularBrands, ProductDetails, Checkout } from '@/_root/pages';
import { ProtectedRouteProps, UserRole } from '@/components/root/ProtectedRoute';

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
    path: '/checkout',
    outlet: <Checkout />,
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
    path: '/popular-brands',
    outlet: <PopularBrands />,
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