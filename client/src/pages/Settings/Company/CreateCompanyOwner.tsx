import React, { useState } from 'react';
import InputFDProp from '../../../components/Forms/InputFields/InputFD';
import { useAlert } from '../../../context/AlertContext';
import { useLoading } from '../../../context/LoadingContext';
import { api } from '../../../middleware/Api';
import { AxiosProgressEvent } from 'axios';
import useFetchCompany, { Company } from '../../../constants/Companies';

function CreateCompanyOwner() {
  const { setLoading, setProgress } = useLoading();
  const { setAlert } = useAlert();
  const { companies, loading, error } = useFetchCompany();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    company_id: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompanyId(e.target.value);
    setFormData({
      ...formData,
      company_id: e.target.value,
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
        '/member/create-member',
        'POST',
        {},
        formData,
        trackProgress,
      );

      if (response) {
        setAlert({
          success: response.success ?? true,
          message: response.message || 'Action successful',
          error: null,
        });
        setFormData({
          email: '',
          first_name: '',
          middle_name: '',
          last_name: '',
          company_id: '',
        });
      }
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

  const handleCancel = () => {
    // Reset form fields
    setFormData({
      email: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      company_id: '',
    });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Company Owner Form
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
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="email"
            >
              Email<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <InputFDProp
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
              />
            </div>
          </div>

          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="company"
            >
              Select Company
            </label>
            <div className="relative">
              <select
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                value={selectedCompanyId}
                onChange={handleCompanyChange}
              >
                <option value="">Select Company</option>
                {companies.map((company: Company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
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
  );
}

export default CreateCompanyOwner;
