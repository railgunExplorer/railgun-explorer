import { useState, useCallback, useEffect } from "react";
import {
  NetworkName,
  RailgunBalancesEvent,
  RailgunWalletInfo,
} from "@railgun-community/shared-models";
import {
  initializeEngine,
  loadProvider,
  queryWalletBalance,
  unloadProvider,
} from "../services/railgun-web";
import { useChainSelectorContext } from "../context/chain-selector.context";
import { useAppConfigurations } from "../context/app-configurations.context";

export interface WalletHistoryHookResult {
  selectedViewingKey: string;
  walletInfo: RailgunWalletInfo | undefined;
  history: any[];
  progress: number;
  balances: RailgunBalancesEvent | undefined;
  handleQueryWalletBalance: (viewingKey: string) => Promise<void>;
  isLoading: boolean;
  isInitialized: boolean;
}

export const useWalletHistory = (): WalletHistoryHookResult => {
  const {
    networkProvidersConfig,
    proxyPoiAggregatorUrl,
    publicPoiAggregatorUrls,
  } = useAppConfigurations();
  const { selectedNetwork } = useChainSelectorContext();

  const [selectedViewingKey, setSelectedViewingKey] = useState("");
  const [currentNetwork, setCurrentNetwork] = useState(selectedNetwork);
  const [balances, setBalances] = useState<RailgunBalancesEvent>();
  const [walletInfo, setWalletInfo] = useState<RailgunWalletInfo>();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState([]);

  const initializeRailgunEngine = useCallback(async () => {
    const poiNodeURLs = [proxyPoiAggregatorUrl, ...publicPoiAggregatorUrls];
    await initializeEngine({ poiNodeURLs });

    const provider = networkProvidersConfig[selectedNetwork];
    setCurrentNetwork(selectedNetwork);
    await loadProvider(provider, selectedNetwork, 1000 * 60 * 1000);

    setIsInitialized(true);
  }, [
    networkProvidersConfig,
    proxyPoiAggregatorUrl,
    publicPoiAggregatorUrls,
    selectedNetwork,
  ]);

  const onChangeNetwork = useCallback(async () => {
    if (currentNetwork !== selectedNetwork) {
      setIsLoading(true);

      await loadProvider(
        networkProvidersConfig[selectedNetwork],
        selectedNetwork,
        1000 * 60 * 1000
      );

      if (currentNetwork !== NetworkName.Ethereum) {
        await unloadProvider(currentNetwork);
      }
      setCurrentNetwork(selectedNetwork);

      if (selectedViewingKey) {
        await handleQueryWalletBalance(selectedViewingKey);
      }
      setIsLoading(false);
    }
  }, [selectedNetwork, currentNetwork, selectedViewingKey]);

  useEffect(() => {
    initializeRailgunEngine();
  }, []);

  useEffect(() => {
    onChangeNetwork();
  }, [selectedNetwork]);

  const handleQueryWalletBalance = useCallback(
    async (viewingKey: string) => {
      if (isLoading) return;
      setIsLoading(true);
      setSelectedViewingKey(viewingKey);

      if (!isInitialized) {
        await initializeRailgunEngine();
      }

      try {
        await queryWalletBalance(
          viewingKey,
          selectedNetwork,
          setWalletInfo,
          setProgress,
          setBalances,
          setHistory
        );
      } catch (error) {
        setIsInitialized(false);
        await initializeRailgunEngine();
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, isInitialized, initializeRailgunEngine]
  );

  return {
    selectedViewingKey,
    walletInfo,
    history,
    progress,
    balances,
    handleQueryWalletBalance,
    isLoading,
    isInitialized,
  };
};
