import { Navigate } from 'react-router-dom';

export type UserRole = 'user' | 'admin';

export type ProtectedRouteProps = {
    isAuthenticated: boolean;
    redirectPath: string;
    outlet: JSX.Element;
    allowedRoles?: UserRole[];
    currentRole: UserRole;
};

export function ProtectedRoute({
    isAuthenticated,
    redirectPath,
    outlet,
    allowedRoles = [],
    currentRole,
}: ProtectedRouteProps) {

    const hasRequiredRole = allowedRoles.includes(currentRole);
    if (isAuthenticated && hasRequiredRole) {
        return outlet;
    } else if (!isAuthenticated) {
        return <Navigate to={{ pathname: redirectPath }} />;
    }
    else {
        return <Navigate to="/" />;
    }
}

export default ProtectedRoute;