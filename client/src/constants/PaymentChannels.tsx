import { useState, useEffect } from 'react';
import { api } from '../middleware/Api';
import { PaymentChannel } from '../types/interfaces';

const useFetchPaymentChannels = () => {
  const [paymentChannels, setPaymentChannels] = useState<PaymentChannel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentChannels = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api('/payment/get-payment-channels', 'GET');

      if (response && response.data.paymentChannels) {
        setPaymentChannels(response.data.paymentChannels);
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
      console.error('Error fetching payment channels:', err);
    }
  };

  useEffect(() => {
    fetchPaymentChannels();
  }, []);

  return { paymentChannels, loading, error, fetchPaymentChannels };
};

export default useFetchPaymentChannels;
export type { PaymentChannel };
