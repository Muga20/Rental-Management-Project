import React from 'react';
import { Lease, Unit, User } from '../../../../../types/interfaces';

interface HouseDateAndTimeProps {
  user: User | null;
  lease: Lease | null;
  loading: boolean;
}

const HouseDateAndTime: React.FC<HouseDateAndTimeProps> = ({
  user,
  lease,
  loading,
}) => {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const formattedDate = `${currentTime.toLocaleString('default', {
    month: 'long',
  })} ${currentTime.getDate()}, ${currentTime.getFullYear()}`;
  const formattedTime = `${currentTime
    .getHours()
    .toString()
    .padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;

  const formatLeaseStartDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.toLocaleString('default', {
      month: 'long',
    })} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <div className="border-b px-6">
      <div className="flex flex-col lg:flex-row justify-between -mb-px">
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            className="appearance-none py-4 text-black dark:text-white border-b border-transparent hover:border-grey-dark lg:mr-6"
          >
            <span style={{ fontWeight: 'bold' }}>
              Status:{' '}
              <span className="text-green-400">
                {loading ? 'Loading...' : 'Occupied'}
              </span>
            </span>
          </button>
          <button
            type="button"
            className="appearance-none py-4 text-black dark:text-white border-b border-transparent hover:border-grey-dark lg:mr-6"
          >
            <span style={{ fontWeight: 'bold' }}>Date: {formattedDate}</span>
          </button>
          <button
            type="button"
            className="appearance-none py-4 text-black dark:text-white border-b border-transparent hover:border-grey-dark lg:mr-6"
          >
            <span style={{ fontWeight: 'bold' }}>
              Tenant:{' '}
              {loading
                ? 'Loading...'
                : user
                ? `${user.detail.first_name} ${user.detail.middle_name} ${user.detail.last_name}`
                : 'N/A'}
            </span>
          </button>
          <button
            type="button"
            className="appearance-none py-4 text-black dark:text-white border-b border-transparent hover:border-grey-dark lg:mr-6"
          >
            <span style={{ fontWeight: 'bold' }}>
              Since:{' '}
              {loading
                ? 'Loading...'
                : lease
                ? formatLeaseStartDate(lease.start_date)
                : 'N/A'}
            </span>
          </button>
          <button
            type="button"
            className="appearance-none py-4 text-black dark:text-white border-b border-transparent hover:border-grey-dark lg:mr-3"
          >
            <span style={{ fontWeight: 'bold' }}>Time: {formattedTime}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HouseDateAndTime;
