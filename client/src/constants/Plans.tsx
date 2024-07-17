import { useState, useEffect } from 'react';
import { api } from '../middleware/Api';
import { Plan } from '../types/interfaces';

const useFetchPlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api('/plans', 'GET');

      if (response && response.data.plans) {
        setPlans(response.data.plans);
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
      console.error('Error fetching plans:', err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return { plans, loading, error, fetchPlans };
};

export default useFetchPlans;
export type { Plan };
