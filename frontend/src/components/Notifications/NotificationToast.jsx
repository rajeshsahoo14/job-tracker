import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

const NotificationToast = ({ token }) => {
  useEffect(() => {
    if (!token) return;

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    const socket = io(SOCKET_URL, {
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('✅ Connected to notification service');
    });

    socket.on('jobAdded', (data) => {
      toast.success(data.message, {
        position: 'top-right',
        autoClose: 5000
      });
    });

    socket.on('jobUpdated', (data) => {
      toast.info(data.message, {
        position: 'top-right',
        autoClose: 5000
      });
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from notification service');
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return null;
};

export default NotificationToast;