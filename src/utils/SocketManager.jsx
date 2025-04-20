import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../auth_temp/AuthContext'; // ✅ FIXED IMPORT PATH

let socket;

const SocketManager = () => {
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);
  const socketRef = useRef(null); // Use useRef to hold the socket instance

  useEffect(() => {
    if (user) {
      socketRef.current = io('http://localhost:5000', {
        withCredentials: true,
      });
      socket = socketRef.current; // Assign to the module-level variable as well for potential other uses

      socketRef.current.emit('register-user', { userId: user._id, role: user.role });

      socketRef.current.on('suspend-notification', (message) => {
        setNotification({ type: 'error', message });
      });

      socketRef.current.on('activate-notification', (message) => {
        setNotification({ type: 'success', message });
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('suspend-notification');
        socketRef.current.off('activate-notification');
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  return (
    <>
      {notification && (
        <div
          style={{
            padding: '10px',
            backgroundColor: notification.type === 'error' ? 'red' : 'green',
            color: 'white',
            marginBottom: '10px',
          }}
        >
          {notification.message}
        </div>
      )}
    </>
  );
};

// Export a function to get the current socket instance
export const getIO = () => {
  return socket;
};

export default SocketManager;