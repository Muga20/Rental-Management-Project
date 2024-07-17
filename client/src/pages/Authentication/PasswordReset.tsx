import React, { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Auth from '../../components/Forms/Auth';
import axios from 'axios';
import { ServerUrl } from '../../config/ServerUrl';
import Alerts from '../../components/Alerts'; // Adjust the import path as necessary
import AuthService from '../../service/AuthService';
import { UseAuthContext } from '../../hooks/UseAuthContext';

interface ValidationErrors {
  [key: string]: string;
}

function PasswordReset() {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);
  const { token } = useParams<{ token: string }>();
  const [isChecked] = useState<boolean>(false); // Assuming there's a "remember me" checkbox
  const { dispatch } = UseAuthContext();

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const PasswordResetFn = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setValidationErrors({
        confirmPassword: 'Passwords do not match',
      });
      setAlert({
        type: 'warning',
        message: 'Passwords do not match. Please check the form.',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${ServerUrl}/new-password/${token}`, {
        newPassword: newPassword,
        confirmPassword: confirmPassword,
        authStatus: 'authOff',
      });

      if (response) {
        AuthService.handleLoginSuccess(response, isChecked, dispatch);
        navigate('/dashboard/index');

        setAlert({
          type: 'success',
          message: 'Password reset successful. Redirecting...',
        });
      }
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
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
          New Password
        </h2>

        {alert && <Alerts type={alert.type} message={alert.message} />}

        <form onSubmit={PasswordResetFn}>
          <div className="mb-4">
            <Auth label="New Password" />
            <div className="relative">
              <Auth
                name="newPassword"
                type="password"
                placeHolder="******"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={validationErrors.newPassword}
              />
            </div>
          </div>

          <div className="mb-6">
            <Auth label="Confirm Password" />
            <div className="relative">
              <Auth
                name="confirmPassword"
                type="password"
                placeHolder="******"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={validationErrors.confirmPassword}
              />
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

export default PasswordReset;
