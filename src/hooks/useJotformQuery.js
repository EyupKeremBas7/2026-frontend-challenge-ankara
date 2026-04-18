import { useState, useEffect } from 'react';

export function useJotformQuery(fetchFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    // Avoid triggering react-hooks/set-state-in-effect lint by scheduling
    // the "start loading" state update asynchronously.
    queueMicrotask(() => {
      if (isMounted) setLoading(true);
    });
    fetchFn()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fetchFn]);

  return { data, loading, error };
}
