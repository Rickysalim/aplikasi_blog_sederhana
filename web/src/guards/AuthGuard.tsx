import { useState, ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../components/LoadingScreen';
import Login from '../pages/auth/Login';

type AuthGuardProps = {
    children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated, isInitialized } = useAuth();

    const { pathname } = useLocation();

    const navigate = useNavigate()

    const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

    if (!isInitialized) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        if (pathname !== requestedLocation) {
            setRequestedLocation(pathname);
        }
        navigate('/login')
        return <Login />;
    }

    if (requestedLocation && pathname !== requestedLocation) {
        setRequestedLocation(null);
        return <Navigate to={requestedLocation} />;
    }

    
  return <>{children}</>;
}