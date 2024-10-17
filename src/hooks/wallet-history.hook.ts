import { useState, useEffect } from "react";
import { RailgunBalancesEvent, RailgunWalletInfo } from "@railgun-community/shared-models";
import { initRailgun, queryWalletBalance } from "../services/railgun-web";

export interface WalletHistoryHookResult {
  walletInfo: RailgunWalletInfo | undefined;
  history: any[];
  progress: number;
  balances: RailgunBalancesEvent | undefined;
  handleQueryWalletBalance: (viewingKey: string) => Promise<void>;
  isLoading: boolean;
  isInitialized: boolean;
}

export const useWalletHistory = (): WalletHistoryHookResult => {
  const [history, setHistory] = useState([]);
  const [balances, setBalances] = useState<RailgunBalancesEvent>();
  const [progress, setProgress] = useState(0);
  const [walletInfo, setWalletInfo] = useState<RailgunWalletInfo>();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleQueryWalletBalance = async (viewingKey: string) => {
    setIsLoading(true);
    
    if (!isInitialized) {
      await initRailgun().then(() => setIsInitialized(true));
    }

    if (isLoading) return;
    try {
      await queryWalletBalance(viewingKey, setWalletInfo, setProgress, setBalances, setHistory);
    } catch (error) {
      setIsInitialized(false);
      await initRailgun();
      setIsInitialized(true);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    walletInfo,
    history,
    progress,
    balances,
    handleQueryWalletBalance,
    isLoading,
    isInitialized,
  };
};
