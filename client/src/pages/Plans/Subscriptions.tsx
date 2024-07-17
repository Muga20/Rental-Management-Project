import React, { useState, useEffect } from 'react';
import { api } from '../../middleware/Api'; // Adjust the import path as necessary
import Table from '../../components/Tables/Table';
import TableSkeleton from '../../components/Skeleton/TableSk';
import PagingBTN from '../../components/Buttons/PagingBTN';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SearchBar from '../../components/Search/SearchBar';
import { SubscribedCompanies } from '../../types/interfaces';

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Subscriptions: React.FC = () => {
  const [companies, setCompanies] = useState<SubscribedCompanies[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<SubscribedCompanies[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);
  const [paymentStatus, ] = useState<string>('');
  const [startDate, ] = useState<string>('');
  const [endDate, ] = useState<string>(''); 

  const fetchCompaniesData = async (page: number = 1): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api(
        `/subscription/companies-subscribed?page=${page}`,
        'GET',
      );

      if (response && response.data.companies.data) {
        setCompanies(response.data.companies.data);
        setCurrentPage(response.data.companies.current_page);
        setTotalUsers(response.data.companies.total);
        setPerPage(response.data.companies.per_page);
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
      console.error('Error fetching companies data:', err);
    }
  };

  useEffect(() => {
    fetchCompaniesData();
  }, []);

  useEffect(() => {
    setFilteredCompanies(companies);
  }, [companies]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (
    query: string,
    filters: {
      startDate: string;
      endDate: string;
      paymentType: string;
      paymentStatus: string;
    },
  ) => {
    const { startDate, endDate, paymentStatus } = filters;

    // Filter the companies array based on the provided filters
    let filteredData = companies.filter((company) => {
      let match = true;

      if (query && !company.name.toLowerCase().includes(query.toLowerCase())) {
        match = false;
      }

      if (
        paymentStatus &&
        company.transactionStatus.toLowerCase() !== paymentStatus.toLowerCase()
      ) {
        match = false;
      }

      if (
        startDate &&
        new Date(company.transactionDate) < new Date(startDate)
      ) {
        match = false;
      }

      if (endDate && new Date(company.transactionDate) > new Date(endDate)) {
        match = false;
      }

      return match;
    });

    // Update the filteredCompanies state with the filtered data
    setFilteredCompanies(filteredData);
  };

  const columns = [
    {
      header: 'Profile',
      accessor: (row: SubscribedCompanies) => (
        <img
          src={row.logoImage}
          alt={`${row.name} logo`}
          className="w-10 h-10 rounded-full"
        />
      ),
    },
    { header: 'Company Name', accessor: 'name' },
    { header: 'Plan', accessor: 'plan_name' },
    {
      header: 'Plan Price',
      accessor: (row: SubscribedCompanies) => `Ksh ${row.price.toLocaleString()}`,
    },
    {
      header: 'Paid Amount',
      accessor: (row: SubscribedCompanies) => `Ksh ${row.amount_paid.toLocaleString()}`,
    },
    { header: 'Confirmation Code', accessor: 'confirmationCode' },
    { header: 'Transaction Date', accessor: 'transactionDate' },
    {
      header: 'Status',
      accessor: (row: SubscribedCompanies) => (
        <span
          className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
            row.transactionStatus === 'completed'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              : row.transactionStatus === 'requested'
              ? 'bg-orange-100 text-orange-500 dark:bg-orange-800 dark:text-orange-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
          }`}
        >
          <span
            className={`w-2 h-2 me-1 rounded-full ${
              row.transactionStatus === 'completed'
                ? 'bg-green-500'
                : row.transactionStatus === 'pending'
                ? 'bg-orange-500'
                : 'bg-red-500'
            }`}
          ></span>
          {capitalizeFirstLetter(row.transactionStatus)}
        </span>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Subscriptions" />
      <div className="pb-3">
        <SearchBar
          onSearch={handleSearch}
          status={''}
          startDate={startDate}
          endDate={endDate}
          paymentType={''}
          location={''}
          paymentStatus={paymentStatus}
          placeholder={'Search by Company name'}

          visibleFields={{
            status: false,
            startDate: true,
            endDate: true,
            paymentType: false,
            location: false,
            paymentStatus: true,
          }}
        />
      </div>
      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className=" dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            {loading ? (
              <TableSkeleton />
            ) : error ? (
              <p>{error}</p>
            ) : (
              <Table columns={columns} data={filteredCompanies} />
            )}
          </div>
          <PagingBTN
            currentPage={currentPage}
            totalUsers={totalUsers}
            perPage={perPage}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
    </DefaultLayout>
  );
};

export default Subscriptions;
