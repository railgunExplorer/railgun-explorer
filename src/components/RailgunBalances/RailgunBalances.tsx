import React, { useEffect, useState } from 'react';
import { useRailgunWallet } from '../../context/railgun-wallet.context';
import { NetworkName } from '@railgun-community/shared-models';
import { formatUnits } from 'ethers';

interface TokenBalance {
  tokenAddress: string;
  amount: string;
  symbol?: string;
  decimals: number;
}

interface RailgunBalancesProps {
  network: NetworkName;
}

export const RailgunBalances: React.FC<RailgunBalancesProps> = ({ network }) => {
  const { balances, isLoadingBalances, refreshWalletBalances, railgunWallet } = useRailgunWallet();
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);

  useEffect(() => {
    if (railgunWallet) {
      refreshWalletBalances(network);
    }
  }, [railgunWallet, network]);

  useEffect(() => {
    if (balances && balances.erc20Amounts) {
      const tokens: TokenBalance[] = balances.erc20Amounts.map((tokenAmount) => {
        return {
          tokenAddress: tokenAmount.tokenAddress,
          amount: tokenAmount.amount.toString(),
          decimals: 18, // Default, should be fetched from contract or metadata service
        };
      });
      setTokenBalances(tokens);
    }
  }, [balances]);

  const formatBalance = (amount: string, decimals: number): string => {
    try {
      const formatted = formatUnits(amount, decimals);
      const num = parseFloat(formatted);
      if (num === 0) return '0';
      if (num < 0.0001) return '< 0.0001';
      return num.toFixed(4);
    } catch {
      return '0';
    }
  };

  const getTokenSymbol = (tokenAddress: string): string => {
    // This should be enhanced with actual token data fetching
    if (tokenAddress === '0x0000000000000000000000000000000000000000') {
      return 'ETH';
    }
    return tokenAddress.slice(0, 6) + '...' + tokenAddress.slice(-4);
  };

  if (!railgunWallet) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          Please activate your Railgun wallet to view balances
        </p>
      </div>
    );
  }

  if (isLoadingBalances) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="ml-3 text-gray-600">Loading balances...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Private Balances</h3>
        <button
          onClick={() => refreshWalletBalances(network)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          disabled={isLoadingBalances}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {tokenBalances.length === 0 ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-sm">No private balances found</p>
          <p className="text-gray-500 text-xs mt-1">
            Shield tokens to get started
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tokenBalances.map((token) => (
            <div
              key={token.tokenAddress}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {getTokenSymbol(token.tokenAddress).charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {getTokenSymbol(token.tokenAddress)}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    {token.tokenAddress.slice(0, 10)}...{token.tokenAddress.slice(-8)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatBalance(token.amount, token.decimals)}
                </p>
                <p className="text-xs text-gray-500">
                  {token.symbol || 'TOKEN'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
