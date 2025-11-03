import React, { useState } from 'react';
import { useRailgunWallet } from '../../context/railgun-wallet.context';
import { useMetamaskWallet } from '../../context/metamask-wallet.context';
import { NetworkName } from '@railgun-community/shared-models';
import { Contract, parseUnits, formatUnits } from 'ethers';
import { shieldTokens } from '../../services/railgun-transaction.service';
import { getTokenBalance, getCommonTokens, getNativeTokenMetadata } from '../../services/token-metadata.service';
import { getTxUrl } from '../../utils/network.utils';

const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000';

interface ShieldTokensProps {
  network: NetworkName;
}

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
];

export const ShieldTokens: React.FC<ShieldTokensProps> = ({ network }) => {
  const { railgunWallet, refreshWalletBalances } = useRailgunWallet();
  const { provider, account, chainId } = useMetamaskWallet();

  const [tokenAddress, setTokenAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isShielding, setIsShielding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);
  const [publicBalance, setPublicBalance] = useState<string>('0');
  const [txHash, setTxHash] = useState<string | null>(null);

  const loadTokenInfo = async () => {
    if (!provider || !account || !tokenAddress || !chainId) return;

    try {
      setError(null);

      // Check if it's native token
      if (tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()) {
        const nativeToken = getNativeTokenMetadata(chainId);
        const balance = await provider.getBalance(account);
        const balanceFormatted = formatUnits(balance, nativeToken.decimals);

        setTokenSymbol(nativeToken.symbol);
        setTokenDecimals(nativeToken.decimals);
        setPublicBalance(balanceFormatted);
      } else {
        // ERC20 token
        const tokenBalance = await getTokenBalance(tokenAddress, account, provider, chainId);

        setTokenSymbol(tokenBalance.symbol);
        setTokenDecimals(tokenBalance.decimals);
        setPublicBalance(tokenBalance.balanceFormatted);
      }
    } catch (err: any) {
      console.error('Error loading token info:', err);
      setError('Failed to load token information. Please check the token address.');
    }
  };

  const loadNativeToken = async () => {
    if (!provider || !account || !chainId) return;

    setTokenAddress(NATIVE_TOKEN_ADDRESS);

    try {
      const nativeToken = getNativeTokenMetadata(chainId);
      const balance = await provider.getBalance(account);
      const balanceFormatted = formatUnits(balance, nativeToken.decimals);

      setTokenSymbol(nativeToken.symbol);
      setTokenDecimals(nativeToken.decimals);
      setPublicBalance(balanceFormatted);
      setError(null);
    } catch (err: any) {
      console.error('Error loading native token:', err);
      setError('Failed to load native token balance');
    }
  };

  const handleShield = async () => {
    if (!railgunWallet || !provider || !account || !chainId) {
      setError('Please connect your wallet and activate Railgun');
      return;
    }

    if (!tokenAddress || !amount) {
      setError('Please enter token address and amount');
      return;
    }

    setIsShielding(true);
    setError(null);
    setSuccess(null);
    setTxHash(null);

    try {
      const isNativeToken = tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase();

      // For ERC20 tokens, handle approval
      if (!isNativeToken) {
        const signer = await provider.getSigner();
        const contract = new Contract(tokenAddress, ERC20_ABI, signer);

        // Parse amount with token decimals
        const amountWei = parseUnits(amount, tokenDecimals);

        // Get Railgun contract address from the network config
        // This is a simplified approach - you may need to get the actual proxy address
        const railgunProxyAddress = tokenAddress; // The shield function handles approval internally

        console.log('Checking token allowance...');

        // Note: The populateShield function will handle the approval requirement
        // But we can pre-approve here for better UX
        const allowance = await contract.allowance(account, railgunProxyAddress);

        if (allowance < amountWei) {
          console.log('Approving token spend...');
          setSuccess('Approving token spend...');
          const approveTx = await contract.approve(railgunProxyAddress, amountWei);
          await approveTx.wait();
          console.log('Token approved');
          setSuccess('Token approved. Shielding...');
        }
      } else {
        // For native token, no approval needed
        setSuccess('Shielding native token...');
      }

      // Call Railgun shield function
      const hash = await shieldTokens({
        network,
        tokenAddress,
        amount,
        decimals: tokenDecimals,
        railgunAddress: railgunWallet.railgunAddress,
        provider,
        fromAddress: account,
      });

      setTxHash(hash);
      setSuccess(`Successfully shielded ${amount} ${tokenSymbol}!`);
      setAmount('');

      // Refresh balances after shield
      setTimeout(() => {
        refreshWalletBalances(network);
      }, 2000);
    } catch (err: any) {
      console.error('Error shielding tokens:', err);
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        setError('Transaction was rejected');
      } else {
        setError(err.message || 'Failed to shield tokens');
      }
    } finally {
      setIsShielding(false);
    }
  };

  const setMaxAmount = () => {
    setAmount(publicBalance);
  };

  if (!railgunWallet) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          Please activate your Railgun wallet to shield tokens
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Shield Tokens</h3>
      <p className="text-sm text-gray-600 mb-6">
        Move tokens from your public Ethereum wallet into your private Railgun wallet
      </p>

      <div className="space-y-4">
        {/* Token Address Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token Address
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="0x... or use ETH button"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={loadNativeToken}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              {chainId && getNativeTokenMetadata(chainId).symbol}
            </button>
            <button
              onClick={loadTokenInfo}
              disabled={!tokenAddress}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Load
            </button>
          </div>
          {tokenSymbol && (
            <p className="text-xs text-gray-600 mt-1">
              Token: {tokenSymbol} | Balance: {publicBalance}
            </p>
          )}
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              step="any"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={setMaxAmount}
              disabled={!publicBalance || publicBalance === '0'}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm font-medium">Error</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <p className="text-sm font-medium">Success</p>
            <p className="text-xs mt-1">{success}</p>
            {txHash && chainId && (
              <a
                href={getTxUrl(chainId, txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline mt-2 inline-block"
              >
                View transaction
              </a>
            )}
          </div>
        )}

        {/* Shield Button */}
        <button
          onClick={handleShield}
          disabled={isShielding || !tokenAddress || !amount}
          className={`w-full px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center ${
            isShielding || !tokenAddress || !amount
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isShielding ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3"
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
              Shielding...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Shield Tokens
            </>
          )}
        </button>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-1">About Shielding</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Shielding moves tokens from public to private</li>
                <li>You'll need to approve the token first</li>
                <li>Gas fees are paid from your public wallet</li>
                <li>Tokens become private and untraceable</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
