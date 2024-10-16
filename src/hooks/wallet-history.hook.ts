import { useState, useEffect } from "react";
import { RailgunBalancesEvent, RailgunWalletInfo } from "@railgun-community/shared-models";
import { initRailgun, queryWalletBalance } from "../services/railgun-web";

export const useWalletHistory = () => {
  const [history, setHistory] = useState([]);
  const [balances, setBalances] = useState<RailgunBalancesEvent>();
  const [progress, setProgress] = useState(0);
  const [walletInfo, setWalletInfo] = useState<RailgunWalletInfo>();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initRailgun().then(() => setIsInitialized(true));
  }, []);

  const handleQueryWalletBalance = async (viewingKey: string) => {
    if (isLoading) return;
    setIsLoading(true);
    await queryWalletBalance(viewingKey, setWalletInfo, setProgress, setBalances, setHistory);
    setIsLoading(false);
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

