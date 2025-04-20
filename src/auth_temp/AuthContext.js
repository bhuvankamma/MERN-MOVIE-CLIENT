// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const AuthContext = createContext();
const USER_KEY = 'user';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [suspended, setSuspended] = useState(false);
  const userRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        userRef.current = parsedUser;

        if (parsedUser.status === 'suspended') {
          setSuspended(true);
        }

        socket.connect();
        socket.emit('user_connected', parsedUser._id);
      } catch (e) {
        console.error('Corrupted user data:', e);
        localStorage.removeItem(USER_KEY);
      }
    }
  }, []);

  const loginUser = async (userData) => {
    setUser(userData);
    userRef.current = userData;
    localStorage.setItem(USER_KEY, JSON.stringify(userData));

    if (userData.status === 'suspended') {
      setSuspended(true);
    } else {
      setSuspended(false);
    }

    socket.connect();
    socket.emit('user_connected', userData._id);
  };

  const logoutUser = () => {
    setUser(null);
    userRef.current = null;
    setSuspended(false);
    localStorage.removeItem(USER_KEY);
    socket.emit('user_disconnected');
    socket.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, token: user?.token, loginUser, logoutUser, suspended, socket }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
