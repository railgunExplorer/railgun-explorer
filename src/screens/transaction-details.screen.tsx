import React from "react";
import { useParams } from "react-router-dom";
import { useWalletHistoryContext } from "../context/wallet-history.context";

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
                <Td>{ellipsizeHash(token.tokenAddress)}</Td>
                <Td>{token.amount.toString()}</Td>
                {showSender && (
                  <Td>{ellipsizeHash(token.senderAddress, 10)}</Td>
                )}
                {showRecipient && (
                  <Td>{ellipsizeHash(token.recipientAddress, 10)}</Td>
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

  const transaction = history.find((tx) => tx.txid === txId);

  const safeStringify = (obj: any): string => {
    return JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Transaction Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
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

      <TokenTable
        title="Tokens Received"
        tokens={transaction?.receiveERC20Amounts ?? []}
        showSender
      />

      <TokenTable
        title="Tokens Transferred"
        tokens={transaction?.transferERC20Amounts ?? []}
        showRecipient
      />

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
