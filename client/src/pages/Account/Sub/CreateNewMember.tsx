import { useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import InputFDProp from '../../../components/Forms/InputFields/InputFD';
import { useAlert } from '../../../context/AlertContext';
import { useLoading } from '../../../context/LoadingContext';
import { api } from '../../../middleware/Api';
import { AxiosProgressEvent } from 'axios';
import FormIncludes from '../../../components/Forms/FormIncludes';
import { useUserData } from '../../../constants/UserData';
import {
  validateEmail,
  validateName,
  validatePhoneNumber,
} from '../../../service/validationService';

function CreateNewMember() {
  const { setLoading, setProgress } = useLoading();
  const { setAlert } = useAlert();
  const { userData } = useUserData();

  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    phone_no: '',
    company_id: userData?.company?.id || '',
  });

  const [errors, setErrors] = useState({
    email: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    phone_no: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
   
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validateForm = (): boolean => {
    let valid = true;

    // Validate first_name
    const firstNameError = validateName(formData.first_name);
    if (firstNameError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        first_name: firstNameError,
      }));
      valid = false;
    }

    // Validate middle_name
    const middleNameError = validateName(formData.middle_name);
    if (middleNameError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        middle_name: middleNameError,
      }));
      valid = false;
    }

    // Validate last_name
    const lastNameError = validateName(formData.last_name);
    if (lastNameError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        last_name: lastNameError,
      }));
      valid = false;
    }

    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: emailError,
      }));
      valid = false;
    }

    // Validate phone_no
    const phoneNoError = validatePhoneNumber(formData.phone_no);
    if (phoneNoError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone_no: phoneNoError,
      }));
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const trackProgress = (event: AxiosProgressEvent) => {
        if (!event.total) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setProgress(progress);
      };

      const response = await api(
        '/member/create-member',
        'POST',
        {},
        formData,
        trackProgress,
      );
      if (response?.success) {
        setAlert({
          success: true,
          message: response.message || 'Member Created',
          error: null,
        });
        setFormData({
          email: '',
          first_name: '',
          middle_name: '',
          last_name: '',
          phone_no: '',
          company_id: userData?.company?.id || '',
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.message || 'An error occurred while creating member';
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

  const handleCancel = () => {
    // Reset form fields and errors
    setFormData({
      email: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      phone_no: '',
      company_id: userData?.company?.id || '',
    });
    setErrors({
      email: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      phone_no: '',
    });
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Create new member" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <FormIncludes title="Create a new member" />

        <div className="p-7">
          <form onSubmit={handleSubmit}>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="first_name"
                >
                  First Name
                </label>

                <div className="relative">
                  <InputFDProp
                    className={`w-full rounded border ${
                      errors.first_name ? 'border-red-500' : 'border-stroke'
                    } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="John"
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.first_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="middle_name"
                >
                  Middle Name
                </label>
                <div className="relative">
                  <InputFDProp
                    className={`w-full rounded border ${
                      errors.middle_name ? 'border-red-500' : 'border-stroke'
                    } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                    type="text"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                    placeholder="Mike"
                  />
                  {errors.middle_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.middle_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="last_name"
                >
                  Last Name
                </label>
                <div className="relative">
                  <InputFDProp
                    className={`w-full rounded border ${
                      errors.last_name ? 'border-red-500' : 'border-stroke'
                    } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="email"
                >
                  Email<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <InputFDProp
                    className={`w-full rounded border ${
                      errors.email ? 'border-red-500' : 'border-stroke'
                    } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="phone_no"
                >
                  Phone Number<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <InputFDProp
                    className={`w-full rounded border ${
                      errors.phone_no ? 'border-red-500' : 'border-stroke'
                    } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                    type="text"
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleChange}
                    placeholder="Enter Phone Number"
                  />
                  {errors.phone_no && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone_no}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                type="button"
                onClick={handleCancel}
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
    </DefaultLayout>
  );
}

export default CreateNewMember;
