import { useState, useEffect } from 'react';
import { api } from '../middleware/Api';
import { Company } from '../types/interfaces';

const useFetchCompany = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api(
        '/company/showAvailableCompanies',
        'GET',
      );

      if (response && response.data.companies) {
        setCompanies(response.data.companies.data);
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
      console.error('Error fetching companies:', err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return { companies, loading, error, fetchCompanies }; 
};

export default useFetchCompany;
