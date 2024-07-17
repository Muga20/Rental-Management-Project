import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lease, Unit, User } from '../../../../../types/interfaces';
import { AxiosProgressEvent } from 'axios';
import { useLoading } from '../../../../../context/LoadingContext';
import { useAlert } from '../../../../../context/AlertContext';
import { api } from '../../../../../middleware/Api';
import { TenantEntrySK } from '../../Components/TenantEntrySK';
import { useLeaseData } from '../../Constants/HouseData';

interface LeaseHouseProps {
  unit: Unit | null;
  user: User | null;
  lease: Lease | null;
  loading: boolean;
}

const LeaseHouse: React.FC<LeaseHouseProps> = ({
  unit,
  user,
  lease,
  loading,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { setLoading, setProgress } = useLoading();
  const { setAlert } = useAlert();
  const { fetchLeaseData } = useLeaseData();


  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoading(true);

    try {
      const trackProgress = (event: AxiosProgressEvent) => {
        if (!event.total) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setProgress(progress);
      };

      const response = await api(
        `/lease/terminate-lease/${lease?.id}`,
        'DELETE',
        {},
        trackProgress,
      );

      if (response?.success) {
        // Update lease data after successful termination
        await fetchLeaseData(id || ''); 
        setAlert({
          success: true,
          message: response.message || 'Tenant Removed',
          error: null,
        });
      } else {
        throw new Error(response?.message || 'Failed to terminate lease');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'An error occurred while removing the tenant';
      setAlert({
        success: false,
        message: errorMessage,
        error: error?.message || null,
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  const handleButtonClick = () => {
    if (lease) {
      handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
    } else {
      navigate(`/home/house/lease-page/${id}`);
    }
  };

  if (loading || isSubmitting) {
    return (
      <div className="w-full lg:w-1/2 px-4">
        <TenantEntrySK />
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/2 px-4">
      <div className="bg-white dark:bg-boxdark border-t border-b sm:rounded sm:border shadow">
        <div className="border-b">
          <div className="flex justify-between px-6 -mb-px">
            <h3 className="text-black dark:text-white py-4 font-normal text-lg">
              Leasing
            </h3>
          </div>
        </div>
        <div>
          <div className="text-center px-6 py-4">
            <div className="py-8">
              <div className="mb-4">
                <svg
                  className="inline-block fill-current text-black dark:text-white h-16 w-16"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M11.933 13.069s7.059-5.094 6.276-10.924a.465.465 0 0 0-.112-.268.436.436 0 0 0-.263-.115C12.137.961 7.16 8.184 7.16 8.184c-4.318-.517-4.004.344-5.974 5.076-.377.902.234 1.213.904.959l2.148-.811 2.59 2.648-.793 2.199c-.248.686.055 1.311.938.926 4.624-2.016 5.466-1.694 4.96-6.112zm1.009-5.916a1.594 1.594 0 0 1 0-2.217 1.509 1.509 0 0 1 2.166 0 1.594 1.594 0 0 1 0 2.217 1.509 1.509 0 0 1-2.166 0z" />
                </svg>
              </div>
              <p className="text-2xl text-black dark:text-white font-medium mb-4">
                {lease
                  ? 'This Unit is currently leased'
                  : 'This Unit is not yet leased'}
              </p>
              <div>
                <button
                  type="button"
                  className={`${
                    lease
                      ? 'bg-red-500 hover:bg-red-700'
                      : 'bg-blue hover:bg-blue-dark'
                  } dark:text-white text-black border rounded px-6 py-4`}
                  onClick={handleButtonClick}
                >
                  {lease ? 'Remove Tenant' : 'Lease it Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaseHouse;
