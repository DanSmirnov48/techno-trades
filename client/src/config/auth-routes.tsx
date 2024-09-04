import {
    SigninForm,
    SignupForm,
    OtpForm,
    AccountVerified,
    ForgotPasswordForm,
    SignInWithMagic
} from "@/_auth/forms";
import { JSX } from "react";

export interface AuthRoute {
    path: string;
    outlet: JSX.Element;
}

const authRoutes: AuthRoute[] = [
    {
        path: "/sign-in",
        outlet: <SigninForm returnAs={"card"} withMagicSignIn />,
    },
    {
        path: "/login/:token",
        outlet: <SignInWithMagic />,
    },
    {
        path: "/sign-up",
        outlet: <SignupForm />,
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