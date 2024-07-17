import { useState } from 'react';
import DefaultLayout from '../../../../../layout/DefaultLayout';
import { AxiosProgressEvent } from 'axios';
import { useLoading } from '../../../../../context/LoadingContext';
import { useAlert } from '../../../../../context/AlertContext';
import { useUserData } from '../../../../../constants/UserData';
import { api } from '../../../../../middleware/Api';
import Breadcrumb from '../../../../../components/Breadcrumbs/Breadcrumb';
import InputFDProp from '../../../../../components/Forms/InputFields/InputFD';
import FormIncludes from '../../../../../components/Forms/FormIncludes';
import DatePickerOne from '../../../../../components/Forms/DatePicker/DatePickerOne';
import { useNavigate, useParams } from 'react-router-dom';

function NewTenant() {
  const { setLoading, setProgress } = useLoading();
  const { setAlert } = useAlert();
  const { userData } = useUserData();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    phone_no: '',
    id_number: '',
    date_of_birth: '',
    gender: '',
    country: '',
    company_id: userData?.company?.id || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const trackProgress = (event: AxiosProgressEvent) => {
        if (!event.total) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setProgress(progress);
      };

      const response = await api(
        `/lease/lease-a-home-to-tenant/${id}`,
        'POST',
        {},
        formData,
        trackProgress,
      );
      if (response?.success) {
        setAlert({
          success: true,
          message: response.message || 'Tenant Created',
          error: null,
        });

        //Navigate back  to previous page if successful 
        navigate(-1);

        setFormData({
          email: '',
          first_name: '',
          middle_name: '',
          last_name: '',
          phone_no: '',
          id_number: '',
          date_of_birth: '',
          gender: '',
          country: '',
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
    // Reset form fields
    setFormData({
      email: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      phone_no: '',
      id_number: '',
      date_of_birth: '',
      gender: '',
      country: '',
      company_id: userData?.company?.id || '',
    });
  };

  const genderOptions = ['male', 'female', 'other'];
  const formattedDate = formData.date_of_birth
    ? new Date(formData.date_of_birth).toISOString().split('T')[0]
    : '';

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add a Tenant" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <FormIncludes title="Add tenant " />

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
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
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
                    id="middle_name"
                    name="middle_name"
                    value={formData.middle_name}
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
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
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
                  htmlFor="id_number"
                >
                  Id Number
                </label>
                <div className="relative">
                  <InputFDProp
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    id="id_number"
                    name="id_number"
                    value={formData.id_number}
                    onChange={handleChange}
                    placeholder="Enter id number"
                  />
                </div>
              </div>

              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="phone_no"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <InputFDProp
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    id="phone_no"
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleChange}
                    placeholder="Enter Phone Number"
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
                    value={formattedDate}
                    onChange={(selectedDates) => {
                      const dateStr =
                        selectedDates[0]?.toISOString().split('T')[0] || '';
                      setFormData({
                        ...formData,
                        date_of_birth: dateStr,
                      });
                    }}
                  />
                </div>
              </div>

              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="gender"
                >
                  Gender
                </label>
                <select
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  {genderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="country"
                >
                  Country
                </label>
                <div className="relative">
                  <InputFDProp
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter Country"
                  />
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

export default NewTenant;
