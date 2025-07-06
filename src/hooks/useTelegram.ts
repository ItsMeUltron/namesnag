import { useEffect, useState } from 'react';
import { TelegramWebApp } from '../types/telegram';

export const useTelegram = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      setWebApp(tg);
      setUser(tg.initDataUnsafe?.user);
      
      // Initialize the app
      tg.ready();
      tg.expand();
      
      // Set theme
      document.body.style.backgroundColor = tg.backgroundColor || '#87CEEB';
    }
  }, []);

  const showAlert = (message: string) => {
    if (webApp) {
      webApp.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showConfirm = (message: string, callback: (confirmed: boolean) => void) => {
    if (webApp) {
      webApp.showConfirm(message, callback);
    } else {
      const result = confirm(message);
      callback(result);
    }
  };

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred(type);
    }
  };

  const notificationFeedback = (type: 'error' | 'success' | 'warning') => {
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.notificationOccurred(type);
    }
  };

  return {
    webApp,
    user,
    showAlert,
    showConfirm,
    hapticFeedback,
    notificationFeedback,
    isReady: !!webApp
  };
};
