import { useState, useEffect, useCallback } from 'react';
import { parseErrorMessage } from '../utils/helpers';

/**
 * Custom hook for fetching data
 * @param {Function} serviceFunction - The API service function to call
 * @param {Array} params - Parameters to pass to the service function
 * @param {Object} options - Options for the hook
 * @returns {Object} { data, loading, error, refetch }
 */
export const useFetch = (serviceFunction, params = [], options = {}) => {
  const { immediate = true, onSuccess, onError } = options;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const actualParams = args.length > 0 ? args : params;
      const result = await serviceFunction(...actualParams);
      
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const errorMessage = parseErrorMessage(err);
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [serviceFunction, onSuccess, onError, params]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, fetchData]);

  const refetch = useCallback((...args) => {
    return fetchData(...args);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

export default useFetch;

