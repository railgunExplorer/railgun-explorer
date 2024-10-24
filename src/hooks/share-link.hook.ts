import { useLocation } from "react-router-dom";
import { useChainSelectorContext } from "../context/chain-selector.context";
import { useWalletHistoryContext } from "../context/wallet-history.context";

export const useShareLinkUrl = (): string => {
  const { selectedViewingKey } = useWalletHistoryContext();
  const { selectedNetwork } = useChainSelectorContext();
  const location = useLocation();

  const url = new URL(window.location.origin + location.pathname);
  url.searchParams.set("viewingKey", selectedViewingKey);
  url.searchParams.set("network", selectedNetwork);

  return url.toString();
};
