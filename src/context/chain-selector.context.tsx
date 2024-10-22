import React, { createContext, useState, useContext, ReactNode } from "react";
import {
  SupportedNetworks,
  SupportedNetworkValues,
} from "../models/supported-networks";
import { NETWORK_CONFIG, NetworkName } from "@railgun-community/shared-models";

type ChainSelectorContextType = {
  selectedNetwork: SupportedNetworks;
  defaultNetwork: SupportedNetworks;
  options: { label: string; value: SupportedNetworks }[];
  changeSelectNetwork: (network: SupportedNetworks) => void;
};

const ChainSelectorContext = createContext<
  ChainSelectorContextType | undefined
>(undefined);

const DEFAULT_NETWORK = NetworkName.Ethereum;

export const ChainSelectorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedNetwork, setSelectedNetwork] =
    useState<SupportedNetworks>(DEFAULT_NETWORK);

  const options = SupportedNetworkValues.map((network) => ({
    label: NETWORK_CONFIG[network].publicName,
    value: network,
  }));

  const changeSelectNetwork = (network: SupportedNetworks) => {
    if (SupportedNetworkValues.includes(network)) {
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
