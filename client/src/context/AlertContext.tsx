import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Alert {
  success: boolean;
  message: string;
  error: string | null;
}

interface AlertContextType {
  alert: Alert | null;
  setAlert: React.Dispatch<React.SetStateAction<Alert | null>>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<Alert | null>(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
