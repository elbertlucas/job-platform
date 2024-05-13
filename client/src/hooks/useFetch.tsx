import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import useSWR, { useSWRConfig } from 'swr'

export function useFetch<Data = any, Error = AxiosError>(url: string, method?: 'POST' | 'PUT' | 'DELETE' | 'GET', body?: any) {
  const { mutate } = useSWRConfig()
  const { data: output, error, isLoading } = useSWR<Data, Error>(url, async (url: string) => {
    switch (method) {
      case 'POST':
        return (await api.post(url, body)).data;
      case 'PUT':
        return (await api.put(url, body)).data;
      case 'DELETE':
        return (await api.put(url, body)).data;
      default:
        return (await api.get(url)).data;
    }
  }
  ,{refreshInterval: 15000}
  )

  const data = output || []
  return { data, error, isLoading, mutate }
}