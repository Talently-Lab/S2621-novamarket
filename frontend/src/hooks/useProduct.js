import { useCallback } from 'react';
import productService from '../services/productService';
import useRequest from './useRequest';

function useProduct(id) {
  const request = useCallback(
    (signal) => productService.getProductById(id, { signal }),
    [id],
  );
  const { data, ...state } = useRequest(request);

  // El contrato dice "→ product": se acepta el producto suelto o envuelto en `{ product }`.
  return { ...state, data: data?.product ?? data };
}

export default useProduct;
