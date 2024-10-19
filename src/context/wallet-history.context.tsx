import React, { createContext, useContext, ReactNode } from "react";
import {
  useWalletHistory,
  WalletHistoryHookResult,
} from "../hooks/wallet-history.hook";

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

  return (
    <WalletHistoryContext.Provider value={walletHistory}>
      {children}
    </WalletHistoryContext.Provider>
  );
};
