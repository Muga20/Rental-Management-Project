import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InputFDProp from '../../../components/Forms/InputFields/InputFD';
import Upload from '../../../components/Forms/InputFields/Upload';
import { api } from '../../../middleware/Api';
import { useLoading } from '../../../context/LoadingContext';
import { AxiosProgressEvent } from 'axios';
import { useAlert } from '../../../context/AlertContext';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../layout/DefaultLayout';
import TextFDProp from '../../../components/Forms/InputFields/TesxtAreaFD';
import useFetchUsers, { User } from '../../../constants/Members';
import FormIncludes from '../../../components/Forms/FormIncludes';

const EditHomeInfo = () => {
  const { setLoading, setProgress } = useLoading();
  const { setAlert } = useAlert();
  const { users } = useFetchUsers();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    name: '',
    location: '',
    houseCategory: '',
    description: '',
    phone: '',
    email: '',
    images: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const response = await api(`/home/home-profile/${id}`, 'GET');
        if (response && response.data) {
          setFormValues({
            name: response.data.home.name,
            location: response.data.home.location,
            houseCategory: response.data.home.houseCategory,
            description: response.data.home.description,
            phone: response.data.home.phone,
            email: response.data.home.email,
            images: response.data.home.images,
          });
        }
      } catch (error: any) {
        setAlert({
          success: false,
          message: 'Failed to fetch home data.',
          error: error?.message || null,
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchHomeData();
  }, [id, setAlert, setLoading]);
  
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setFormValues({
        ...formValues,
        images: event.target.files[0].name,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setAlert(null);

    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    if (selectedFile) {
      formData.append('images', selectedFile);
    }

    try {
      const trackProgress = (event: AxiosProgressEvent) => {
        if (!event.total) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setProgress(progress);
      };

      const response = await api(
        `/home/update-home/${id}`,
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

        navigate(`/dashboard/homes/${id}`);
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

  const agentUsers = users.filter((user: User) =>
    user.roles.some((role) => role.name === 'agent'),
  );

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Homes" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <FormIncludes title="Edit Home Information" />
        <div className="p-7">
          <form onSubmit={handleSubmit}>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="name"
                >
                  Home Name
                </label>
                <div className="relative">
                  <InputFDProp
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    placeholder="Kinyasa's"
                  />
                </div>
              </div>
            </div>

         

            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <InputFDProp
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="phone"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <InputFDProp
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="phone"
                    value={formValues.phone}
                    onChange={handleChange}
                    placeholder="07000"
                  />
                </div>
              </div>
            </div>

            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="houseCategory"
                >
                  Category
                </label>
                <div className="relative">
                  <InputFDProp
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="houseCategory"
                    value={formValues.houseCategory}
                    onChange={handleChange}
                    placeholder="eg. Apartment"
                  />
                </div>
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
            </div>

            <div className="mb-5.5">
              <Upload
                label="Upload your document"
                onChange={handleFileChange}
              />
            </div>

            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="description"
              >
                Description
              </label>
              <div className="relative">
                <TextFDProp
                  className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  name="description"
                  rows={6}
                  value={formValues.description}
                  onChange={handleChange}
                  placeholder="Write your describe the home here"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4.5">
              <button
                className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                type="button"
                onClick={() => navigate(-1)}
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
};

export default EditHomeInfo;
