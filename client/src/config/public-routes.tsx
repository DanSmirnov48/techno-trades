import { JSX } from 'react';
import { ProtectedRouteProps } from '@/components/ProtectedRoute';
import { Cart, CkeckoutSuccess, Deals, Explore, Home, NotFound, ProductDetails } from '@/_root/pages';

export interface PublicRoute {
  path: string;
  outlet: JSX.Element;
  isProtected?: boolean;
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
    isProtected: true,
  },
  {
    path: '/checkout-success',
    outlet: <CkeckoutSuccess />,
    isProtected: true,
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