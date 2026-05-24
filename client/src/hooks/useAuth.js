import { useAuthContext } from '../context/AuthContext.jsx';

export function useAuth() {
  return useAuthContext();
}

export default useAuth;
