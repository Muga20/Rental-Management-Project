import React, { useState } from 'react';
import InputFDProp from '../../../components/Forms/InputFields/InputFD';
import { useAlert } from '../../../context/AlertContext';
import { api } from '../../../middleware/Api';
import { useLoading } from '../../../context/LoadingContext';
import { AxiosProgressEvent } from 'axios';
import Upload from '../../../components/Forms/InputFields/Upload';
import CreateCompanyOwner from './CreateCompanyOwner';

function CreateCompany() {
  const { setLoading, setProgress } = useLoading();
  const { setAlert } = useAlert();
  const [name, setName] = useState('');
  const [logoImage, setLogoImage] = useState<File | null>(null);

  const handleChangeName = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setName(e.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setLogoImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!name.trim() || !logoImage) {
      setAlert({
        success: false,
        message: 'Name and Logo Image are required.',
        error : null
      });
    } else {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('logoImage', logoImage);

        const trackProgress = (event: AxiosProgressEvent) => {
          if (!event.total) return;
          const progress = Math.round((event.loaded / event.total) * 100);
          setProgress(progress);
        };

        const response = await api(
          '/company/create-company',
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
          setName('');
          setLogoImage(null);
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
    }
  };

  return (
    <div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Create New Company
          </h3>
        </div>
        <div className="p-7">
          <form onSubmit={handleSubmit}>
            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="companyName"
              >
                Company Name<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <InputFDProp
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  name="Name"
                  value={name}
                  onChange={handleChangeName}
                  placeholder="Enter Company Name"
                />
              </div>
            </div>
            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="logoImage"
              >
                Logo Image<span className="text-red-500">*</span>
              </label>
              <div className="mb-5.5">
                <Upload
                  label="Upload your document"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4.5">
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
      <CreateCompanyOwner />
    </div>
  );
}

export default CreateCompany;
