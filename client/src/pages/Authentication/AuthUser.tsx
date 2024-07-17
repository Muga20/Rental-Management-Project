import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from '../../components/Forms/Auth';
import axios from 'axios';
import { ServerUrl } from '../../config/ServerUrl';

interface ValidationErrors {
  [key: string]: string;
}

function AuthUser() {
  const [email, setEmail] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authType, setAuthType] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ success: boolean; message: string | null }>({
    success: false,
    message: null,
  });
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ success: false, message: null });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  useEffect(() => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setIsEmailValid(isValidEmail);
  }, [email]);

  useEffect(() => {
    if (authType) {
      proceedToAuth(); // Call proceedToAuth whenever authType changes
    }
  }, [authType]);

  const proceedToAuth = async () => {
    if (authType) {
      if (authType === 'password') {
        navigate(`/auth/login`, { state: { email: email } });
      } else if (authType === 'otp') {
        try {
          await axios.post(`${ServerUrl}/receive-OTP`, { email: email });
          navigate(`/auth/otp`, { state: { email: email } });
        } catch (error) {
          setAlert({
            success: false,
            message: 'Failed to send OTP. Please try again.',
          });
        }
      } else {
        setValidationErrors({ email: 'Invalid authentication type' });
      }
    }
  };

  const signInUser = async (e: FormEvent) => {
    e.preventDefault();

    if (!isEmailValid) {
      setValidationErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${ServerUrl}/authenticate`, { email });
      const encodedAuthType = response.data.authType;
      const decodedAuthType = atob(encodedAuthType);
      setAuthType(decodedAuthType); // Update authType
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setAlert({
            success: false,
            message: 'Email not found. Please contact admin.',
          });
        } else if (error.response?.status === 400) {
          const validationErrorsData = error.response.data.errors;
          const newValidationErrors: ValidationErrors = {};
          validationErrorsData.forEach((errorObject: { path: string; msg: string }) => {
            newValidationErrors[errorObject.path] = errorObject.msg;
          });
          setValidationErrors(newValidationErrors);
          setAlert({
            success: false,
            message: 'Validation errors occurred. Please check the form.',
          });
        } else if (error.response?.status === 401) {
          setAlert({
            success: false,
            message: error.response.data.error,
          });
        } else if (error.response?.status === 403) {
          setAlert({
            success: false,
            message: 'Your account is suspended',
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
      <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
        <span className="mb-1.5 block font-medium"> Welcome </span>
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
          Sign In to The M Group
        </h2>

        <form onSubmit={signInUser}>
          <div className="mb-4">
            <Auth label="Email" />
            <div className="relative">
              <Auth
                name="Email"
                type="text"
                placeHolder="use Email or Phone Number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={validationErrors.email}
              />
              <Auth emailSpan="emailSpan" />
            </div>
          </div>

          <div className="mb-5">
            <button
              type="submit"
              disabled={isLoading || !isEmailValid}
              className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
            >
              {isLoading ? 'Loading...' : 'Proceed'}
            </button>
          </div>
        </form>
        {alert.message && (
          <div
            className={`p-4 mt-4 text-sm ${
              alert.success ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
            } rounded-lg`}
            role="alert"
          >
            {alert.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthUser;
