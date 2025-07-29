import { useState } from 'react';
import { LoadingStates, ErrorStates } from '../services/types';

export const useApiData = () => {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    dashboard: false,
    orders: false,
    inbox: false,
    recommendations: false,
    chat: false
  });

  const [errorStates, setErrorStates] = useState<ErrorStates>({
    dashboard: null,
    orders: null,
    inbox: null,
    recommendations: null,
    chat: null
  });

  const setLoading = (key: keyof LoadingStates, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  };

  const setError = (key: keyof ErrorStates, error: Error | null) => {
    setErrorStates(prev => ({ ...prev, [key]: error }));
  };

  return {
    loadingStates,
    errorStates,
    setLoading,
    setError
  };
};
