import axios from './axios'
import jwtDecode from 'jwt-decode';

const isValidToken = (token: string) => {
  if (!token) {
    return false;
  }
  const decoded = jwtDecode<{ exp: number }>(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};

const handleTokenExpired = (exp: number) => {
  let expiredTimer;
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;
  clearTimeout(expiredTimer);
  expiredTimer = setTimeout(() => {
    alert('Token expired');
    localStorage.removeItem('token');
    window.location.href = '/login';
  }, timeLeft);
};

const setSession = (token: string | null) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    const { exp } = jwtDecode<{ exp: number }>(token); 
    handleTokenExpired(exp);
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common.Authorization;
  }
};

const setSessionGoogle = (token: string | null) => {
  if(token) {
    localStorage.setItem('token-google', token);
    const { exp } = jwtDecode<{exp: number}>(token);
    handleTokenExpired(exp);
  } else {
    localStorage.removeItem('token-google');
  }
}

export { isValidToken, setSession, setSessionGoogle };
