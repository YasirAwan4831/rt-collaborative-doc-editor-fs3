import { createContext, useContext, useEffect, useState } from 'react';
import { socketService } from '../services/socket/socketService.js';
import { authService } from '../services/auth/authService.js';
import { useAuthContext } from './AuthContext.jsx';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { isAuthenticated } = useAuthContext();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      socketService.disconnect();
      setConnected(false);
      return;
    }

    let mounted = true;

    (async () => {
      const token = await authService.getToken();
      if (!token || !mounted) return;
      const socket = socketService.connect(token);
      socket.on('connect', () => mounted && setConnected(true));
      socket.on('disconnect', () => mounted && setConnected(false));
    })();

    return () => {
      mounted = false;
      socketService.disconnect();
      setConnected(false);
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socketService, connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocketContext must be used within SocketProvider');
  return ctx;
}

export default SocketContext;
