import { SigninForm, SignupForm } from '@/_auth/forms';
import { JSX } from 'react';

export interface AuthRoute {
    path: string;
    outlet: JSX.Element;
}

const authRoutes: AuthRoute[] = [
    {
        path: '/sign-in',
        outlet: <SigninForm />,
    },
    {
        path: '/sign-up',
        outlet: <SignupForm />,
    },
];

export default authRoutes;