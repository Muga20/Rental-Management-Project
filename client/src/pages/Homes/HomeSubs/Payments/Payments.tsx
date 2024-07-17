import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../../middleware/Api';
import { AxiosProgressEvent } from 'axios';
import { useAlert } from '../../../../context/AlertContext';
import { useLoading } from '../../../../context/LoadingContext';

const Payments = () => {
  const { id } = useParams<{ id: string }>();
  const [paymentData, setPaymentData] = useState<any[]>([]);
  const { setLoading, setProgress } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAlert } = useAlert();

  const fetchHomeProfileData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api(`/payment/get-home-payment-type/${id}`, 'GET');

      if (
        response &&
        response.data &&
        Array.isArray(response.data.paymentTypes)
      ) {
        setPaymentData(response.data.paymentTypes);
      } else {
        throw new Error('Invalid response structure');
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      console.error('Error fetching payment data:', err);
    }
  };

  useEffect(() => {
    fetchHomeProfileData();
  }, [id]);

  const handleAddPaymentChannel = () => {
    navigate(`/home/${id}/create-payment`);
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleEditPayment = (payment: any) => {
    navigate(`/home/edit-payment/${payment.id}`, {
      state: { payment }
    });
  };

  const handleDeletePayment = async (paymentId: string) => {
    setLoading(true);
    try {
      const trackProgress = (event: AxiosProgressEvent) => {
        if (!event.total) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setProgress(progress);
      };

      const response = await api(
        `/payment/delete-home-payment-info/${paymentId}`,
        'DELETE',
        {},
        {},
        trackProgress,
      );

      if (response) {
        await fetchHomeProfileData();
        setAlert({
          success: response.success ?? true,
          message: response.message ?? 'Payment Removed Successfully.',
          error: null,
        });
      }
    } catch (error: any) {
      setAlert({
        success: false,
        message: error.message || 'Error deleting agent.',
        error: null,
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Payment Channels
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-200 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Payment Type
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              PayBill
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Account No
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Status
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Action
            </h5>
          </div>
        </div>

        {/* Payment Channels List */}
        <div className="flex flex-col mt-2">
          {paymentData.map((payment, index) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-5 ${
                index === paymentData.length - 1
                  ? ''
                  : 'border-b border-stroke dark:border-strokedark'
              }`}
              key={payment.id}
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <div className="flex-shrink-0">
                  <img
                    src={payment.payment_channel.channel_logo}
                    alt="Payment Logo"
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <p className="text-black dark:text-white">
                  {payment.payment_channel.channel_name}
                </p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">
                  {payment.account_payBill}
                </p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">
                  {payment.account_number}
                </p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                {/* Status Indicator */}
                <span
                  className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    payment.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}
                >
                  <span
                    className={`w-2 h-2 me-1 rounded-full ${
                      payment.status === 'active'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  ></span>
                  {capitalizeFirstLetter(payment.status)}
                </span>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                {/* Actions: Edit and Delete Icons */}
                <button
                  className="text-blue-500 hover:text-blue-600 focus:outline-none"
                  onClick={() => handleEditPayment(payment)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.707 3.293a1 1 0 010 1.414l-10 10a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l10-10a1 1 0 011.414 0l4 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <button
                  className="rounded-full bg-red-500 p-2 hover:bg-red-600 text-white transition duration-300"
                  onClick={() => handleDeletePayment(payment.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Payment Channel Button */}
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            onClick={handleAddPaymentChannel}
          >
            Add Payment Channel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payments;
