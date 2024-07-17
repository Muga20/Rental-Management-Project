import React from 'react';

interface LoadingBarProps {
  progress: number;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ progress }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-200  overflow-hidden z-50">
      <div
        className="h-1 bg-blue-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default LoadingBar;
