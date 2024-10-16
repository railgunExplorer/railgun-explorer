import React, { createContext, useContext, ReactNode } from "react";
import { useWalletHistory } from "../hooks/wallet-history.hook";
import {
  RailgunBalancesEvent,
  RailgunWalletInfo,
  TransactionHistoryItem,
} from "@railgun-community/shared-models";

interface WalletHistoryContextType {
  walletInfo: RailgunWalletInfo;
  history: TransactionHistoryItem[];
  progress: number;
  balances: RailgunBalancesEvent;
  handleQueryWalletBalance: (viewingKey: string) => Promise<void>;
  isLoading: boolean;
  isInitialized: boolean;
}

const WalletHistoryContext = createContext<
  WalletHistoryContextType | undefined
>(undefined);

export const useWalletHistoryContext = () => {
  const context = useContext(WalletHistoryContext);
  if (context === undefined) {
    throw new Error(
      "useWalletHistoryContext must be used within a WalletHistoryProvider"
    );
  }
  return context;
};

interface WalletHistoryProviderProps {
  children: ReactNode;
}

export const WalletHistoryProvider: React.FC<WalletHistoryProviderProps> = ({
  children,
}) => {
  const walletHistory = useWalletHistory();

  return (
    <WalletHistoryContext.Provider value={walletHistory}>
      {children}
    </WalletHistoryContext.Provider>
  );
};
