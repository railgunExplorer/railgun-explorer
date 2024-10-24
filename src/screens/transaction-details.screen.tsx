import React from "react";
import { useParams } from "react-router-dom";
import { useWalletHistoryContext } from "../context/wallet-history.context";
import { useChainSelectorContext } from "../context/chain-selector.context";
import { formatToken } from "../utils/format-tokens";
import { RailgunERC20Amount } from "@railgun-community/shared-models";
import TokenSymbol from "../components/TokenSymbol/TokenSymbol";
import RawBalanceWarning from "../components/RawBalanceWarning/RawBalanceWarning";
import { TitleHeaderWithShare } from "../components/SearchResultHeader";

const ellipsizeHash = (hash: string, visibleChars: number = 6) => {
  if (hash.length <= visibleChars * 2) return hash;
  return `${hash.slice(0, visibleChars)}...${hash.slice(-visibleChars)}`;
};

const Th: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th
    scope="col"
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
  >
    {children}
  </th>
);

const Td: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm">{children}</td>
);

const TokenTable: React.FC<{
  title: string;
  tokens: any[];
  showSender?: boolean;
  showRecipient?: boolean;
}> = ({ title, tokens, showSender = false, showRecipient = false }) => (
  <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-8">
    <div className="px-4 py-5 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
    </div>
    {tokens.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <Th>Token Address</Th>
              <Th>Amount</Th>
              {showSender && <Th>Sender Address</Th>}
              {showRecipient && <Th>Recipient Address</Th>}
              <Th>{showSender ? "Balance Bucket" : "Wallet Source"}</Th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tokens.map((token, index) => (
              <tr key={index}>
                <Td>
                  <TokenSymbol balance={token} />
                </Td>
                <Td>
                  <div className="flex items-center">
                    <span>{token.amount.toString()}</span>
                    {token.isUnknown && <RawBalanceWarning />}
                  </div>
                </Td>
                {showSender && (
                  <Td>
                    {token.senderAddress
                      ? ellipsizeHash(token.senderAddress, 10)
                      : "Public address (Shield Operation)"}
                  </Td>
                )}
                {showRecipient && (
                  <Td>
                    {token.recipientAddress
                      ? ellipsizeHash(token.recipientAddress, 10)
                      : "--"}
                  </Td>
                )}
                <Td>{token.balanceBucket || token.walletSource || "N/A"}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="px-4 py-5 sm:px-6 text-gray-500 italic">
        No tokens {title.toLowerCase()} in this transaction
      </div>
    )}
  </div>
);

const TransactionDetailsScreen: React.FC = () => {
  const { txId } = useParams<{ txId: string }>();
  const { history } = useWalletHistoryContext();
  const { selectedNetwork } = useChainSelectorContext();

  const transaction = history.find((tx) => tx.txid === txId);

  const safeStringify = (obj: any): string => {
    return JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
  };

  const receiveERC20Amounts =
    transaction?.receiveERC20Amounts?.map((token: RailgunERC20Amount) => ({
      ...token,
      ...formatToken(token, selectedNetwork),
    })) ?? [];

  const transferERC20Amounts =
    transaction?.transferERC20Amounts?.map((token: RailgunERC20Amount) => ({
      ...token,
      ...formatToken(token, selectedNetwork),
    })) ?? [];

  return (
    <div className="py-6">
      <TitleHeaderWithShare title="Transaction Details" />
      <div className="bg-white shadow-md rounded-lg p-4 mb-8">
        <div className="mb-4">
          <span className="font-semibold">Transaction ID:</span> {txId}
        </div>
        <div className="mb-4">
          <span className="font-semibold">TxId Version:</span>{" "}
          {transaction?.txidVersion ?? "N/A"}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Block Number:</span>{" "}
          {transaction?.blockNumber ?? "N/A"}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Timestamp:</span>{" "}
          {transaction
            ? new Date(transaction.timestamp * 1000).toLocaleString()
            : "N/A"}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Method:</span>{" "}
          {transaction?.category ?? "N/A"}
        </div>
      </div>

      {receiveERC20Amounts.length > 0 && (
        <TokenTable
          title="Tokens Received"
          tokens={receiveERC20Amounts}
          showSender
        />
      )}

      {transferERC20Amounts.length > 0 && (
        <TokenTable
          title="Tokens Transferred"
          tokens={transferERC20Amounts}
          showRecipient
        />
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-8">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Raw Transaction Data
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            {transaction
              ? safeStringify(transaction)
              : "Transaction data not available"}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsScreen;
