import React, { useState, useEffect } from 'react';
import { api } from '../../../../middleware/Api';
import { useLoading } from '../../../../context/LoadingContext';
import { useAlert } from '../../../../context/AlertContext';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../../layout/DefaultLayout';
import FormIncludes from '../../../../components/Forms/FormIncludes';
import { useParams } from 'react-router-dom';
import InputFDProp from '../../../../components/Forms/InputFields/InputFD';
import useFetchPaymentChannels, {
  PaymentChannel,
} from '../../../../constants/PaymentChannels';
import { AxiosProgressEvent } from 'axios';

const CreateHomePaymentChannel = () => {
  const { id } = useParams<{ id: string }>();
  const { setLoading, setProgress } = useLoading();
  const { setAlert } = useAlert();

  const {
    paymentChannels,
    loading: loadingChannels,
    error,
  } = useFetchPaymentChannels();

  const [formValues, setFormValues] = useState({
    account_payBill: '',
    payment_channels_id: '',
    account_number: '',
  });

  const [selectedChannelName, setSelectedChannelName] = useState(
    'Select Payment Channel',
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPaymentChannels = paymentChannels.filter(
    (channel) =>
      channel.channel_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      channel.status === 'active',
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleChannelSelect = (channelId: number, channelName: string) => {
    setFormValues({
      ...formValues,
      payment_channels_id: String(channelId),
    });
    setSelectedChannelName(channelName);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setAlert(null);

    try {
      const trackProgress = (event: AxiosProgressEvent) => {
        if (!event.total) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setProgress(progress);
      };

      const response = await api(
        `/payment/store-home-payment-info/${id}`,
        'POST',
        {},
        formValues,
        trackProgress,
      );

      if (response) {
        setAlert({
          success: response.success ?? true,
          message: response.message || 'Action successful',
          error: null,
        });

        setFormValues({
          account_payBill: '',
          payment_channels_id: '',
          account_number: '',
        });
        setSelectedChannelName('Select Payment Channel');
      }
    } catch (error: any) {
      const errorMessage = error?.message;
      setAlert({
        success: false,
        message: errorMessage,
        error: error?.message || null,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showDropdown) {
      setSearchTerm('');
    }
  }, [showDropdown]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Payment Channels" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <FormIncludes title="Create Payment Channels" />
        <div className="p-7">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-5.5">
              {/* Payment Channels Section */}
              <div className="w-full sm:w-1/2">
                <div className="relative mb-5.5">
                  <div
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black cursor-pointer focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    onClick={handleDropdownClick}
                  >
                    <span className="block truncate">
                      {selectedChannelName}
                    </span>
                    <svg
                      className="w-4 h-4 absolute right-3 top-3 pointer-events-none"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  {showDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-stroke rounded shadow-lg dark:bg-boxdark dark:border-strokedark">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-strokedark rounded-t-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:bg-meta-4 dark:text-white"
                        placeholder="Search..."
                      />
                      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredPaymentChannels.map((channel) => (
                          <li
                            key={channel.id}
                            className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-meta-4"
                            onClick={() =>
                              handleChannelSelect(
                                channel.id,
                                channel.channel_name,
                              )
                            }
                          >
                            <img
                              src={channel.channel_logo} // Assuming channel_logo is the URL to the image
                              alt={channel.channel_name}
                              className="w-8 h-8 mr-2 rounded-full"
                            />
                            <span className="truncate">
                              {channel.channel_name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Information Section */}
              <div className="w-full sm:w-1/2">
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="account_payBill"
                  >
                    Account PayBill
                  </label>
                  <div className="relative">
                    <InputFDProp
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="account_payBill"
                      value={formValues.account_payBill}
                      onChange={handleChange}
                      placeholder=""
                    />
                  </div>
                  <span className="block mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <strong>Info:</strong> If you chose mobile service providers
                    as your payment type, add the mobile number or account
                    number here.
                  </span>
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="account_number"
                  >
                    Account Number
                  </label>
                  <div className="relative">
                    <InputFDProp
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="account_number"
                      value={formValues.account_number}
                      onChange={handleChange}
                      placeholder=""
                    />
                  </div>
                  <span className="block mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <strong>Info:</strong> Additional information about account
                    number if needed.
                  </span>
                </div>
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
    </DefaultLayout>
  );
};

export default CreateHomePaymentChannel;
