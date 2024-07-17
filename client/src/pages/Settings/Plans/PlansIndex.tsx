import { useEffect, useState } from 'react';
import useFetchPlans from '../../../constants/Plans';
import TableSkeleton from '../../../components/Skeleton/TableSk';
import { Link, useNavigate } from 'react-router-dom';
import ActionButtons from '../../../components/Buttons/ActionButtons';

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const PlansIndex = () => {
  const { plans, loading, error, fetchPlans } = useFetchPlans(); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  function refreshPayments(): void {
    fetchPlans();
  }

  const handlePlaneCreation = () => {
    navigate('/setting/plan/create-plan')
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
     
      <button
        type="button"
        className="text-white justify-end bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        onClick={handlePlaneCreation}
      >
        Create a new plan
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
                      Plan Name
                    </th>
                    <th scope="col" className="px-4 py-3 text-black dark:text-bodydark1">
                      Plan Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-black dark:text-bodydark1">
                      Plan Price
                    </th>
                    <th scope="col" className="px-4 py-3 text-black dark:text-bodydark1">
                      Plan Duration
                    </th>
                    <th scope="col" className="px-4 py-3 text-black dark:text-bodydark1">
                      Homes
                    </th>
                    <th scope="col" className="px-4 py-3 text-black dark:text-bodydark1">
                      Agents
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
                  {plans.map((plan) => (
                    <tr key={plan.id} className="border-b dark:border-gray-700">
                      <td className="px-4 py-3  text-black dark:text-bodydark1">
                        {capitalizeFirstLetter(plan.plan_name)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            plan.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 me-1 rounded-full ${
                              plan.status === 'active'
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}
                          ></span>
                          {capitalizeFirstLetter(plan.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3  text-black dark:text-bodydark1">{plan.price}</td>
                      <td className="px-4 py-3 text-black dark:text-bodydark1">
                        {' '}
                        {capitalizeFirstLetter(plan.duration)}
                      </td>
                      <td className="px-4 py-3 text-black dark:text-bodydark1">{plan.number_of_homes}</td>
                      <td className="px-4 py-3 text-black dark:text-bodydark1">{plan.number_of_agents}</td>

                      <td className="px-4py-3 text-black dark:text-bodydark1">
                        <Link to="">Edit</Link>
                      </td>
                      <td className="px-4 py-3 text-black dark:text-bodydark1">
                        <div className="flex">
                          <ActionButtons
                            deactivateEndpoint={`/plans/toggle-plan-status/${plan.id}`}
                            deactivateMessage={
                              plan.status === 'active'
                                ? 'Are you sure you want to Deactivate this Plan?'
                                : 'Are you sure you want to Activate this Plan?'
                            }
                            actionDeactivateActivateColor={
                              plan.status === 'active'
                                ? 'bg-red-500'
                                : 'bg-green-500'
                            }
                            actionName={
                              plan.status === 'active'
                                ? 'Deactivate'
                                : 'Activate'
                            }
                            fetchData={refreshPayments}
                            deleteEndpoint={`/plans/delete-plan/${plan.id}`}
                            deleteMessage={
                              'Are you sure you want to delete this Plan?'
                            }
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

export default PlansIndex;
