import React, { useState } from 'react';
import DatePickerOne from '../../components/Forms/DatePicker/DatePickerOne';
import InputFDProp from '../../components/Forms/InputFields/InputFD';
import OptionFD from '../../components/Forms/InputFields/OptionFD';
import TextFDProp from '../../components/Forms/InputFields/TesxtAreaFD';
import { api } from '../../middleware/Api';
import { useUserData } from '../../constants/UserData';
import { useLoading } from '../../context/LoadingContext';
import { AxiosProgressEvent } from 'axios';
import { useAlert } from '../../context/AlertContext';

const Settings = () => {
  const { userData, fetchUserData } = useUserData();
  const { setLoading, setProgress } = useLoading();
  const { setAlert } = useAlert();

  const [formValues, setFormValues] = useState({
    first_name: userData?.detail.first_name || '',
    middle_name: userData?.detail.middle_name || '',
    last_name: userData?.detail.last_name || '',
    username: userData?.detail.username || '',
    phone_no: userData?.phone_no || '',
    date_of_birth: userData?.detail.date_of_birth || '',
    id_number: userData?.detail.id_number || '',
    location: userData?.detail.location || '',
    address: userData?.detail.address || '',
    about_the_user: userData?.detail.about_the_user || '',
    gender: userData?.detail.gender || '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setAlert(null);

    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value as string | Blob);
    });

    try {
      const trackProgress = (event: AxiosProgressEvent) => {
        if (!event.total) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setProgress(progress);
      };

      const response = await api(
        '/member/update-this-user-profile',
        'POST',
        {},
        formData,
        trackProgress,
      );

      if (response?.success) {
        setAlert({
          success: response.success ?? true,
          message: response.message ?? 'Profile updated successfully',
          error: null,
        });
      }

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

  const genderOptions = ['male', 'female', 'other'];
  const formattedDate = formValues.date_of_birth
    ? new Date(formValues.date_of_birth).toISOString().split('T')[0]
    : '';

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Personal Information
        </h3>
      </div>
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
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  name="first_name"
                  value={formValues.first_name}
                  onChange={handleChange}
                  placeholder="John"
                />
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
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  name="middle_name"
                  value={formValues.middle_name}
                  onChange={handleChange}
                  placeholder="Mike"
                />
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
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  name="last_name"
                  value={formValues.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="username"
              >
                Username
              </label>
              <div className="relative">
                <InputFDProp
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  name="username"
                  value={formValues.username}
                  onChange={handleChange}
                  placeholder="@doe20"
                />
              </div>
            </div>

            <div className="w-full sm:w-1/2">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="phone"
              >
                Phone
              </label>
              <div className="relative">
                <InputFDProp
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="tel"
                  name="phone"
                  value={formValues.phone_no}
                  onChange={handleChange}
                  placeholder="0700000000"
                />
              </div>
            </div>
          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="date_of_birth"
              >
                Date of Birth
              </label>
              <div className="relative">
                <DatePickerOne
                  value={
                    typeof formValues.date_of_birth === 'string'
                      ? formValues.date_of_birth
                      : undefined
                  }
                  onChange={(selectedDates) => {
                    const dateStr =
                      selectedDates[0]?.toISOString().split('T')[0] || '';
                    setFormValues({
                      ...formValues,
                      date_of_birth: dateStr,
                    });
                  }}
                />
              </div>
            </div>

            <div className="w-full sm:w-1/2">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="id_number"
              >
                Id Number
              </label>
              <div className="relative">
                <InputFDProp
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  name="id_number"
                  value={formValues.id_number}
                  onChange={handleChange}
                  placeholder="XC23"
                />
              </div>
            </div>
          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="gender"
              >
                Gender
              </label>
              <OptionFD
                options={genderOptions}
                name="gender"
                value={formValues.gender}
                onChange={handleChange}
              />
            </div>

            <div className="w-full sm:w-1/2">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="location"
              >
                Location
              </label>
              <div className="relative">
                <InputFDProp
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  name="location"
                  value={formValues.location}
                  onChange={handleChange}
                  placeholder="Mombasa"
                />
              </div>
            </div>

            <div className="w-full sm:w-1/2">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="address"
              >
                Address
              </label>
              <div className="relative">
                <InputFDProp
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  name="address"
                  value={formValues.address}
                  onChange={handleChange}
                  placeholder=""
                />
              </div>
            </div>
          </div>

          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="about_the_user"
            >
              About the User
            </label>
            <div className="relative">
              <TextFDProp
                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                name="about_the_user"
                rows={6}
                value={formValues.about_the_user}
                onChange={handleChange}
                placeholder="Write about yourself here"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4.5">
            <button
              className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
              type="button"
              onClick={() => {
                setFormValues({
                  first_name: '',
                  middle_name: '',
                  last_name: '',
                  username: '',
                  phone_no: '',
                  date_of_birth: '',
                  id_number: '',
                  location: '',
                  address: '',
                  about_the_user: '',
                  gender: '',
                });
              }}
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
  );
};

export default Settings;
