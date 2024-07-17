import React, { useState } from 'react';
import InputFDProp from '../../components/Forms/InputFields/InputFD';
import { api } from '../../middleware/Api';
import { useLoading } from '../../context/LoadingContext';
import { useAlert } from '../../context/AlertContext';
import { AxiosProgressEvent } from 'axios';
import DeactivateAcc from './Sub/DeactivateAcc';
import { useUserData } from '../../constants/UserData';

const Security = () => {
  const { setLoading, setProgress } = useLoading();
  const { setAlert } = useAlert();
  const { fetchUserData } = useUserData();

  const [passwordFormValues, setPasswordFormValues] = useState({
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [emailFormValues, setEmailFormValues] = useState({
    email: '',
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormValues({ ...passwordFormValues, [name]: value });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailFormValues({ ...emailFormValues, [name]: value });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordFormValues.newPassword !== passwordFormValues.confirmPassword) {
      setAlert({
        success: false,
        message: 'New Password and Confirm Password do not match',
        error: null,
      });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const trackProgress = (event: AxiosProgressEvent) => {
        if (!event.total) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setProgress(progress);
      };

      const response = await api(
        '/auth/reset-password',
        'POST',
        {},
        passwordFormValues,
        trackProgress,
      );

      setAlert({
        success: response.success ?? true,
        message: response.message ?? 'Password updated successfully',
        error: null,
      });

      await fetchUserData();
    } catch (error: any) {
      setAlert({
        success: false,
        message: error.message ?? 'An error occurred while updating password',
        error: error.message ?? null,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
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
        '/auth/reset-email',
        'POST',
        {},
        emailFormValues,
        trackProgress,
      );

      setAlert({
        success: response.success ?? true,
        message: response.message ?? 'Email updated successfully',
        error: null,
      });

      await fetchUserData();
    } catch (error: any) {
      setAlert({
        success: false,
        message: error.message ?? 'An error occurred while updating email',
        error: error.message ?? null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Update Your Password
          </h3>
        </div>
        <div className="p-7">
          <form onSubmit={handlePasswordSubmit}>
            <div className="">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="currentPassword"
              >
                Current Password
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

            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <div className="relative">
                <InputFDProp
                  className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="password"
                  name="newPassword"
                  value={passwordFormValues.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="*******"
                />
              </div>
            </div>

            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <div className="relative">
                <InputFDProp
                  className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="password"
                  name="confirmPassword"
                  value={passwordFormValues.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="*******"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4.5">
              <button
                className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                type="button"
                onClick={() =>
                  setPasswordFormValues({
                    password: '',
                    newPassword: '',
                    confirmPassword: '',
                  })
                }
              >
                Cancel
              </button>
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

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Update Your Email
          </h3>
        </div>
        <div className="p-7">
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <InputFDProp
                  className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="email"
                  name="email"
                  value={emailFormValues.email}
                  onChange={handleEmailChange}
                  placeholder="john@gmail.com"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4.5">
              <button
                className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                type="button"
                onClick={() => setEmailFormValues({ email: '' })}
              >
                Cancel
              </button>
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

      <DeactivateAcc />
    </div>
  );
};

export default Security;
