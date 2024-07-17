import React, { useState, useEffect } from 'react';
import Buttons from '../../components/Buttons/Buttons';
import { useUserData } from '../../constants/UserData';
import { api } from '../../middleware/Api';
import AuthTypes from './Sub/AthTypes';
import { useLoading } from '../../context/LoadingContext';
import { AxiosProgressEvent } from 'axios';
import { useAlert } from '../../context/AlertContext';

const Auth = () => {
  const { userData, fetchUserData } = useUserData();
  const { setLoading, setProgress } = useLoading();
  const [twoFaEnabled, setTwoFaEnabled] = useState(
    userData?.two_fa_status === 'active',
  );
  const [smsNumber, setSmsNumber] = useState(userData?.sms_number || '');
  const { setAlert } = useAlert();

  useEffect(() => {
    setTwoFaEnabled(userData?.two_fa_status === 'active');
    setSmsNumber(userData?.sms_number || '');
  }, [userData]);

  const handleSmsNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSmsNumber(e.target.value);
  };

  const handleTwoFaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setAlert(null);

    const twoFaStatus = twoFaEnabled ? 'active' : 'inactive';

    try {
      const trackProgress = (event: AxiosProgressEvent) => {
        if (!event.total) return;
        // Calculate progress percentage
        const progress = Math.round((event.loaded / event.total) * 100);
        // Update the progress
        setProgress(progress);
      };

      const response = await api(
        '/member/two-fa-setup',
        'POST',
        {},
        {
          phone_no: smsNumber,
          two_fa_status: twoFaStatus,
        },
        trackProgress,
      );

      if (response.tokenExpired) {
        throw new Error('Token expired. Please log in again.');
      }

      setAlert({
        success: response.success ?? true,
        message:
          response.message ??
          'Two-factor authentication settings updated successfully.',
        error: null,
      });

      await fetchUserData();
    } catch (error: any) {
      const errorMessage = error?.message;
      setAlert({
        success: false,
        message: errorMessage,
        error: error?.message || null,
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const buttonLabel = twoFaEnabled ? 'Deactivate' : 'Activate';

  const buttons = [
    {
      className:
        'inline-flex items-center justify-center rounded-md bg-black px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10',
      label: buttonLabel,
      onClick: handleTwoFaSubmit,
    },
  ];

  return (
    <div>
      <AuthTypes />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Two-Factor Authentication
          </h3>
        </div>
        <div className="flex flex-col gap-5.5 p-6.5">
          <span>
            Add another level of security to your account by enabling two-factor
            authentication. We will send you a text message to verify your login
            attempts on unrecognized devices and browsers.
          </span>
          <form onSubmit={handleTwoFaSubmit}>
            <div>
              <input
                type="text"
                placeholder="0700000000"
                value={smsNumber}
                onChange={handleSmsNumberChange}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              <div className="pt-2">
                <div
                  className={`border ${
                    twoFaEnabled ? 'border-red-500' : 'border-green-500'
                  } inline-flex items-center justify-center rounded-md`}
                >
                  <Buttons buttons={buttons} />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
