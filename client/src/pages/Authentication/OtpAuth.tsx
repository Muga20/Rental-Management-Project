import React, { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Auth from '../../components/Forms/Auth';
import axios from 'axios';
import { ServerUrl } from '../../config/ServerUrl';
import Alerts from '../../components/Alerts'; // Adjust the import path as necessary
import AuthService from '../../service/AuthService';
import { UseAuthContext } from '../../hooks/UseAuthContext';

axios.defaults.withCredentials = true;

interface ValidationErrors {
  [key: string]: string;
}

function OtpAuth() {
  const [email, setEmail] = useState<string>('');
  const [otp, setOTP] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const location = useLocation();
  const [alert, setAlert] = useState<{
    type: 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);
  const { dispatch } = UseAuthContext();

  const navigate = useNavigate();
  const { email: passedEmail } = location.state || {};

  axios.defaults.withCredentials = true;

  useEffect(() => {
    if (passedEmail) {
      setEmail(passedEmail);
    }
    window.scrollTo(0, 0);
  }, [passedEmail]);

  const signInUser = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const postData = { email: email, otp: otp };
      try {
        const response = await AuthService.postRequest(
          'authenticate-OTP',
          postData,
        );

        if (response) {
          AuthService.handleLoginSuccess(response, isChecked, dispatch);
          navigate('/dashboard/index');

          setAlert({
            type: 'success',
            message: 'Authentication successful. Redirecting...',
          });
        }
      } catch (error) {
        console.error('Authentication failed:', error);
      }

      navigate('');

      setAlert({
        type: 'success',
        message: 'Authentication successful. Redirecting...',
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setAlert({
            type: 'error',
            message: 'Email not found. Please contact admin.',
          });
        } else if (error.response?.status === 400) {
          const validationErrorsData = error.response.data.errors;
          const newValidationErrors: ValidationErrors = {};
          validationErrorsData.forEach(
            (errorObject: { path: string; msg: string }) => {
              newValidationErrors[errorObject.path] = errorObject.msg;
            },
          );
          setValidationErrors(newValidationErrors);
          setAlert({
            type: 'warning',
            message: 'Validation errors occurred. Please check the form.',
          });
        } else if (error.response?.status === 401) {
          setAlert({ type: 'error', message: error.response.data.error });
        } else if (error.response?.status === 403) {
          setAlert({ type: 'error', message: 'Your account is suspended' });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
      <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
        <span className="mb-1.5 block font-medium">Start for free</span>
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
          Sign In to The M Group
        </h2>

        {alert && <Alerts type={alert.type} message={alert.message} />}

        <form onSubmit={signInUser}>
          <div className="mb-4">
            <Auth label="Email" />
            <div className="relative">
              <Auth
                name="Email"
                type="text"
                placeHolder={passedEmail || 'example@mail.com'}
                value={email}
                readOnly
                error={validationErrors.email}
              />
              <Auth emailSpan="emailSpan" />
            </div>
          </div>

          <div className="mb-6">
            <Auth label="Password" />
            <div className="relative">
              <Auth
                name="OTP"
                type="otp"
                placeHolder="Enter otp sent to your mail "
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                error={validationErrors.otp}
              />
              <Auth passwordSpan="passwordSpan" />
            </div>
          </div>

          <div className="mb-5">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
            >
              {isLoading ? 'Loading...' : 'Proceed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OtpAuth;
