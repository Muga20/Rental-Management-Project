import { useState } from 'react';
import InputFDProp from '../../../components/Forms/InputFields/InputFD';
import Upload from '../../../components/Forms/InputFields/Upload';
import { api } from '../../../middleware/Api';
import { useLoading } from '../../../context/LoadingContext';
import { AxiosProgressEvent } from 'axios';
import { useAlert } from '../../../context/AlertContext';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../layout/DefaultLayout';
import useFetchUsers, { UserData, Role } from '../../../constants/Members'; 
import FormIncludes from '../../../components/Forms/FormIncludes';
import TextFDProp from '../../../components/Forms/InputFields/TesxtAreaFD';

const CreateHome = () => {
  const { setLoading, setProgress } = useLoading();
  const { setAlert } = useAlert();
  const { users } = useFetchUsers();

  const [formValues, setFormValues] = useState({
    name: '',
    location: '',
    houseCategory: '',
    stories: '',
    description: '',
    phone: '',
    email: '',
    number_of_units: '',
    number_of_stories: '',
    agent_id: '',
    images: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
        '/home/create-new-home',
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

        setFormValues({
          name: '',
          location: '',
          houseCategory: '',
          stories: '',
          description: '',
          phone: '',
          email: '',
          number_of_units: '',
          number_of_stories: '',
          agent_id: '',
          images: '',
        });
        setSelectedFile(null);
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

  const agentUsers = users.filter((user: UserData) =>
    user.roles.some((role: Role) => role.name === 'agent'),
  );


  return (
    <DefaultLayout>
      <Breadcrumb pageName="Homes" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <FormIncludes title="Create a new home " />
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

              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="agent_id"
                >
                  Agent
                </label>
                <div className="relative">
                  <select
                    id="agent_id"
                    name="agent_id"
                    className="form-select mt-1 block w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    value={formValues.agent_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Agent</option>
                    {agentUsers.map((user, index) => (
                      <option key={index} value={user.id}>
                        {`${user.detail?.first_name} ${user.detail?.last_name}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="stories"
                >
                  Number of units in this House
                </label>
                <div className="relative">
                  <InputFDProp
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="stories"
                    value={formValues.stories}
                    onChange={handleChange}
                    placeholder="eg.10 House per Floor"
                  />
                </div>
              </div>

              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="number_of_units"
                >
                  Number of Stories/Floor
                </label>
                <div className="relative">
                  <InputFDProp
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="tel"
                    name="number_of_units"
                    value={formValues.number_of_units}
                    onChange={handleChange}
                    placeholder="eg. Number of Floors"
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
                onClick={() =>
                  setFormValues({
                    ...formValues,
                    name: '',
                    location: '',
                    houseCategory: '',
                    stories: '',
                    description: '',
                    phone: '',
                    email: '',
                    number_of_units: '',
                    number_of_stories: '',
                    agent_id: '',
                    images: '',
                  })
                }
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

export default CreateHome;
