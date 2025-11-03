import React, { useEffect, useState } from 'react';
import { useMetamaskWallet } from '../../context/metamask-wallet.context';
import { formatUnits } from 'ethers';
import { getTokenBalance, getCommonTokens, getNativeTokenMetadata } from '../../services/token-metadata.service';

interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceFormatted: string;
}

export const PublicBalances: React.FC = () => {
  const { provider, account, chainId } = useMetamaskWallet();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTokens, setExpandedTokens] = useState(false);

  const loadBalances = async () => {
    if (!provider || !account || !chainId) return;

    setIsLoading(true);
    try {
      const balancesList: TokenBalance[] = [];

      // 1. Get native token balance (ETH, MATIC, etc.)
      const nativeToken = getNativeTokenMetadata(chainId);
      const nativeBalance = await provider.getBalance(account);
      const nativeBalanceFormatted = formatUnits(nativeBalance, nativeToken.decimals);

      balancesList.push({
        address: nativeToken.address,
        symbol: nativeToken.symbol,
        name: nativeToken.name,
        decimals: nativeToken.decimals,
        balance: nativeBalance.toString(),
        balanceFormatted: nativeBalanceFormatted,
      });

      // 2. Get common ERC20 tokens for this network
      if (expandedTokens) {
        const commonTokens = getCommonTokens(chainId);

        for (const token of commonTokens) {
          try {
            const tokenBalance = await getTokenBalance(token.address, account, provider, chainId);

            // Only add if balance > 0
            if (BigInt(tokenBalance.balance) > BigInt(0)) {
              balancesList.push({
                address: tokenBalance.address,
                symbol: tokenBalance.symbol,
                name: tokenBalance.name,
                decimals: tokenBalance.decimals,
                balance: tokenBalance.balance,
                balanceFormatted: tokenBalance.balanceFormatted,
              });
            }
          } catch (error) {
            console.error(`Error loading balance for ${token.symbol}:`, error);
          }
        }
      }

      setBalances(balancesList);
    } catch (error) {
      console.error('Error loading balances:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBalances();
  }, [account, chainId, expandedTokens]);

  const formatBalance = (balance: string): string => {
    const num = parseFloat(balance);
    if (num === 0) return '0';
    if (num < 0.0001) return '< 0.0001';
    if (num < 1) return num.toFixed(6);
    if (num < 1000) return num.toFixed(4);
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  if (!account) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Public Balances</h3>
        <button
          onClick={loadBalances}
          disabled={isLoading}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center disabled:opacity-50"
        >
          <svg
            className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`}
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

      {isLoading && balances.length === 0 ? (
        <div className="flex items-center justify-center py-8">
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
      ) : (
        <>
          <div className="space-y-2">
            {balances.map((token) => (
              <div
                key={token.address}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {token.symbol.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{token.symbol}</p>
                    <p className="text-xs text-gray-500">{token.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">
                    {formatBalance(token.balanceFormatted)}
                  </p>
                  <p className="text-xs text-gray-500">{token.symbol}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Show/Hide ERC20 Tokens Button */}
          <button
            onClick={() => setExpandedTokens(!expandedTokens)}
            className="w-full mt-4 py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
          >
            {expandedTokens ? (
              <>
                <svg className="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Hide ERC20 Tokens
              </>
            ) : (
              <>
                <svg className="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Show Common ERC20 Tokens
              </>
            )}
          </button>

          {/* Info Box */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <span className="font-medium">Public Balance:</span> Visible on blockchain. Use Shield to move tokens to private balance.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
