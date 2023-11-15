import { useContext } from 'react';
import { GoogleAuthContext } from '../contexts/GoogleAuthContext';

const useGoogleAuth = () => {
    const context = useContext(GoogleAuthContext);
    if (!context) throw new Error('Auth context must be use inside AuthProvider');
    return context;
};

export default useGoogleAuth;