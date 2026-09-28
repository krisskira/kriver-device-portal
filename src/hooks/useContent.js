import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../api/client';

export function useContent(path) {
  return useQuery({
    queryKey: ['content', path],
    queryFn: () => apiGet(path),
  });
}
