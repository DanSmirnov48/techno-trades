import {
    OtpForm,
    AccountVerified,
    ForgotPasswordForm,
} from "@/_auth/forms";
import Signin from '@/_auth/pages/SignIn'
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
        path: "/verify-account",
        outlet: <OtpForm />,
    },
    {
        path: "/account-verified",
        outlet: <AccountVerified />,
    },
    {
        path: "/forgot-password",
        outlet: <ForgotPasswordForm />,
    },
];

export default authRoutes;