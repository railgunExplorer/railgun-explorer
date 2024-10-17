import React, { createContext, useContext, ReactNode } from "react";
import {
  useWalletHistory,
  WalletHistoryHookResult,
} from "../hooks/wallet-history.hook";
import LoadingModal from "../components/LoadingModal";

const WalletHistoryContext = createContext<WalletHistoryHookResult>(undefined);

export const useWalletHistoryContext = () => {
  const context = useContext(WalletHistoryContext);
  if (context === undefined) {
    throw new Error(
      "useWalletHistoryContext must be used within a WalletHistoryProvider"
    );
  }
  return context;
};

export const WalletHistoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const walletHistory = useWalletHistory();
  
  const { progress, isLoading, isInitialized } = walletHistory;
  const formattedProgress =
    isInitialized && !isLoading && progress === 0
      ? 100
      : Math.round(progress * 100);

  return (
    <WalletHistoryContext.Provider value={walletHistory}>
      {children}
      {isLoading && (
        <LoadingModal
          progress={formattedProgress}
          message="Loading Wallet History"
          subMessage="Please wait while we fetch your wallet history"
        />
      )}
    </WalletHistoryContext.Provider>
  );
};
