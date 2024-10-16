import React from "react";

interface TokenBalance {
  token: string;
  balance: string;
}

interface TokenBalancesProps {
  balances: TokenBalance[];
}

const TokenBalances: React.FC<TokenBalancesProps> = ({ balances }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Token Balances
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {balances.map((balance, index) => (
            <div
              key={balance.token}
              className={`${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
            >
              <dt className="text-sm font-medium text-gray-500">
                {balance.token}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {balance.balance}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default TokenBalances;
