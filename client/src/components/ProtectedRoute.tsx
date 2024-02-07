import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export type UserRole = 'user' | 'admin';

export type ProtectedRouteProps = {
    isAuthenticated: boolean;
    redirectPath: string;
    outlet: JSX.Element;
    allowedRoles?: UserRole[];
    currentRole: UserRole;
    loading: boolean
};

export function ProtectedRoute({
    isAuthenticated,
    redirectPath,
    outlet,
    allowedRoles = [],
    currentRole,
    loading
}: ProtectedRouteProps) {

    const accessToken = Cookies.get('accessToken');
    const [hasLoaded, setHasLoaded] = useState<boolean | undefined>(undefined)
    const [userFound, setUserFound] = useState<boolean | undefined>(undefined)

    useEffect(() => {
        if (loading === false && !!currentRole && isAuthenticated) {
            setHasLoaded(true)
            setUserFound(true)
        } else if (loading === false && isAuthenticated === false) {
            setHasLoaded(true)
            setUserFound(false)
        }
    }, [loading, currentRole, isAuthenticated]);

    if (hasLoaded && userFound && accessToken) {
        const hasRequiredRole = allowedRoles.includes(currentRole);
        if (hasRequiredRole) {
            return outlet;
        } else {
            return <Navigate to={{ pathname: redirectPath }} />;
        }
    }
    if (!hasLoaded && !userFound && !accessToken) {
        return <Navigate to="/" />;
    }
}

export default ProtectedRoute;