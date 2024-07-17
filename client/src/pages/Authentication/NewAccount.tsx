import { useState, useEffect, FormEvent } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import Auth from '../../components/Forms/Auth';
import axios from 'axios';
import { ServerUrl } from '../../config/ServerUrl';
import Alerts from '../../components/Alerts'; // Adjust the import path as necessary
import AuthService from '../../service/AuthService';
import { UseAuthContext } from '../../hooks/UseAuthContext';

interface ValidationErrors {
  [key: string]: string;
}

function NewAccount() {
  const [email, setEmail] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);
  const [isChecked] = useState<boolean>(false); // Assuming there's a "remember me" checkbox
  const { dispatch } = UseAuthContext();
  const { token } = useParams<{ token: string }>();

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const signInUser = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${ServerUrl}/auth-new-user/${token}`, {
        email,
      });

      if (response) {
        AuthService.handleLoginSuccess(response, isChecked, dispatch);
        navigate('/dashboard/index');

        setAlert({
          type: 'success',
          message: 'Authentication successful. Redirecting...',
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
          You are Signing in 
        </h2>

        {alert && <Alerts type={alert.type} message={alert.message} />}

        <form onSubmit={signInUser}>
          <div className="mb-4">
            <Auth label="Email" />
            <div className="relative">
              <Auth
                name="Email"
                type="text"
                placeHolder="example@mail.com"
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
              disabled={isLoading}
              className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
            >
              {isLoading ? 'Sending...' : 'Sign In'}
            </button>
          </div>

          
        </form>
      </div>
    </div>
  );
}

export default NewAccount;
