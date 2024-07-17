import { useState, useEffect } from 'react';
import TableSkeleton from '../../../components/Skeleton/TableSk';
import ActionButtons from '../../../components/Buttons/ActionButtons';
import { Link, useNavigate } from 'react-router-dom';
import CreateRole from './CreateRole'; // Import the CreateRole modal component
import { useFetchRoles } from '../../../constants/Roles';

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const RolesIndex = () => {
  const { roles, loading, error, fetchRoles } = useFetchRoles();
  const navigate = useNavigate();
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateRoleClick = () => {
    setShowCreateRoleModal(true); // Show modal on button click
  };

  const handleCloseModal = () => {
    setShowCreateRoleModal(false); // Close modal
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      {showCreateRoleModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-blur-lg">
          {/* Use backdrop-filter to blur the content behind */}
          <div className="bg-opacity-75 bg-gray-800 absolute inset-0"></div>
          {/* Optional: overlay to control the opacity of the blur effect */}
          <div className="rounded-lg p-8 shadow-xl relative z-10">
            <CreateRole onClose={handleCloseModal} refreshRoles={fetchRoles} />
          </div>
        </div>
      )}

      <button
        type="button"
        className="text-white justify-end bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        onClick={handleCreateRoleClick}
      >
        Create a new role
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
                      Role Name
                    </th>
                    <th scope="col" className="px-4 py-3 text-black dark:text-bodydark1">
                      Role Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-black dark:text-bodydark1">
                      Owned By
                    </th>
                    <th scope="col" className="px-4 py-3 text-black dark:text-bodydark1">
                      Modify
                    </th>
                    <th scope="col" className="px-4 py-3 text-black dark:text-bodydark1">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.id} className="border-b dark:border-gray-700">
                      <td className="px-4 text-lg py-3 text-black dark:text-bodydark1">
                        {capitalizeFirstLetter(role.name)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            role.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 me-1 rounded-full ${
                              role.status === 'active'
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}
                          ></span>
                          {capitalizeFirstLetter(role.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-lg  text-black dark:text-bodydark1">{role.users_count}</td>
                      <td className="px-4 py-3 text-lg  text-black dark:text-bodydark1">
                        <Link to="">Edit</Link>
                      </td>
                      <td className="px-4 py-3  text-black dark:text-bodydark1">
                        <div className="flex">
                          <ActionButtons
                            deactivateEndpoint={`/roles/toggleRoles/${role.id}`}
                            deactivateMessage={
                              role.status === 'active'
                                ? 'Are you sure you want to Deactivate this Role?'
                                : 'Are you sure you want to Activate this Role?'
                            }
                            actionDeactivateActivateColor={
                              role.status === 'active'
                                ? 'bg-red-500'
                                : 'bg-green-500'
                            }
                            actionName={
                              role.status === 'active'
                                ? 'Deactivate'
                                : 'Activate'
                            }
                            fetchData={fetchRoles}
                            deleteEndpoint={`/roles/delete_role/${role.id}`}
                            deleteMessage={
                              'Are you sure you want to delete this Role?'
                            }
                            rolesEndpoint={''}
                            rolesMessage={''}
                            roles={[]}
                            userId=""
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
