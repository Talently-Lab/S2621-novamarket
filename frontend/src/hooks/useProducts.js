import { useCallback } from 'react';
import productService from '../services/productService';
import useRequest from './useRequest';

function useProducts({ search, category, page, limit, featured, offer } = {}) {
  const request = useCallback(
    (signal) =>
      productService.getProducts(
        { search, category, page, limit, featured, offer },
        { signal },
      ),
    [search, category, page, limit, featured, offer],
  );

  return useRequest(request);
}

export default useProducts;
