import React from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { UseCartContext } from '../../hooks/UseCartContext';
import useFetchPlans, { Plan } from '../../constants/Plans';
import PlansSk from '../../components/Skeleton/PlansSk';

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Index: React.FC = () => {
  const { plans, loading, error } = useFetchPlans();
  const { cartItems, addToCart } = UseCartContext();

  const activePlans = plans.filter(plan => plan.status === 'active'); 

  const checkIfAdded = (product: Plan) =>
    cartItems.find((item: { id: number }) => item.id === product.id);

  const handleAddToCart = (plan: Plan) => {
    const cartItem = {
      id: plan.id,
      price: plan.price,
      number_of_agents: plan.number_of_agents,
      duration: plan.duration,
      name: plan.plan_name,
    };

    addToCart(cartItem);
  };

  return (
    <div>
      <DefaultLayout>
        <Breadcrumb pageName="Plans" />
        <section className="dark:bg-gray-900">
          <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
              <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                Designed for efficient property management
              </h2>
              <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
                This house and property management system is designed to meet
                the needs of personal use and projects alike.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {loading && <PlansSk/> }
              {error && <p className="text-red-500">{error}</p>}
              {activePlans.length > 0 &&
                activePlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex flex-col mx-4 mb-8 text-center text-gray-900 rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white"
                    style={{ width: 'calc(47% - 2rem)' }} // Apply fixed width here
                  >
                    <h3 className="mb-4 text-2xl font-semibold">
                      {capitalizeFirstLetter(plan.plan_name)}
                    </h3>
                    <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                      Best option for personal use & for your next project.
                    </p>
                    <div className="flex justify-center items-baseline my-8">
                      <span className="mr-2 text-5xl font-extrabold">
                        ksh{plan.price}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        /{plan.duration}
                      </span>
                    </div>
                    <ul role="list" className="mb-8 space-y-4 text-left">
                      <li className="flex items-center space-x-3">
                        <svg
                          className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span>{plan.number_of_homes} Homes</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <svg
                          className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span>{plan.number_of_agents} Agents</span>
                      </li>
                    </ul>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(plan)}
                      className={`text-white ${
                        checkIfAdded(plan)
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'
                      } font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
                      disabled={checkIfAdded(plan)}
                    >
                      {checkIfAdded(plan) ? 'Added to Cart' : 'Choose plan'}
                      <svg
                        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </DefaultLayout>
    </div>
  );
};

export default Index;
