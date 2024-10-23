import React, { useState } from "react";
import { FormattedTokenBalance } from "../../utils/format-tokens";
import Popover from "../Popover/Popover";

interface TokenSymbolProps {
  balance: FormattedTokenBalance;
}

const formatSymbol = (balance: FormattedTokenBalance) => {
  if (balance.symbol) return balance.symbol;
  if (balance.tokenAddress) {
    const start = balance.tokenAddress.slice(0, 6);
    const end = balance.tokenAddress.slice(-4);
    return `${start}...${end}`;
  }
  return "Unknown";
};

const TokenSymbol: React.FC<TokenSymbolProps> = ({ balance }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(balance.tokenAddress || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const trigger = (
    <div
      className="flex items-center cursor-pointer"
      onClick={handleCopyAddress}
    >
      {balance.logoURI ? (
        <img
          src={balance.logoURI}
          alt={balance.symbol}
          className="h-5 w-5 mr-2"
        />
      ) : (
        <svg
          className="h-5 w-5 mr-2 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"
          />
          <circle cx="12" cy="17" r="0.5" fill="currentColor" />
        </svg>
      )}
      {formatSymbol(balance)}
    </div>
  );

  const content = (
    <div className="text-center">
      {copied ? (
        <span className="ml-2 text-green-500 text-sm animate-fade-out">
          Copied!
        </span>
      ) : (
        <p className="text-sm font-medium text-gray-900">
          Copy the contract address
        </p>
      )}
      <p className="mt-1 text-sm text-gray-500">{balance.tokenAddress}</p>
    </div>
  );

  return <Popover trigger={trigger} content={content} />;
};

export default TokenSymbol;
