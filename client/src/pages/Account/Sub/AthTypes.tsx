import React, { useState, useEffect } from 'react';
import ToggleSwitch from '../../../components/Forms/SelectGroup/ToggleSwitch';
import { useUserData } from '../../../constants/UserData';
import { api } from '../../../middleware/Api';
import { useLoading } from '../../../context/LoadingContext';
import { AxiosProgressEvent } from 'axios';
import { useAlert } from '../../../context/AlertContext';

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

interface AuthTypesProps {}

const AuthTypes: React.FC<AuthTypesProps> = () => {
  const { setLoading, setProgress } = useLoading();
  const { userData, fetchUserData } = useUserData();
  const { setAlert } = useAlert();

  const [isPasswordActive, setIsPasswordActive] = useState(false);

  useEffect(() => {
    if (userData && userData.authType) {
      setIsPasswordActive(userData.authType === 'password');
    }
  }, [userData]);

  const handleAuthToggleChange = async (isChecked: boolean) => {
    setLoading(true);
    try {
      const authType = isChecked ? 'password' : 'otp';
      await updateAuthType(authType);
      setIsPasswordActive(isChecked);
      setAlert({
        success: true,
        message: 'Authentication type updated successfully.',
        error: null,
      });
    } catch (error: any) {
      console.error('Error updating authentication type:', error);
      let errorMessage = 'An error occurred. Please try again later.';
      if (error.response) {
        console.log(error?.message);
        
        const errorMessage = error?.message;
        setAlert({
          success: false,
          message: errorMessage,
          error: error?.message || null,
        });
      }
      setAlert({ success: false, message: errorMessage, error: null });
    } finally {
      setLoading(false);
    }
  };

  const updateAuthType = async (authType: string) => {
    try {
      // Create a function to track progress
      const trackProgress = (event: AxiosProgressEvent) => {
        if (!event.total) return;
        // Calculate progress percentage
        const progress = Math.round((event.loaded / event.total) * 100);
        // Update the progress
        setProgress(progress);
      };

      // Make the network request
      const response = await api(
        '/member/set-auth-type',
        'POST',
        {},
        { auth_type: authType },
        trackProgress, // Pass the progress function
      );

      if (response.tokenExpired) {
        throw new Error('Token expired. Please log in again.');
      }

      setAlert({
        success: false,
        message: 'Authentication type updated successfully.',
        error: null,
      });

      fetchUserData();
    } catch (error: any) {
      setAlert({
        success: true,
        message:
          error.message ||
          'Error updating authentication type. Please try again later.',
        error: null,
      });
    } finally {
      // Progress is complete, set it to 100%
      setProgress(100);
    }
  };

  return (
    <div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Login Preference
          </h3>
        </div>
        <form>
          <div className="flex flex-col gap-5.5 p-6.5">
            <div>
              <label htmlFor="authToggle">
                Activate {isPasswordActive ? 'OTP' : 'Password'} Authentication
                currently using {capitalizeFirstLetter(userData?.authType)}
              </label>
              <ToggleSwitch
                id="authToggle"
                initialState={isPasswordActive}
                onChange={handleAuthToggleChange}
                bgColor1="bg-green-800"
                bgColor2="bg-green-800"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthTypes;
