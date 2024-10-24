import React from "react";
import { Transaction } from "./types";
import { Link } from "react-router-dom";

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

const ellipsizeHash = (hash: string, visibleChars: number = 6) => {
  if (hash.length <= visibleChars * 2) return hash;
  return `${hash.slice(0, visibleChars)}...${hash.slice(-visibleChars)}`;
};

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
}) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Transactions
        </h3>
      </div>
      <div className="overflow-x-auto">
        {transactions.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th>Txn Hash</Th>
                <Th>Method</Th>
                <Th>Block</Th>
                <Th>Age</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.hash}>
                  <Td>
                    <Link
                      to={`/transaction/${tx.hash}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {ellipsizeHash(tx.hash)}
                    </Link>
                  </Td>
                  <Td>{tx.method}</Td>
                  <Td>{tx.block}</Td>
                  <Td>{tx.age}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-4 py-5 sm:px-6">
            <p className="text-sm font-medium text-gray-500">
              No transactions found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;
