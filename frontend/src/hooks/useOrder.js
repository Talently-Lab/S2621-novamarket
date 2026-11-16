import { useCallback } from 'react';
import orderService from '../services/orderService';
import useRequest from './useRequest';

function useOrder(id) {
  const request = useCallback(
    (signal) => orderService.getOrderById(id, { signal }),
    [id],
  );
  const { data, ...state } = useRequest(request);

  // El contrato dice "→ the order": se acepta la orden suelta o envuelta en `{ order }`, como responde el POST.
  return { ...state, data: data?.order ?? data };
}

export default useOrder;
