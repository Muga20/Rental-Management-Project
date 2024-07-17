import React, { useState } from 'react';
import InputFDProp from '../../../components/Forms/InputFields/InputFD';
import Upload from '../../../components/Forms/InputFields/Upload';
import { api } from '../../../middleware/Api';
import useFetchPayments from '../../../constants/Payments';
import SVGIcons from '../../../components/Icons/SVGIcons';

interface CreateChannelsProps {
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
  refreshPaymentsChannels: () => void;
}

const CreatePaymentChannels = ({
  onClose,
  refreshPaymentsChannels,
}: CreateChannelsProps) => {
  const [alert, setAlert] = useState<{
    success: boolean;
    message: string | null;
  }>({ success: false, message: null });
  const { payments } = useFetchPayments(); // Assuming this hook returns `payments` array

  const [formValues, setFormValues] = useState({
    channel_name: '',
    payment_type_id: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false); // State to manage loading state of the form submission

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true); // Start loading indicator

    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    if (selectedFile) {
      formData.append('channel_logo', selectedFile);
    }

    try {
      const response = await api(
        '/payment/store-payment-channel',
        'POST',
        {},
        formData,
      );

      if (response) {
        setAlert({
          success: response.success ?? true,
          message: response.message || 'Action successful',
        });

        refreshPaymentsChannels(); // Refresh payments after successful submission

        setFormValues({
          channel_name: '',
          payment_type_id: '',
        });
        setSelectedFile(null);
      }
    } catch (error: any) {
      const errorMessage = error?.message;
      setAlert({
        success: false,
        message: errorMessage || 'An error occurred',
      });
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Filter payments with status 'active'
  const activePayments = payments.filter(
    (payment) => payment.status === 'active',
  );

  return (
    <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ">
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
          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="channel_name"
              >
                Channel Name
              </label>
              <div className="relative">
                <InputFDProp
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  name="channel_name"
                  value={formValues.channel_name}
                  onChange={handleChange}
                  placeholder="Channel Name"
                />
              </div>
            </div>

            <div className="w-full sm:w-1/2">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="payment_type_id"
              >
                Payment Type
              </label>
              <div className="relative">
                <select
                  id="payment_type_id"
                  name="payment_type_id"
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  value={formValues.payment_type_id}
                  onChange={handleChange}
                >
                  <option value="">Select Payment Type</option>
                  {activePayments.map((payment) => (
                    <option key={payment.id} value={payment.id}>
                      {payment.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-5.5">
            <Upload label="Upload Channel Logo" onChange={handleFileChange} />
          </div>

          <div className="flex justify-end gap-4.5">
            <button
              type="submit"
              className={`text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading && (
                <svg
                  className="animate-spin mr-2 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C6.37 0 2 4.37 2 9.75h2zm2 5.25a8 8 0 01-8-8H0c0 5.52 4.48 10 10 10v-2z"
                  ></path>
                </svg>
              )}
              {loading ? 'Adding...' : 'Add Payment Method'}
            </button>
          </div>
        </form>
        {alert.message && (
          <div
            className={`p-4 mt-4 text-sm ${
              alert.success
                ? 'text-green-700 bg-green-100'
                : 'text-red-700 bg-red-100'
            } rounded-lg`}
            role="alert"
          >
            {alert.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePaymentChannels;
