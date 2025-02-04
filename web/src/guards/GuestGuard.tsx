import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isInitialized } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
