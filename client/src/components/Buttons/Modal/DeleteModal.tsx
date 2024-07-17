import React, { useState } from 'react';
import { api } from '../../../middleware/Api';
import { useAlert } from '../../../context/AlertContext';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  deleteMessage: string;
  deleteEndpoint: string;
  fetchData: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  deleteMessage,
  deleteEndpoint,
  fetchData,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setAlert } = useAlert();

  const handleAction = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api(deleteEndpoint, 'DELETE');

      if (response?.success) {
        setAlert({
          success: response.success ?? true,
          message: response.message ?? 'Delete action successful',
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
      {/* Backdrop Blur Effect */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg"></div>
        </div>
      )}

      {/* Modal Content */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white py-6 dark:border-strokedark dark:bg-[#1A222C] rounded-lg p-5 shadow-lg w-96">
            <div className="p-4 md:p-5 text-center">
              <svg
                className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3 className="mb-5 text-lg font-normal text-black dark:text-bodydark1">
                {deleteMessage}
              </h3>
              <button
                type="button"
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-5"
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

export default DeleteModal;
