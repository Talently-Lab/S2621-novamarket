import { useCallback } from 'react';
import categoryService from '../services/categoryService';
import useRequest from './useRequest';

function useCategories() {
  const request = useCallback(
    (signal) => categoryService.getCategories({ signal }),
    [],
  );
  const { data, ...state } = useRequest(request);

  return { ...state, data: data?.categories ?? null };
}

export default useCategories;
