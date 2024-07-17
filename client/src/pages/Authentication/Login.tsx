import React, { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Auth from '../../components/Forms/Auth';
import axios from 'axios';
import Alerts from '../../components/Alerts';
import AuthService from '../../service/AuthService';
import { UseAuthContext } from '../../hooks/UseAuthContext';
import { useAlert } from '../../context/AlertContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

axios.defaults.withCredentials = true;

interface ValidationErrors {
  [key: string]: string;
}

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false); // State for toggling password visibility
  const [alert, setAlert] = useState<{
    success: boolean;
    message: string | null;
  }>({ success: false, message: null });

  const location = useLocation();
  const navigate = useNavigate();

  const { dispatch } = UseAuthContext();

  const { email: passedEmail } = location.state || {};

  useEffect(() => {
    if (passedEmail) {
      setEmail(passedEmail);
    }
    window.scrollTo(0, 0);
  }, [passedEmail]);

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ success: false, message: null });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const signInUser = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const postData = { email: email, password: password };

    try {
      const response = await AuthService.postRequest('login_user', postData);
      if (response) {
        AuthService.handleLoginSuccess(response, isChecked, dispatch);
        navigate('/dashboard');
      }
    } catch (error) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = (error: any) => {
    if (axios.isAxiosError(error)) {
      setAlert({
        success: error?.response?.data.success ?? false,
        message: error?.response?.data.message,
      });
    } else {
      handleValidationErrors(error.response.data.errors);
    }
  };

  const handleValidationErrors = (
    validationErrorsData: Array<{ path: string; msg: string }>
  ) => {
    const newValidationErrors: ValidationErrors = {};
    validationErrorsData.forEach(
      (errorObject: { path: string; msg: string }) => {
        newValidationErrors[errorObject.path] = errorObject.msg;
      }
    );
    setValidationErrors(newValidationErrors);
  };

  return (
    <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
      <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
        <span className="mb-1.5 block font-medium"></span>
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
          One Step to your Account
        </h2>

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
                name="Password"
                type={showPassword ? 'text' : 'password'}
                placeHolder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={validationErrors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-8 flex items-center pr-3 text-xl"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <Auth passwordSpan="passwordSpan" />
            </div>
          </div>

          <div className="mb-5">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
            >
              {isLoading ? 'Loading...' : 'Sign In'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p>
              Forgot Password {''}
              <Link to="/auth/reset-password" className="text-primary">
                Reset
              </Link>
            </p>
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

export default Login;
