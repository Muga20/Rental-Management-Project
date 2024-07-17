// LoadingContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface LoadingContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <LoadingContext.Provider value={{ loading, setLoading, progress, setProgress }}>
      {children}
    </LoadingContext.Provider>
  );
};
