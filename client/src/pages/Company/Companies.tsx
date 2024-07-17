import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SearchBar from '../../components/Search/SearchBar';
import PagingBTN from '../../components/Buttons/PagingBTN';
import TableSkeleton from '../../components/Skeleton/TableSk';
import { api } from '../../middleware/Api';
import useFetchCompany from '../../constants/Companies';
import { Company } from '../../types/interfaces';

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Companies: React.FC = () => {
  const { companies, loading, error, fetchCompanies } = useFetchCompany(); // Use the custom hook
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);
  const [status, ] = useState<string>('');
  const [location, ] = useState<string>('');

  useEffect(() => {
    setFilteredCompanies(companies); 
  }, [companies]);

  const handleSearch = async (
    query: string,
    filters: {
      status: string;
      startDate: string;
      endDate: string;
      paymentType: string;
      location?: string;
    },
  ) => {
    const { status, location } = filters;

    try {
      let apiUrl = `/company/showAvailableCompanies?page=${currentPage}`;

      if (query) {
        apiUrl += `&keyword=${encodeURIComponent(query)}`;
      }

      if (location) {
        apiUrl += `&location=${encodeURIComponent(location)}`;
      }
      if (status) {
        apiUrl += `&status=${encodeURIComponent(status)}`;
      }

      const response = await api(apiUrl, 'GET');

      if (response && response.data.companies.data) {
        setFilteredCompanies(response.data.companies.data);
        setCurrentPage(response.data.companies.current_page);
        setTotalUsers(response.data.companies.total);
        setPerPage(response.data.companies.per_page);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.error('Error fetching companies data:', err);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCompanies(); // Fetch companies for the new page
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Companies" />
      <div className="pb-3">
        <SearchBar
          onSearch={handleSearch}
          status={status}
          startDate={''}
          endDate={''}
          paymentType={''}
          location={location}
          paymentStatus={''}
          placeholder={'Search by company name'}
          visibleFields={{
            status: true,
            startDate: false,
            endDate: false,
            paymentType: false,
            location: true,
            paymentStatus: false,
          }}
        />
      </div>
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
          <div className="mx-auto max-w-screen-xl px-4">
            <div className="dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-4 py-3">Name</th>
                      <th scope="col" className="px-4 py-3">Phone</th>
                      <th scope="col" className="px-4 py-3">Location</th>
                      <th scope="col" className="px-4 py-3">Members</th>
                      <th scope="col" className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b dark:border-gray-700">
                        <td className="px-4 py-3 ">
                          <div className="flex items-center gap-1">
                            <img
                              src={row.logoImage}
                              alt={`${row.name} logo`}
                              className="w-12 h-12 rounded-full mr-2"
                            />
                            <span className="text-lg text-black dark:text-bodydark1">
                              {capitalizeFirstLetter(row.name)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{row.phone}</td>
                        <td className="px-4 py-3">{row.location}</td>
                        <td className="px-4 py-3">{row.users_count}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
                              row.status === 'active'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 me-1 rounded-full ${
                                row.status === 'active'
                                  ? 'bg-green-500'
                                  : 'bg-red-500'
                              }`}
                            ></span>
                            {capitalizeFirstLetter(row.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <PagingBTN
              currentPage={currentPage}
              totalUsers={totalUsers}
              perPage={perPage}
              onPageChange={handlePageChange}
            />
          </div>
        </section>
      )}
    </DefaultLayout>
  );
};

export default Companies;
