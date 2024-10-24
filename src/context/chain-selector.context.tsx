import React, { createContext, useState, useContext, ReactNode } from "react";
import { NETWORK_CONFIG, NetworkName } from "@railgun-community/shared-models";
import { useAppConfigurations } from "./app-configurations.context";

type ChainSelectorContextType = {
  selectedNetwork: NetworkName;
  defaultNetwork: NetworkName;
  options: { label: string; value: NetworkName }[];
  changeSelectNetwork: (network: NetworkName) => void;
};

const ChainSelectorContext = createContext<
  ChainSelectorContextType | undefined
>(undefined);

const DEFAULT_NETWORK = NetworkName.Ethereum;

export const ChainSelectorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { supportedNetworks, getInitialQueryParam } = useAppConfigurations();

  const networkParam = getInitialQueryParam<NetworkName>("network");
  const initialNetwork =
    networkParam && supportedNetworks.includes(networkParam)
      ? networkParam
      : DEFAULT_NETWORK;

  const [selectedNetwork, setSelectedNetwork] =
    useState<NetworkName>(initialNetwork);

  const options = supportedNetworks.map((network) => ({
    label: NETWORK_CONFIG[network].publicName,
    value: network,
  }));

  const changeSelectNetwork = (network: NetworkName) => {
    if (supportedNetworks.includes(network)) {
      setSelectedNetwork(network);
    }
  };

  return (
    <ChainSelectorContext.Provider
      value={{
        selectedNetwork,
        defaultNetwork: DEFAULT_NETWORK,
        options,
        changeSelectNetwork,
      }}
    >
      {children}
    </ChainSelectorContext.Provider>
  );
};

export const useChainSelectorContext = () => {
  const context = useContext(ChainSelectorContext);
  if (context === undefined) {
    throw new Error(
      "useChainSelectorContext must be used within a ChainSelectorProvider"
    );
  }
  return context;
};
