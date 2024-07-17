import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../../middleware/Api';
import { Lease, Unit, User } from '../../../../types/interfaces';

interface UseLeaseDataReturn {
  unit: Unit | null;
  user: User | null;
  lease: Lease | null;
  loading: boolean;
  error: string | null;
  fetchLeaseData: (id: string) => Promise<void>;
}

export const useLeaseData = (): UseLeaseDataReturn => {
  const { id } = useParams<{ id: string }>();

  const [unit, setUnit] = useState<Unit | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [lease, setLease] = useState<Lease | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaseData = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api(`/lease/get-who-has-leased-unit-for-test/${id}`, 'GET');
      
      if (response && response.data && response.data.lease && response.data.lease.unit && response.data.lease.user) {
        setUnit(response.data.lease.unit);
        setUser(response.data.lease.user);
        setLease(response.data.lease);
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
    if (id) {
      fetchLeaseData(id);
    }
  }, [id,]);
  

  return { unit, user, lease, loading, error, fetchLeaseData };
};
