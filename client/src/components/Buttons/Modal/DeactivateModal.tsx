import React, { useState } from 'react';
import { api } from '../../../middleware/Api';
import { useAlert } from '../../../context/AlertContext';

interface DeactivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  deactivateMessage: string;
  deactivateEndpoint: string;
  actionDeactivateActivateColor: string;
  fetchData: () => void;
}

const DeactivateModal: React.FC<DeactivateModalProps> = ({
  isOpen,
  onClose,
  deactivateMessage,
  deactivateEndpoint,
  actionDeactivateActivateColor,
  fetchData,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setAlert } = useAlert();

  const handleAction = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call API to deactivate or delete company
      const response = await api(deactivateEndpoint, 'PUT'); // Assuming PUT request

      // Handle success based on API response
      if (response?.success) {
        setAlert({
          success: response.success ?? true,
          message: response.message ?? 'Action successful',
          error: null,
        });
      }
      fetchData();
      // Close the modal
      onClose();
    } catch (error: any) {
      const errorMessage = error?.message;
      setAlert({
        success: false,
        message: errorMessage,
        error: error?.message || null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg"></div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white py-6 dark:border-strokedark dark:bg-[#1A222C] rounded-lg p-5 shadow-lg w-96">
            <div className="p-4 md:p-5 text-center">
              <h3 className="mb-5 text-lg font-normal text-black dark:text-bodydark1">
                {deactivateMessage}
              </h3>
              <button
                type="button"
                className={`text-black ${actionDeactivateActivateColor} focus:ring-4 focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-5`}
                onClick={handleAction}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Yes, Confirm'}
              </button>
              <button
                type="button"
                className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={onClose}
                disabled={loading}
              >
                No, Cancel
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          
          </div>
        </div>
      )}
    </>
  );
};

export default DeactivateModal;
