import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddressInfo from "../components/AddressInfo/AddressInfo";
import TokenBalances from "../components/TokenBalances/TokenBalances";
import TransactionsTable from "../components/TransactionsTable/TransactionsTable";
import { useWalletHistoryContext } from "../context/wallet-history.context";

export default function SearchResultScreen() {
  const { walletInfo, balances, history, progress } = useWalletHistoryContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (progress !== 0 || !walletInfo) {
      navigate("/");
    }
  }, [walletInfo]);

  const formattedBalances =
    balances?.erc20Amounts?.map((balance) => ({
      token: balance.tokenAddress,
      balance: balance.amount.toString(10),
    })) ?? [];

  const formattedTransactions =
    history?.map((transaction) => ({
      hash: transaction.txid,
      method: transaction.category,
      block: transaction.blockNumber,
      age: transaction.timestamp,
    })) ?? [];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <AddressInfo address={walletInfo?.railgunAddress ?? "N/A"} />
      <TokenBalances balances={formattedBalances} />
      <TransactionsTable transactions={formattedTransactions} />
    </div>
  );
}
