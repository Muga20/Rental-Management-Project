import React, { useEffect, useState } from 'react';
import { HiCheckCircle, HiBan } from 'react-icons/hi';

interface AlertProps {
  success: boolean;
  message: string;
}

const Alerts: React.FC<AlertProps> = ({ success, message }) => {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const { borderColor, bgColor, textColor } = getStyles(success);

  return (
    showAlert && (
      <div
        className={`fixed bottom-10 right-10 md:right-20 w-[400px] border-l-6 ${borderColor} ${bgColor} px-7 py-8 md:p-9 rounded-lg shadow-md`}
      >
        <div className="flex w-full">
          <div
            className={`flex h-[34px] w-full max-w-[34px] items-center justify-center rounded-md ${borderColor} ${
              success ? 'bg-green' : 'bg-red'
            } mr-5`}
          >
            {success ? (
              <HiCheckCircle className="text-[#166534]" />
            ) : (
              <HiBan className="text-[#DC2626]" />
            )}
          </div>
          <div className="w-full">
            <p className={`text-base leading-relaxed font-bold ${textColor}`}>
              {message}
            </p>
          </div>
        </div>
      </div>
    )
  );
};

const getStyles = (success: boolean) => {
  return success
    ? {
        borderColor: 'border-[#34D399]',
        bgColor: 'bg-emerald-200',
        textColor: 'text-[#09090b]',
      }
    : {
        borderColor: 'border-[#DC2626]',
        bgColor: 'bg-[#FECACA]',
        textColor: 'text-[#DC2626]',
      };
};

export default Alerts;
