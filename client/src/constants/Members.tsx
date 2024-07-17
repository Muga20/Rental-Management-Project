import { useState, useEffect } from 'react';
import { api } from '../middleware/Api';
import { Role, UserData } from '../types/interfaces';


const useFetchUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api(`/member/staff`, 'GET');

      if (response && response.data.usersInCompany) {
        setUsers(response.data.usersInCompany);
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
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return { users, loading, error };
};

export default useFetchUsers;
export type { UserData, Role };
