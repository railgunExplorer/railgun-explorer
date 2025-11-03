import useSWR from "swr";

const FETCHER_KEY = "railgun-configs";

const fetchConfigurations = async () => {
  const url = process.env.REACT_APP_RAILGUN_PROVIDERS_JSON;
  console.log('Fetching Railgun configurations from:', url);

  if (!url) {
    console.error('REACT_APP_RAILGUN_PROVIDERS_JSON is not defined');
    throw new Error('REACT_APP_RAILGUN_PROVIDERS_JSON environment variable is not set');
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch configurations: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Railgun configurations loaded:', data);
  return data;
};

export const useRailgunConfigurations = () => {
  const { data, isLoading, error } = useSWR(FETCHER_KEY, fetchConfigurations, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (error) {
    console.error('Error loading Railgun configurations:', error);
  }

  return { data, isLoading };
};
