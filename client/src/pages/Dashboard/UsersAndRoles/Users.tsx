import React, { useState, useEffect } from 'react';
import PagingBTN from '../../../components/Buttons/PagingBTN';
import { api } from '../../../middleware/Api';
import { format } from 'date-fns';
import TableSkeleton from '../../../components/Skeleton/TableSk';
import ActionButtons from '../../../components/Buttons/ActionButtons';
import { useFetchRoles } from '../../../constants/Roles';
import { Role, User, UsersProps } from '../../../types/interfaces';

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Users: React.FC<UsersProps> = ({ selectedRole, searchQuery, status }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);
  const { roles } = useFetchRoles();

  const fetchUserData = async (
    page: number = 1,
    query: string = '',
    status: string = '',
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api(
        `/roles/${selectedRole}?page=${page}&keyword=${query}&status=${status}`,
        'GET',
      );

      if (response && response.data.roleList) {
        setUsers(response.data.roleList.data);
        setCurrentPage(response.data.roleList.current_page);
        setTotalUsers(response.data.roleList.total);
        setPerPage(response.data.roleList.per_page);
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
    }
  };

  useEffect(() => {
    fetchUserData(currentPage, searchQuery, status);
  }, [currentPage, selectedRole, searchQuery, status]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filter active roles
  const activeRoles = roles.filter((role: Role) => role.status === 'active');

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
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
                      <th scope="col" className="px-4 py-3">
                        Names
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Email
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Company
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Member since
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index} className="border-b dark:border-gray-700">
                        <td className="px-4 py-3 ">
                          <div className="flex items-center gap-1">
                            <img
                              src={user.detail.profileImage}
                              alt={`${user.detail.first_name} ${user.detail.last_name}`}
                              className="w-10 h-10 rounded-full"
                            />
                            <span className="font-medium text-black dark:text-bodydark1">
                              {`${capitalizeFirstLetter(
                                user.detail.first_name || '',
                              )} ${capitalizeFirstLetter(
                                user.detail.middle_name || '',
                              )} ${capitalizeFirstLetter(
                                user.detail.last_name || '',
                              )}`}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-black dark:text-bodydark1">
                          {user?.email || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-black dark:text-bodydark1">
                          {user.company?.name || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-black dark:text-bodydark1">
                          {user.detail.created_at &&
                            format(
                              new Date(user.detail.created_at),
                              'MMMM dd, yyyy',
                            )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
                              user.status === 'active'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 me-1 rounded-full ${
                                user.status === 'active'
                                  ? 'bg-green-500'
                                  : 'bg-red-500'
                              }`}
                            ></span>
                            {capitalizeFirstLetter(user.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <ActionButtons
                            deactivateEndpoint={`/roles/deactivate_user/${user.id}`}
                            deactivateMessage={
                              user.status === 'active'
                                ? 'Are you sure you want to Deactivate this User?'
                                : 'Are you sure you want to Activate this User?'
                            }
                            actionDeactivateActivateColor={
                              user.status === 'active'
                                ? 'bg-red-500'
                                : 'bg-green-500'
                            }
                            actionName={
                              user.status === 'active'
                                ? 'Deactivate'
                                : 'Activate'
                            }
                            fetchData={fetchUserData}
                            deleteEndpoint={''}
                            deleteMessage={''}
                            rolesEndpoint={''}
                            rolesMessage={`Add or Remove a role from a user. Currently, this user has the following roles: ${user.roles
                              .map((role) => role.name)
                              .join(', ')}`}
                            roles={activeRoles}
                            userId={user.id}
                            userRoles={user.roles}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <PagingBTN
              currentPage={currentPage}
              totalUsers={totalUsers}
              perPage={perPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Users;
