import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { UseCartContext } from '../../hooks/UseCartContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../middleware/Api';
import { useUserData } from '../../constants/UserData';

interface CartItem {
  id: number;
  name: string;
  price: number;
}


function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useUserData();
  const navigate = useNavigate();

  const { cartItems, removeFromCart } = UseCartContext();

  const handlePaymentMethodChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setPaymentMethod(e.target.value);
  };

  const handlePhoneNumberChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setPhoneNumber(e.target.value);
  };

  const handleProceed = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const planId = cartItems.map(item => item?.id); // Extracting ids from cartItems
      const companyId = userData?.company?.id; // Extracting companyId from userData

      const response = await api(
        '/checkout/initiatePayment',
        'POST',
        {},
        {
          phoneNumber,
          planId : planId[0], 
          companyId, 
        },
      );

      setIsLoading(false);
      alert('Transaction Complete');
      // Redirect or perform any other action upon successful payment
    } catch (error) {
      setIsLoading(false);
      console.error('Error occurred during payment:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const handleCancel = () => {
    cartItems.forEach((item: { id: any }) => removeFromCart(item.id));
    navigate('/dashboard/plans');
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Checkout" />
      <section className="bg-[#24303F] rounded py-8 antialiased dark:bg-gray-900 md:py-16">
        <form action="#" className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          {/* Checkout Steps */}
          <ol className="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
            {/* Checkout Step 1 */}
            <li className="after:border-1 flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
              <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
                <svg
                  className="me-2 h-4 w-4 sm:h-5 sm:w-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Checkout
              </span>
            </li>

            {/* Checkout Step 2 */}
            <li className="flex shrink-0 items-center">
              <svg
                className="me-2 h-4 w-4 sm:h-5 sm:w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Order summary
            </li>
          </ol>

          {/* Payment Details */}
          <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
            {/* Payment Details Form */}
            <div className="min-w-0 flex-1 space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-200 dark:text-white">
                  Payment Details
                </h2>

                {/* Payment Method Dropdown */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="payment_method"
                      className="block mb-2 text-base font-medium text-gray-200 dark:text-white"
                    >
                      Payment Method
                    </label>
                    <select
                      id="payment_method"
                      value={paymentMethod}
                      onChange={handlePaymentMethodChange}
                      className="block w-96 px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-stone-800	 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="" disabled selected>
                        Select payment method
                      </option>
                      <option value="cash">Cash</option>
                      <option value="mobile_money">Mobile Money</option>
                    </select>
                  </div>

                  {/* Phone Number Input */}
                  {paymentMethod === 'mobile_money' && (
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="phone_number"
                        className="mb-2 block text-sm font-medium text-gray-200 dark:text-white"
                      >
                        Phone Number
                      </label>
                      <input
                        type="text"
                        id="phone_number"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                        placeholder="070000"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
              <div className="flow-root">
                <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
                  <div className="flow-root">
                    <div className="-my-3 divide-y divide-gray-200 dark:divide-gray-800">
                      {/* Map through the cartItems and display each item */}
                      {cartItems.map((item: CartItem, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-6 py-3"
                        >
                          <div className="flex items-center">
                            <div className="ml-4">
                              <p className="text-base font-medium text-gray-800 dark:text-white">
                                {item.name}
                              </p>
                            </div>
                          </div>
                          <div className="text-base font-medium text-gray-800 dark:text-white">
                            Ksh {item.price}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex">
                {/* Proceed Button */}
                <button
                  type="button"
                  onClick={handleProceed}
                  className={`text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2 ${
                    isLoading && 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="relative inline-flex items-center">
                      <div className="w-4 h-4 mr-2 border-b-2 border-gray-100 dark:border-gray-800 rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span>Proceed</span>
                  )}
                </button>

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2zm1.414 3.586a1 1 0 0 1 1.414 1.414L11.414 10l2.828 2.828a1 1 0 1 1-1.414 1.414L10 11.414l-2.828 2.828a1 1 0 1 1-1.414-1.414L8.586 10 5.758 7.172a1 1 0 0 1 1.414-1.414L10 8.586l2.828-2.828z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </DefaultLayout>
  );
}

export default Checkout;
