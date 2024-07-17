import React, { useState } from 'react';
import useFetchUsers, { User } from '../../../../constants/Members';
import { api } from '../../../../middleware/Api';
import { AxiosProgressEvent } from 'axios';
import { useParams } from 'react-router-dom';

interface AddAgentModalProps {
  onClose: () => void;
  fetchHomeData: () => Promise<void>;
}

const AddCareTakerModal: React.FC<AddAgentModalProps> = ({
  onClose,
  fetchHomeData,
}) => {
  const { id } = useParams<{ id: string }>(); // Get home_id from URL params
  const { users } = useFetchUsers(); // Fetch users
  const [selectedAgent, setSelectedAgent] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [alert, setAlert] = useState<{
    success: boolean;
    message: string | null;
  }>({ success: false, message: null });
  const [listOpen, setListOpen] = useState<boolean>(false);

  // Filter users to get agents
  const agentUsers = users.filter((user: User) =>
    user.roles.some((role) => role.name === 'caretaker'),
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAgent) return;

    setLoading(true);
    try {
      const trackProgress = (event: AxiosProgressEvent) => {
        if (!event.total) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setProgress(progress);
      };

      const response = await api(
        `/home/add-caretaker/${id}`,
        'POST',
        {},
        {
          care_taker_id: selectedAgent.id,
        },
        trackProgress,
      );

      if (response) {
        setAlert({ success: true, message: 'Agent added successfully.' });
        await fetchHomeData();
        setSelectedAgent(null);
        onClose();
      } 
    } catch (error: any) {
      setAlert({
        success: false,
        message: error.message || 'Error adding agent.',
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleAgentSelect = (agent: User) => {
    setSelectedAgent(agent);
    setListOpen(false); // Close the list after selection
  };

  return (
    <div
      id="crud-modal"
      className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto overflow-x-hidden h-full w-full bg-gray-900 bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-lg max-h-full">
        <div className="relative  bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark rounded-lg  dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Add an CareTaker
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-black rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <form className="p-4 md:p-5" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="agent"
                className="block mb-2 text-sm font-medium text-black dark:text-white"
              >
                Select CareTaker
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setListOpen(!listOpen)}
                  className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  aria-haspopup="true"
                  aria-expanded={listOpen ? 'true' : 'false'}
                >
                  {selectedAgent ? (
                    <div className="flex items-center">
                      <img
                        src={selectedAgent.detail.profileImage}
                        alt="Agent"
                        className="w-6 h-6 rounded-full inline-block mr-2"
                      />
                      <span className="text-black dark:text-white">
                        {`${selectedAgent.detail.first_name} ${selectedAgent.detail.middle_name} ${selectedAgent.detail.last_name}`}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Select a care_taker</span>
                  )}
                  <svg
                    className="w-4 h-4 ml-2 fill-current text-gray-500"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z" />
                  </svg>
                </button>
                {listOpen && (
                  <ul className="absolute z-10 mt-1 w-full  bg-white  dark:border-strokedark dark:bg-boxdark  border border-gray-300 rounded-lg shadow-lg py-1.5 overflow-auto max-h-36">
                    {agentUsers.map((agent) => (
                      <li
                        key={agent.id}
                        onClick={() => handleAgentSelect(agent)}
                        className="cursor-pointer px-4 py-2.5 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <img
                            src={agent.detail.profileImage}
                            alt="Agent"
                            className="w-6 h-6 rounded-full inline-block mr-2"
                          />
                          <span className="text-black dark:text-white">
                            {`${agent.detail.first_name} ${agent.detail.middle_name} ${agent.detail.last_name}`}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              disabled={loading || !selectedAgent}
            >
              {loading && (
                <svg
                  className="animate-spin mr-2 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C6.37 0 2 4.37 2 9.75h2zm2 5.25a8 8 0 01-8-8H0c0 5.52 4.48 10 10 10v-2z"
                  ></path>
                </svg>
              )}
              {loading ? 'Adding...' : 'Add CareTaker'}
            </button>
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
    </div>
  );
};

export default AddCareTakerModal;
