import React, { useState, useEffect } from 'react';
import useFetchUsers from '../../constants/Members';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import ProfileSk from '../../components/Skeleton/ProfileSk';
import NewMemberSk from './Sub/NewMemberSk';
import SearchBar from '../../components/Search/SearchBar';
import UserCardSkeleton from '../../components/Skeleton/StaffSk';

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Staff: React.FC = () => {
  const { users, loading, error } = useFetchUsers();
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [status] = useState('');
  const [startDate] = useState('');
  const [endDate] = useState('');
  const [paymentType] = useState('');

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleSearch = (
    query: string,
    filters: {
      status: string;
      startDate: string;
      endDate: string;
      paymentType: string;
    },
  ) => {
    const { status } = filters;
    let filtered = users.filter((user) => {
      const matchesQuery =
        user.detail?.first_name?.toLowerCase().includes(query.toLowerCase()) ||
        user.detail?.last_name?.toLowerCase().includes(query.toLowerCase());

      const matchesStatus = status ? user.status === status : true;

      return matchesQuery && matchesStatus;
    });

    setFilteredUsers(filtered);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Staff" />
      <div className="pb-3">
        <SearchBar
          onSearch={handleSearch}
          status={status}
          startDate={''}
          endDate={''}
          paymentType={''}
          location={''}
          placeholder={'Search by Members names '}
          paymentStatus={''}
          visibleFields={{
            status: true,
            startDate: false,
            endDate: false,
            paymentType: false,
            location: false,
            paymentStatus: false,
          }}
        />
      </div>

      {loading ? (
        <UserCardSkeleton />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <NewMemberSk />
          {filteredUsers.map((user, index) => (
            <div
              key={index}
              className="w-full max-w-sm border border-gray-200 rounded-lg  bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark "
            >
              <div className="flex flex-col items-center pb-10 pt-5">
                <img
                  className="w-24 h-24 mb-3 rounded-full shadow-lg"
                  src={
                    user.detail?.profileImage || '/path/to/default-image.jpg'
                  }
                  alt={`${user.detail?.first_name} ${user.detail?.last_name}`}
                />
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                  {`${user.detail?.first_name} ${user.detail?.last_name}`}
                </h5>
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  {user.roles.map((role) => role.name).join(', ')}
                </span>
                <span
                  className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    user.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}
                >
                  <span
                    className={`w-2 h-2 me-1 rounded-full ${
                      user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></span>
                  {capitalizeFirstLetter(user.status)}
                </span>
                <div className="flex mt-4 md:mt-6">
                  <a
                    href="#"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    View Profile
                  </a>
                  <a
                    href="#"
                    className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Message
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DefaultLayout>
  );
};

export default Staff;
