import { useSocketContext } from '../context/SocketContext.jsx';

export function useSocket() {
  return useSocketContext();
}

export default useSocket;
