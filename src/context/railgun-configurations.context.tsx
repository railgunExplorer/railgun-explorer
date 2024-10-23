import React, { createContext, useContext } from "react";
import { RailgunConfigurations } from "../models/railgun-configurations";
import useSWR from "swr";
import { NETWORK_CONFIG, NetworkName } from "@railgun-community/shared-models";

const RailgunConfigurationsContext = createContext<
  (RailgunConfigurations & { supportedNetworks: NetworkName[] }) | null
>(null);

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

const getSupportedNetworks = (): NetworkName[] => [
  NetworkName.Ethereum,
  NetworkName.BNBChain,
  NetworkName.Arbitrum,
  NetworkName.Polygon,
];

export const RailgunConfigurationsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { data, isLoading } = useSWR(FETCHER_KEY, fetchConfigurations, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const supportedNetworks = getSupportedNetworks();

  return (
    <RailgunConfigurationsContext.Provider
      value={{ ...data, supportedNetworks }}
    >
      {isLoading ? null : children}
    </RailgunConfigurationsContext.Provider>
  );
};
