import React from "react";
import { FormattedTokenBalance } from "../../utils/format-tokens";
import TokenSymbol from "../TokenSymbol/TokenSymbol";
import RawBalanceWarning from "../RawBalanceWarning/RawBalanceWarning";

interface TokenBalancesProps {
  title: string;
  balances: FormattedTokenBalance[];
}

const TokenBalancesERC20: React.FC<TokenBalancesProps> = ({
  title,
  balances,
}) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {balances.length > 0 ? (
            balances.map((balance, index) => (
              <div
                key={balance.tokenAddress + index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
              >
                <dt className="text-sm font-medium text-gray-500">
                  <TokenSymbol balance={balance} />
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  {balance.amount}
                  {balance.isUnknown && <RawBalanceWarning />}
                </dd>
              </div>
            ))
          ) : (
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                No token balances found.
              </dt>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

export default TokenBalancesERC20;
