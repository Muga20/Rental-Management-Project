import React, { ChangeEvent } from 'react';

interface FilterProps {
  status: string;
  startDate: string;
  endDate: string;
  paymentType: string;
  location: string; 
  paymentStatus: string; // Added paymentStatus property
  visibleFields: {
    status: boolean;
    startDate: boolean;
    endDate: boolean;
    paymentType: boolean;
    location: boolean; 
    paymentStatus: boolean; // Added paymentStatus property visibility
  };
  onStatusChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onStartDateChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onEndDateChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPaymentTypeChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onLocationChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPaymentStatusChange: (event: ChangeEvent<HTMLSelectElement>) => void; // Added onPaymentStatusChange
}

const Filter: React.FC<FilterProps> = ({
  status,
  startDate,
  endDate,
  paymentType,
  location,
  visibleFields,
  paymentStatus, // Added paymentStatus to destructuring
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onPaymentTypeChange,
  onLocationChange, 
  onPaymentStatusChange // Added onPaymentStatusChange
}) => {
  return (
    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
      {visibleFields.status && (
        <div className="w-full sm:w-1/2">
          <label
            htmlFor="status"
            className="text-sm font-medium text-black dark:text-bodydark1"
          >
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={onStatusChange}
            className="mt-2 block w-full cursor-pointer rounded-md border border-gray-100  bg-white  dark:border-strokedark dark:bg-boxdark  px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      )}

      {visibleFields.paymentStatus && (
        <div className="w-full sm:w-1/2">
          <label
            htmlFor="paymentStatus"
            className="text-sm font-medium text-black dark:text-bodydark1"
          >
            Payment Status
          </label>
          <select
            id="paymentStatus"
            value={paymentStatus}
            onChange={onPaymentStatusChange} // Changed to onPaymentStatusChange
            className="mt-2 block w-full cursor-pointer rounded-md border border-gray-100  bg-white  dark:border-strokedark dark:bg-boxdark px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="">Select Status</option>
            <option value="requested">Requested</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      )}

      {visibleFields.startDate && (
        <div className="w-full sm:w-1/2">
          <label
            htmlFor="startDate"
            className="text-sm font-medium text-black dark:text-bodydark1"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={onStartDateChange}
            className="mt-2 block w-full cursor-pointer rounded-md border border-gray-100  bg-white  dark:border-strokedark dark:bg-boxdark px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
      )}

      {visibleFields.endDate && (
        <div className="w-full sm:w-1/2">
          <label
            htmlFor="endDate"
            className="text-sm font-medium text-black dark:text-bodydark1"
          >
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={onEndDateChange}
            className="mt-2 block w-full cursor-pointer rounded-md border border-gray-100  bg-white  dark:border-strokedark dark:bg-boxdark px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
      )}

      {visibleFields.paymentType && (
        <div className="w-full sm:w-1/2">
          <label
            htmlFor="paymentType"
            className="text-sm font-medium text-black dark:text-bodydark1"
          >
            Payment Type
          </label>
          <select
            id="paymentType"
            value={paymentType}
            onChange={onPaymentTypeChange}
            className="mt-2 block w-full cursor-pointer rounded-md border border-gray-100  bg-white  dark:border-strokedark dark:bg-boxdark  px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="">Select Payment Type</option>
            <option value="Water">Water</option>
            <option value="Rent">Rent</option>
            <option value="Garbage">Garbage</option>
          </select>
        </div>
      )}

      {visibleFields.location && (
        <div className="w-full sm:w-1/2">
          <label
            htmlFor="location"
            className="text-sm font-medium text-black dark:text-bodydark1"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={onLocationChange}
            className="mt-2 block w-full cursor-pointer rounded-md border border-gray-100  bg-white  dark:border-strokedark dark:bg-boxdark  px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
      )}
    </div>
  );
};

export default Filter;
