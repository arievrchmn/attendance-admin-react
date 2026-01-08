/* eslint-disable @typescript-eslint/no-explicit-any */

// src/hooks/useFCM.ts

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { requestNotificationPermission, onForegroundMessage } from '../lib/firebase';
import { subApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export function useFCM() {
  const [notificationCount, setNotificationCount] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Request permission and get token
    const setupFCM = async () => {
      const token = await requestNotificationPermission();

      if (token) {
        subApi.subscribeTopic(token, 'admin_profile_changes');

        // Listen for foreground messages
        const unsubscribe = onForegroundMessage((payload: any) => {
          console.log('Notification received:', payload);

          // Show toast notification
          const title = payload.notification?.title || 'New Notification';
          const body = payload.notification?.body || '';

          toast.success(`${title}: ${body}`, {
            duration: 5000,
            icon: '🔔',
          });

          // Increment notification count
          setNotificationCount((prev) => prev + 1);
        });

        return unsubscribe;
      }
    };

    setupFCM();
  }, [isAuthenticated]);

  const clearNotifications = () => {
    setNotificationCount(0);
  };

  return {
    notificationCount,
    clearNotifications,
  };
}
