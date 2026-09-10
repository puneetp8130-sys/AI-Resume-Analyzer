import { useCallback, useState } from 'react';

/**
 * Small helper to standardize loading/error/data state for one-off async
 * calls (e.g. fetching history, deleting a report) without pulling in a
 * data-fetching library.
 */
export function useAsync() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (asyncFn) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      return result;
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, setError, run };
}
