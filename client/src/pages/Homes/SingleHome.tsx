import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChartOne from '../../components/Charts/ChartOne';
import ChartTwo from '../../components/Charts/ChartTwo';
import DefaultLayout from '../../layout/DefaultLayout';
import { Stats } from './HomeSubs/Stats';
import { api } from '../../middleware/Api';
import { ApiResponse } from '../../types/interfaces'; // Adjust path as per your project

import Agents from './HomeSubs/Agents';
import CareTakers from './HomeSubs/CareTakers'; // Import CareTakers component
import { HomeInfo } from './HomeSubs/HomeInfo';
import Payments from './HomeSubs/Payments/Payments';

export const SingleHome = () => {
  const { id } = useParams<{ id: string }>();

  const [homeData, setHomeData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeProfileData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api(`/home/home-profile/${id}`, 'GET');

      if (
        response &&
        response.data &&
        response.data.home &&
        response.data.vacantUnits !== undefined &&
        response.data.agentUsers !== undefined &&
        response.data.careTakers !== undefined
      ) {
        setHomeData(response.data);
      } else {
        throw new Error('Invalid response structure');
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      console.error('Error fetching home data:', err);
    }
  };

  useEffect(() => {
    fetchHomeProfileData();
  }, [id]);

  return (
    <DefaultLayout>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {homeData && (
        <>
          <Stats homes={homeData.home} vacantUnits={homeData.vacantUnits} />
          <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
            <div className="col-span-12 xl:col-span-8">
              {/* <TableOne /> */}
              <HomeInfo home={homeData.home} />
            </div>
            <ChartTwo />
            <Agents
              agents={homeData.agentUsers}
              fetchHomeProfileData={fetchHomeProfileData}
            />
            <ChartOne />
            <div className="col-span-12 xl:col-span-8">
              <Payments />
            </div>
            <CareTakers
              care_takers={homeData.careTakers}
              fetchHomeProfileData={fetchHomeProfileData}
            />
          </div>
        </>
      )}
    </DefaultLayout>
  );
};
