import { useState, useEffect } from 'react';
import { api } from '../middleware/Api';
import { Role } from '../types/interfaces';


export const useFetchRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api('/roles', 'GET');

      if (response && response.data.roles) {
        setRoles(response.data.roles);
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
      console.error('Error fetching roles:', err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return { roles, loading, error, fetchRoles };
};


