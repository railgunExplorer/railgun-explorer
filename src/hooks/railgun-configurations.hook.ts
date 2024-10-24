import useSWR from "swr";

const FETCHER_KEY = "railgun-configs";

const fetchConfigurations = async () => {
  const response = await fetch(process.env.REACT_APP_RAILGUN_PROVIDERS_JSON);
  return response.json();
};

export const useRailgunConfigurations = () => {
  const { data, isLoading } = useSWR(FETCHER_KEY, fetchConfigurations, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return { data, isLoading };
};
