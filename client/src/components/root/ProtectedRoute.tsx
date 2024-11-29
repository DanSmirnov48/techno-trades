import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ACCOUNT_TYPE } from '@/types';

export type ProtectedRouteProps = {
    isAuthenticated: boolean;
    redirectPath: string;
    outlet: JSX.Element;
    allowedAccountTypes?: ACCOUNT_TYPE[];
    userId: string;
    accountType: ACCOUNT_TYPE;
    loading: boolean
};

export function ProtectedRoute({
    isAuthenticated,
    redirectPath,
    outlet,
    allowedAccountTypes = [],
    userId,
    accountType,
    loading
}: ProtectedRouteProps) {

    const accessToken = Cookies.get('accessToken');
    const [hasLoaded, setHasLoaded] = useState<boolean | undefined>(undefined)
    const [userFound, setUserFound] = useState<boolean | undefined>(undefined)

    useEffect(() => {
        if (loading === false && !!accountType && isAuthenticated) {
            setHasLoaded(true)
            setUserFound(true)
        } else if (loading === false && isAuthenticated === false) {
            setHasLoaded(true)
            setUserFound(false)
        }
    }, [loading, accountType, isAuthenticated]);

    if (hasLoaded && userFound && accessToken) {
        const hasRequiredRole = allowedAccountTypes.includes(accountType);
        if (hasRequiredRole) {
            return outlet;
        } else if (redirectPath === "/dashboard/account/:id") {
            return <Navigate to={{ pathname: `/dashboard/account/${userId}` }} />;
        } else {
            return <Navigate to={{ pathname: redirectPath }} />;
        }
    }
    if (!hasLoaded && !userFound && !accessToken) {
        return <Navigate to="/auth/sign-in" replace/>;
    }
}

export default ProtectedRoute;