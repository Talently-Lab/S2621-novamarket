import { useCallback, useEffect, useState } from 'react';

// Base de los hooks de datos: ejecuta `request` y devuelve { data, loading, error, refetch }.
// `request` tiene que venir memoizado: cuando cambia, se cancela el pedido anterior y se pide de nuevo.
function useRequest(request) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({
    request: null,
    attempt: null,
    data: null,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    request(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) {
          setResult({ request, attempt, data, error: null });
        }
      },
      (error) => {
        if (!controller.signal.aborted) {
          setResult({ request, attempt, data: null, error });
        }
      },
    );

    return () => controller.abort();
  }, [request, attempt]);

  const refetch = useCallback(() => setAttempt((current) => current + 1), []);
  const isCurrent = result.request === request && result.attempt === attempt;

  return {
    data: isCurrent ? result.data : null,
    loading: !isCurrent,
    error: isCurrent ? result.error : null,
    refetch,
  };
}

export default useRequest;
