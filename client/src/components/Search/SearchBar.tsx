import React, { useState, ChangeEvent } from 'react';
import Buttons from '../Buttons/Buttons';
import Filter from './Filter'; // Adjust the import path as necessary

interface SearchBarProps {
  onSearch: (
    query: string,
    filters: {
      status: string;
      startDate: string;
      endDate: string;
      paymentType: string;
      location: string; // Add location property
      paymentStatus: string; // Add paymentStatus property
    },
  ) => void;
  status: string;
  startDate: string;
  endDate: string;
  paymentType: string;
  location: string; // Add location property
  paymentStatus: string; // Add paymentStatus property
  visibleFields: {
    status: boolean;
    startDate: boolean;
    endDate: boolean;
    paymentType: boolean;
    location: boolean; // Add location property visibility
    paymentStatus: boolean; // Add paymentStatus property visibility
  };
  placeholder: string; // Add placeholder prop
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  status: initialStatus,
  startDate: initialStartDate,
  endDate: initialEndDate,
  paymentType: initialPaymentType,
  location: initialLocation,
  paymentStatus: initialPaymentStatus,
  visibleFields,
  placeholder, // Add placeholder prop
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [paymentType, setPaymentType] = useState(initialPaymentType);
  const [location, setLocation] = useState(initialLocation);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus); // Add paymentStatus state

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query, {
      status,
      startDate,
      endDate,
      paymentType,
      location,
      paymentStatus,
    });
  };

  const handleFilterClick = () => {
    onSearch(searchQuery, {
      status,
      startDate,
      endDate,
      paymentType,
      location,
      paymentStatus,
    });
  };

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };

  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handlePaymentTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPaymentType(event.target.value);
  };

  const handleLocationChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  const handlePaymentStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPaymentStatus(event.target.value);
  };

  const handleReset = () => {
    setSearchQuery('');
    setStatus('');
    setStartDate('');
    setEndDate('');
    setPaymentType('');
    setLocation('');
    setPaymentStatus('');
  };

  return (
    <div>
      {!isModalOpen && (
        <button
          onClick={toggleModal}
          className="rounded-lg bg-blue-600 px-8 py-2 font-medium text-white outline-none hover:opacity-80 focus:ring"
        >
          Open Search
        </button>
      )}

      {isModalOpen && (
        <div className="m-10 w-full max-w-screen-lg mx-auto">
          <div className="flex flex-col">
            <div className="rounded-xl border border-gray-200  border-stroke bg-white  dark:border-strokedark dark:bg-boxdark p-6 shadow-lg">
              <form>
                <div className="relative mb-10 w-full flex items-center justify-between rounded-md">
                  <svg
                    className="absolute left-2 block h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    name="search"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="h-12 w-full cursor-text rounded-md border border-gray-100 dark:bg-boxdark bg-white  py-4 pr-40 pl-12 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder={placeholder}
                  />
                </div>
                <Filter
                  status={status}
                  startDate={startDate}
                  endDate={endDate}
                  paymentType={paymentType}
                  location={location}
                  paymentStatus={paymentStatus} // Pass paymentStatus to Filter component
                  visibleFields={visibleFields}
                  onStatusChange={handleStatusChange}
                  onStartDateChange={handleStartDateChange}
                  onEndDateChange={handleEndDateChange}
                  onPaymentTypeChange={handlePaymentTypeChange}
                  onLocationChange={handleLocationChange}
                  onPaymentStatusChange={handlePaymentStatusChange} // Pass onPaymentStatusChange
                />

                <div className="flex justify-end mt-4">
                  <Buttons
                    buttons={[
                      {
                        className:
                          'rounded-lg bg-gray-200 px-8 py-2 font-medium text-gray-700 outline-none hover:opacity-80 focus:ring mr-1',
                        label: 'Reset',
                        onClick: handleReset,
                      },
                      {
                        className:
                          'rounded-lg bg-blue-600 px-8 py-2 font-medium text-white outline-none hover:opacity-80 focus:ring mr-2',
                        label: 'Filter',
                        onClick: handleFilterClick,
                      },
                    ]}
                  />

                  <Buttons
                    buttons={[
                      {
                        className:
                          'rounded-lg bg-red-600 px-8 py-2 font-medium text-white outline-none hover:opacity-80 focus:ring',
                        label: 'Close Search',
                        onClick: toggleModal,
                      },
                    ]}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
