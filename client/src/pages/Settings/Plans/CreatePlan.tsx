import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputFDProp from '../../../components/Forms/InputFields/InputFD';
import { useAlert } from '../../../context/AlertContext';
import { api } from '../../../middleware/Api';
import { useLoading } from '../../../context/LoadingContext';
import { AxiosProgressEvent } from 'axios';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import FormIncludes from '../../../components/Forms/FormIncludes';

interface CreatePlanProps {
  refreshPayments: () => void;
}

function CreatePlan({ refreshPayments }: CreatePlanProps) {
  const { setLoading, setProgress } = useLoading();
  const { setAlert } = useAlert();
  const [plan_name, setPlanName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [numberOfHomes, setNumberOfHomes] = useState('');
  const [numberOfAgents, setNumberOfAgents] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'plan_name') setPlanName(value);
    if (name === 'price') setPrice(value);
    if (name === 'duration') setDuration(value);
    if (name === 'number_of_homes') setNumberOfHomes(value);
    if (name === 'number_of_agents') setNumberOfAgents(value);
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
        '/plans/create_plan',
        'POST',
        {},
        {
          plan_name,
          price,
          duration,
          number_of_homes: numberOfHomes,
          number_of_agents: numberOfAgents,
        },
        trackProgress,
      );

      if (response && response.data && response.data.success) {
        setAlert({
          success: true,
          message: 'Plan created successfully.',
          error : null
        });

        setPlanName('');
        setPrice('');
        setDuration('');
        setNumberOfHomes('');
        setNumberOfAgents('');
        refreshPayments(); // Refresh the payments list after successful creation
        navigate(-1);
      } else if (response && response.data && response.data.error) {
        setAlert({
           success: false,
          message: response.data.error,
          error:null
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      setAlert({
        success: false,
        message: 'Error creating plan.',
        error : null
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Create New Plan" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

        <FormIncludes title="Create a new plan" />

        <div className="p-7">
          <form onSubmit={handleSubmit}>
            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="plan_name"
              >
                Plan Name<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <InputFDProp
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                  name="plan_name"
                  value={plan_name}
                  onChange={handleChange}
                  placeholder="Enter Plan Name"
                />
              </div>
            </div>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="price"
                >
                  Plan Price
                </label>
                <div className="relative">
                  <InputFDProp
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="price"
                    value={price}
                    onChange={handleChange}
                    placeholder="ksh 200"
                  />
                </div>
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="duration"
                >
                  Duration
                </label>
                <div className="relative">
                  <InputFDProp
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible
                    :outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="duration"
                    value={duration}
                    onChange={handleChange}
                    placeholder="e.g. 1 month"
                  />
                </div>
              </div>
            </div>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="number_of_homes"
                >
                  Number of Homes
                </label>
                <div className="relative">
                  <InputFDProp
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="number_of_homes"
                    value={numberOfHomes}
                    onChange={handleChange}
                    placeholder="Enter Number of Homes"
                  />
                </div>
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="number_of_agents"
                >
                  Number of Agents
                </label>
                <div className="relative">
                  <InputFDProp
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="number_of_agents"
                    value={numberOfAgents}
                    onChange={handleChange}
                    placeholder="Enter Number of Agents"
                  />
                </div>
              </div>
            </div>
            <div className="mt-7">
              <button
                type="submit"
                className="w-full bg-primary text-white rounded-lg py-4 font-medium transition duration-300 ease-in-out hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:bg-primarydark dark:hover:bg-opacity-90 dark:focus:ring-primarydark"
              >
                Create Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default CreatePlan;
