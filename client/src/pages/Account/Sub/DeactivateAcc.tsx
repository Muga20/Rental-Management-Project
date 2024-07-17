import React, { useState } from 'react';
import InputFDProp from '../../../components/Forms/InputFields/InputFD'; // Assuming you have InputFDProp component imported
import { api } from '../../../middleware/Api';
import { useLoading } from '../../../context/LoadingContext';
import { useAlert } from '../../../context/AlertContext';
import { AxiosProgressEvent } from 'axios';
import { useUserData } from '../../../constants/UserData';
import { UseAuthContext } from '../../../hooks/UseAuthContext';
import { useNavigate } from 'react-router-dom';

function DeactivateAcc() {
  const [passwordFormValues, setPasswordFormValues] = useState({
    password: '',
  });
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const { setLoading, setProgress } = useLoading();
  const { setAlert } = useAlert();
  const { userData } = useUserData();
  const { dispatch } = UseAuthContext();
  const navigate = useNavigate();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPasswordFormValues({ password: value });
  };

  const handleDeactivateSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setAlert(null);

    try {
      const trackProgress = (event: AxiosProgressEvent) => {
        if (!event.total) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setProgress(progress);
      };

      if (!passwordFormValues.password) {
        setAlert({
          success: false,
          message: 'Please enter your password to deactivate your account.',
          error: null,
        });

        setLoading(false);
        return;
      }

      const response = await api(
        '/member/deactivate-account',
        'POST',
        {},
        {
          password: passwordFormValues.password,
        },
        trackProgress,
      );
      
      if (response?.success) {
        handleClick();
      }
    } catch (error: any) {
      const errorMessage = error?.message ;
      setAlert({
        success: false,
        message: errorMessage,
        error: error?.message || null, 
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDeactivation = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleClick = () => {
    document.cookie = 'xx_tgk=; expires= Thu, 01 Jan 2000 00:00:00 UTC; path=/';
    document.cookie =
      'refresh_token=; expires= Thu, 01 Jan 2000 00:00:00 UTC; path=/';
    dispatch({ type: 'LOGOUT' });
    navigate('/auth/verify');
  };

  return (
    <div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Deactivate Your Account
          </h3>
        </div>
        <div className="p-7">
          <form onSubmit={handleDeactivateSubmit}>
            <div className="">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="currentPassword"
              >
                Enter your password to deactivate your account Note <br />
                <span className="text-red-600">
                  Deactivating your account will suspend it for a period of 30
                  days. During this time, your account and associated data will
                  be inaccessible. However, you can reactivate your account at
                  any point during this period by logging in with your
                  credentials. If you're sure you want to proceed, click the
                  button below. Please Note Password must be provided.
                </span>
              </label>

              <div className="relative">
                <InputFDProp
                  className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="password"
                  name="password"
                  value={passwordFormValues.password}
                  onChange={handlePasswordChange}
                  placeholder="*******"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4.5 pt-3">
              <button
                className="flex justify-center rounded bg-red-600 py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                type="button" // Change type to button
                onClick={confirmDeactivation} // Call confirmDeactivation on click
              >
                Deactivate Account
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-slate-900">
                      Deactivate Account
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-slate-900">
                        Are you sure you want to deactivate your account?
                        Deactivating your account will suspend it for a period
                        of 30 days. During this time, your account and
                        associated data will be inaccessible. However, you can
                        reactivate your account at any point during this period
                        by logging in with your credentials.
                        <span className="text-red-600">
                          Please Note Password must be provided.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleDeactivateSubmit} // Call handleDeactivateSubmit on click
                  type="submit" // Change type to button
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Deactivate
                </button>
                <button
                  onClick={closeModal} // Call closeModal on click
                  type="submit" // Change type to button
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeactivateAcc;
