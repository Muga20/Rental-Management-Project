import { useState, useEffect } from 'react';
import { api } from '../middleware/Api';
import { Channel, UserData } from '../types/interfaces';

interface UseUserDataReturn {
  userData: UserData | null;
  userRoles: string[];
  channels: Channel[] | null;
  loading: boolean;
  error: string | null;
  fetchUserData: () => Promise<void>;
}

export const useUserData = (): UseUserDataReturn => {

  const [userData, setUserData] = useState<UserData | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [channels, setChannels] = useState<Channel[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api('/member/get-authenticated-cred', 'GET');

      if (response && response.data.user && response.data.roles) {
        setUserData(response.data.user);
        setUserRoles(response.data.roles);
        setChannels(response.data.channels || []);
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


  return { userData, userRoles, channels, loading, error, fetchUserData };
};
