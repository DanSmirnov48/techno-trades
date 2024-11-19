import Signin from '@/_auth/pages/SignIn'
import PasswordReset from '@/_auth/pages/PasswordReset'
import Register from '@/_auth/pages/Register'
import { JSX } from "react";

export interface AuthRoute {
    path: string;
    outlet: JSX.Element;
}

const authRoutes: AuthRoute[] = [
    {
        path: "auth/sign-in",
        outlet: <Signin />,
    },
    {
        path: "/auth/sign-up",
        outlet: <Register />,
    },
    {
        path: "/auth/forgot-password",
        outlet: <PasswordReset />
    },
];

export default authRoutes;