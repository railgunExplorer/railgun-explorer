import AddressInfo from "../components/AddressInfo/AddressInfo";
import ShareButtonModal from "../components/ShareButtonModal";
import TokenBalances from "../components/TokenBalances/TokenBalances";
import TokenBalancesERC20 from "../components/TokenBalances/TokenBalancesERC20";
import TransactionsTable from "../components/TransactionsTable/TransactionsTable";
import { useChainSelectorContext } from "../context/chain-selector.context";
import { useWalletHistoryContext } from "../context/wallet-history.context";
import { formatToken } from "../utils/format-tokens";
import { TitleHeaderWithShare } from "../components/SearchResultHeader";

export default function SearchResultScreen() {
  const { walletInfo, balances, history } = useWalletHistoryContext();
  const { selectedNetwork } = useChainSelectorContext();

  const formattedBalances =
    balances?.erc20Amounts?.map((balance) =>
      formatToken(balance, selectedNetwork)
    ) ?? [];

  const formattedNfts =
    balances?.nftAmounts?.map((nft) => ({
      token: nft.nftAddress,
      balance: nft.amount.toString(10),
    })) ?? [];

  const formattedTransactions =
    history
      ?.map((transaction) => ({
        hash: transaction.txid,
        method: transaction.category,
        block: transaction.blockNumber,
        age: transaction.timestamp,
      }))
      .sort((a, b) => b.age - a.age) ?? [];

  return (
    <div className="py-6">
      <TitleHeaderWithShare title="Search Result" />
      <AddressInfo address={walletInfo?.railgunAddress ?? "N/A"} />
      <TokenBalancesERC20 title="ERC20 Balances" balances={formattedBalances} />
      <TokenBalances title="NFT Balances" balances={formattedNfts} />
      <TransactionsTable transactions={formattedTransactions} />
    </div>
  );
}
