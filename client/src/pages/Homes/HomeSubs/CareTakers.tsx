import React, { useState } from 'react';
import { AgentUser } from '../../../types/interfaces';
import AddCareTakerModal from './Modals/AddCareTakerModal';
import { AxiosProgressEvent } from 'axios';
import { api } from '../../../middleware/Api';
import { useAlert } from '../../../context/AlertContext';
import { useLoading } from '../../../context/LoadingContext';

interface CareTakersProps {
  care_takers: AgentUser[];
  fetchHomeProfileData: () => Promise<void>;
}

const CareTakers: React.FC<CareTakersProps> = ({
  care_takers,
  fetchHomeProfileData,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { setLoading, setProgress } = useLoading();

  const { setAlert } = useAlert();

  const handleDeleteCareTaker = async (careTakerId: string) => {
    setLoading(true);
    try {
      const trackProgress = (event: AxiosProgressEvent) => {
        if (!event.total) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setProgress(progress);
      };

      const response = await api(
        `/home/remove-caretaker/${careTakerId}`,
        'DELETE',
        {},
        {},
        trackProgress,
      );

      if (response) {
        await fetchHomeProfileData();
        setAlert({
          success: true,
          message: 'CareTaker deleted successfully.',
          error: null,
        });
      }
    } catch (error: any) {
      setAlert({
        success: false,
        message: error.message || 'Error deleting caretaker.',
        error: null,
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleAddCareTakerClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Care Takers
      </h4>

      {/* Backdrop for modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-blur-lg">
          <div className="bg-opacity-75 bg-gray-800 absolute inset-0"></div>
        </div>
      )}

      <div>
        <button
          onClick={handleAddCareTakerClick}
          className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4"
        >
          <div className="relative h-14 w-14 rounded-full">
            <div className="h-full w-full flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full">
              <span className="text-2xl text-black dark:text-white">+</span>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-between">
            <div>
              <h5 className="font-medium text-black dark:text-white">
                Add CareTaker
              </h5>
            </div>
          </div>
        </button>

        {care_takers.map((careTaker, key) => (
          <div
            className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4"
            key={key}
          >
            <div className="relative h-14 w-14 rounded-full">
              <img
                src={careTaker.detail.profileImage}
                alt="User"
                className="rounded"
              />
            </div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {careTaker.detail.first_name} {careTaker.detail.middle_name}{' '}
                  {careTaker.detail.last_name}
                </h5>
                <p>
                  <span className="text-sm text-black dark:text-white">
                    {careTaker.detail.description}
                  </span>
                  <span className="text-xs">
                    {careTaker.last_login_at
                      ? ` . ${careTaker.last_login_at} min`
                      : ''}
                  </span>
                </p>
              </div>

              <button
                className="rounded-full bg-red-500 p-2 hover:bg-red-600 text-white transition duration-300"
                onClick={() => handleDeleteCareTaker(careTaker.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <AddCareTakerModal
          onClose={handleCloseModal}
          fetchHomeData={fetchHomeProfileData}
        />
      )}
    </div>
  );
};

export default CareTakers;
