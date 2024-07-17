import React, { useEffect, useState } from 'react';
import useFetchPayments from '../../../constants/Payments';
import TableSkeleton from '../../../components/Skeleton/TableSk';
import { Link } from 'react-router-dom';
import ActionButtons from '../../../components/Buttons/ActionButtons';
import CreatePayment from './CreatePayment';

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const PaymentIndex = () => {
  const { payments, loading, error, fetchPayments } = useFetchPayments(); // Use the custom hook to fetch payments
  const [showCreatePaymentModal, setShowCreatePaymentModal] = useState(false); // State to control the visibility of the CreatePayment modal

  const handleCreatePaymentClick = () => {
    setShowCreatePaymentModal(true); // Show the CreatePayment modal when the button is clicked
  };

  const handleCloseModal = () => {
    setShowCreatePaymentModal(false); // Close the CreatePayment modal
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  function refreshPayments(): void {
    fetchPayments();
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 relative">
      {showCreatePaymentModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-blur-lg">
          {/* Use backdrop-filter to blur the content behind */}
          <div className="bg-opacity-75 bg-gray-800 absolute inset-0"></div>
          {/* Optional: overlay to control the opacity of the blur effect */}
          <div className="rounded-lg p-8 shadow-xl relative z-10">
            <CreatePayment onClose={handleCloseModal} refreshPayments={refreshPayments} />
          </div>
        </div>
      )}

      <button
        type="button"
        className="text-white justify-end bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        onClick={handleCreatePaymentClick}
      >
        Create a new payment method
      </button>

      <div className="mx-auto max-w-screen-xl px-4">
        <div className="dark:bg-gray-800 relative overflow-hidden">
          {loading ? (
            <TableSkeleton />
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-black dark:text-bodydark1">
                      Payment Name
                    </th>
                    <th scope="col" className="px-4 py-3 text-black dark:text-bodydark1">
                      Payment Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-black dark:text-bodydark1">
                      Modify
                    </th>
                    <th scope="col" className="px-4 py-3 text-black dark:text-bodydark1">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b dark:border-gray-700">
                      <td className="px-4 py-3 text-lg text-black dark:text-bodydark1">{capitalizeFirstLetter(payment.name)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            payment.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 me-1 rounded-full ${
                              payment.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          ></span>
                          {capitalizeFirstLetter(payment.status)}
                        </span>
                      </td>

                      <td className="px-4py-3 text-lg text-black dark:text-bodydark1">
                        <Link to="">Edit</Link>
                      </td>
                      <td className="px-4 py-3 text-lg text-black dark:text-bodydark1">
                        <div className="flex">
                          <ActionButtons
                            deactivateEndpoint={`/payment/deactivate_payment/${payment.id}`}
                            deactivateMessage={
                              payment.status === 'active'
                                ? 'Are you sure you want to Deactivate this Role?'
                                : 'Are you sure you want to Activate this Role?'
                            }
                            actionDeactivateActivateColor={
                              payment.status === 'active' ? 'bg-red-500' : 'bg-green-500'
                            }
                            actionName={payment.status === 'active' ? 'Deactivate' : 'Activate'}
                            fetchData={refreshPayments}
                            deleteEndpoint={`/payment/deleteThisPayment/${payment.id}`}
                            deleteMessage={'Are you sure you want to delete this Role?'}
                            rolesEndpoint={''}
                            rolesMessage={''}
                            roles={[]}
                            userId=''
                            userRoles={[]}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PaymentIndex;
