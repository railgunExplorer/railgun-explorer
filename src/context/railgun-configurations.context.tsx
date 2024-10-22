import React, { createContext, useContext } from "react";
import { RailgunConfigurations } from "../models/railgun-configurations";
import useSWR from "swr";

const RailgunConfigurationsContext =
  createContext<RailgunConfigurations | null>(null);

export const useRailgunConfigurations = () => {
  const context = useContext(RailgunConfigurationsContext);
  if (!context) {
    throw new Error(
      "useRailgunConfigurations must be used within a RailgunConfigurationsProvider"
    );
  }
  return context;
};

const FETCHER_KEY = "railgun-configs";

const fetchConfigurations = async () => {
  const response = await fetch(process.env.REACT_APP_RAILGUN_PROVIDERS_JSON);
  return response.json();
};

export const RailgunConfigurationsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { data, isLoading } = useSWR(FETCHER_KEY, fetchConfigurations, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return (
    <RailgunConfigurationsContext.Provider value={data}>
      {isLoading ? null : children}
    </RailgunConfigurationsContext.Provider>
  );
};
