import { useState, useCallback } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseAsyncStateReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
  setData: (data: T | null) => void;
}

/**
 * Custom hook for managing async operations with loading and error states
 *
 * @example
 * const { data, loading, error, execute } = useAsyncState(async (id) => {
 *   return await fetchData(id);
 * });
 *
 * // In component
 * useEffect(() => {
 *   execute(studentId);
 * }, [studentId]);
 */
export function useAsyncState<T>(
  asyncFunction: (...args: any[]) => Promise<T>
): UseAsyncStateReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      setState({ data: null, loading: true, error: null });

      try {
        const result = await asyncFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setState({ data: null, loading: false, error });
        throw error;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
    setData,
  };
}
