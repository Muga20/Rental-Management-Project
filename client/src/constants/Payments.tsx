import { useState, useEffect } from 'react';
import { api } from '../middleware/Api';
import { Payment } from '../types/interfaces';


const useFetchPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api('/payment/get-payment-mode-types', 'GET');

      if (response && response.data.payments) {
        setPayments(response.data.payments);
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
      console.error('Error fetching payments:', err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return { payments, loading, error, fetchPayments };
};

export default useFetchPayments;
export type { Payment };
