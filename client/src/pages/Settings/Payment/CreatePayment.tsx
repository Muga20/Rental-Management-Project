import React, { useState } from 'react';
import InputFDProp from '../../../components/Forms/InputFields/InputFD';
import { useAlert } from '../../../context/AlertContext';
import { api } from '../../../middleware/Api';
import { useLoading } from '../../../context/LoadingContext';
import { AxiosProgressEvent } from 'axios';
import SVGIcons from '../../../components/Icons/SVGIcons';

interface CreateRoleProps {
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
  refreshPayments: () => void;
}

function CreatePayment({ onClose, refreshPayments }: CreateRoleProps) {
  const { setLoading, setProgress } = useLoading();
  const { setAlert } = useAlert();
  const [name, setPaymentName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '') {
      setAlert({
        success: false,
        message: 'Payment type name is required.',
        error: null
      });
    } else {
      setLoading(true);
      try {
        const trackProgress = (event: AxiosProgressEvent) => {
          if (!event.total) return;
          const progress = Math.round((event.loaded / event.total) * 100);
          setProgress(progress);
        };

        const response = await api(
          '/payment/create-Payment',
          'POST',
          {},
          { name },
          trackProgress,
        );

        if (response) {
          setAlert({
            success: response.success ?? true ,
            message: response.message || 'Action successful',
            error: null,
          });

          setPaymentName('');
          refreshPayments(); // Refresh the payments list after successful creation
        }
      } catch (error: any) {
        const errorMessage = error?.message || 'An error occurred';
        setAlert({
          success: false,
          message: errorMessage,
          error: errorMessage,
        });
      } finally {
        setLoading(false);
        setProgress(0);
      }
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-96">
      <div className="border-b border-stroke py-4 px-7 dark:border-strokedark flex justify-between items-center">
        <h3 className="font-medium text-black dark:text-white">
          Create New Payment Method
        </h3>
        <button
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
          onClick={onClose} // Call onClose when the close button is clicked
        >
          <SVGIcons iconName="close" />
        </button>
      </div>
      <div className="p-7">
        <form onSubmit={handleSubmit}>
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="paymentTypeName"
            >
              Payment Type Name<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <InputFDProp
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                name="Name"
                value={name}
                onChange={handleChange}
                placeholder="Enter Payment Type Name"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4.5">
            <button
              className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePayment;
