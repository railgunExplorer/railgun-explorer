import React, { useState } from 'react';
import { useRailgunWallet } from '../../context/railgun-wallet.context';
import { useMetamaskWallet } from '../../context/metamask-wallet.context';
import { NetworkName } from '@railgun-community/shared-models';
import { unshieldTokens, transferTokensPrivately } from '../../services/railgun-transaction.service';
import { getTokenMetadata } from '../../services/token-metadata.service';
import { getTxUrl } from '../../utils/network.utils';

interface SendTokensProps {
  network: NetworkName;
}

type TransactionType = 'transfer' | 'unshield';

export const SendTokens: React.FC<SendTokensProps> = ({ network }) => {
  const { railgunWallet, refreshWalletBalances } = useRailgunWallet();
  const { provider, account, chainId } = useMetamaskWallet();

  const [transactionType, setTransactionType] = useState<TransactionType>('transfer');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);

  // Load token metadata
  const loadTokenMetadata = async () => {
    if (!provider || !tokenAddress || !chainId) return;

    try {
      const metadata = await getTokenMetadata(tokenAddress, provider, chainId);
      setTokenSymbol(metadata.symbol);
      setTokenDecimals(metadata.decimals);
    } catch (err) {
      console.error('Error loading token metadata:', err);
    }
  };

  const handleSend = async () => {
    if (!railgunWallet || !provider || !account || !chainId) {
      setError('Please connect your wallet and activate Railgun');
      return;
    }

    if (!recipientAddress || !tokenAddress || !amount) {
      setError('Please fill in all fields');
      return;
    }

    if (!isValidAddress(recipientAddress)) {
      setError('Invalid recipient address');
      return;
    }

    setIsSending(true);
    setError(null);
    setSuccess(null);
    setTxHash(null);

    try {
      // Load token metadata if not already loaded
      if (!tokenSymbol) {
        await loadTokenMetadata();
      }

      let hash: string;

      if (transactionType === 'transfer') {
        // Private to Private transfer
        console.log('Initiating private transfer...');
        setSuccess('Generating proof for private transfer...');

        hash = await transferTokensPrivately({
          network,
          railgunWalletId: railgunWallet.id,
          tokenAddress,
          amount,
          decimals: tokenDecimals,
          toRailgunAddress: recipientAddress,
          provider,
          fromAddress: account,
        });

        setSuccess(`Successfully transferred ${amount} ${tokenSymbol || 'tokens'} privately`);
      } else {
        // Unshield (Private to Public)
        console.log('Initiating unshield...');
        setSuccess('Generating proof for unshield...');

        hash = await unshieldTokens({
          network,
          railgunWalletId: railgunWallet.id,
          tokenAddress,
          amount,
          decimals: tokenDecimals,
          toAddress: recipientAddress,
          provider,
          fromAddress: account,
        });

        setSuccess(`Successfully unshielded ${amount} ${tokenSymbol || 'tokens'}`);
      }

      setTxHash(hash);

      // Clear form
      setRecipientAddress('');
      setAmount('');

      // Refresh balances after a delay
      setTimeout(() => {
        refreshWalletBalances(network);
      }, 2000);
    } catch (err: any) {
      console.error('Error sending tokens:', err);
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        setError('Transaction was rejected');
      } else {
        setError(err.message || 'Failed to send tokens');
      }
    } finally {
      setIsSending(false);
    }
  };

  const isValidAddress = (address: string): boolean => {
    if (transactionType === 'transfer') {
      // Railgun address starts with "0zk"
      return address.startsWith('0zk') && address.length > 10;
    } else {
      // Ethereum address
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    }
  };

  if (!railgunWallet) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          Please activate your Railgun wallet to send tokens
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Tokens</h3>

      {/* Transaction Type Selector */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setTransactionType('transfer')}
            className={`py-2 px-4 rounded-md font-medium transition-colors ${
              transactionType === 'transfer'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Private Transfer
          </button>
          <button
            onClick={() => setTransactionType('unshield')}
            className={`py-2 px-4 rounded-md font-medium transition-colors ${
              transactionType === 'unshield'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Unshield
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {transactionType === 'transfer'
            ? 'Send tokens privately to another Railgun address'
            : 'Send tokens from private to public (unshield to Ethereum address)'}
        </p>
      </div>

      <div className="space-y-4">
        {/* Recipient Address Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {transactionType === 'transfer' ? 'Recipient Railgun Address' : 'Recipient Ethereum Address'}
          </label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder={transactionType === 'transfer' ? '0zk...' : '0x...'}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {recipientAddress && !isValidAddress(recipientAddress) && (
            <p className="text-xs text-red-600 mt-1">Invalid address format</p>
          )}
        </div>

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
              placeholder="0x..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={loadTokenMetadata}
              disabled={!tokenAddress}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Load
            </button>
          </div>
          {tokenSymbol && (
            <p className="text-xs text-gray-600 mt-1">
              Token: {tokenSymbol} ({tokenDecimals} decimals)
            </p>
          )}
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            step="any"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={isSending || !recipientAddress || !tokenAddress || !amount || !isValidAddress(recipientAddress)}
          className={`w-full px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center ${
            isSending || !recipientAddress || !tokenAddress || !amount || !isValidAddress(recipientAddress)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          } text-white`}
        >
          {isSending ? (
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
              {transactionType === 'transfer' ? 'Transferring...' : 'Unshielding...'}
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              {transactionType === 'transfer' ? 'Send Privately' : 'Unshield'}
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
              <p className="font-medium mb-1">
                {transactionType === 'transfer' ? 'About Private Transfers' : 'About Unshielding'}
              </p>
              <ul className="list-disc list-inside space-y-1">
                {transactionType === 'transfer' ? (
                  <>
                    <li>Fully private and untraceable</li>
                    <li>Recipient must have a Railgun address</li>
                    <li>Proof generation may take a few seconds</li>
                    <li>Gas is paid from your public wallet</li>
                  </>
                ) : (
                  <>
                    <li>Moves tokens from private to public</li>
                    <li>Recipient receives tokens in their public wallet</li>
                    <li>Transaction is visible on-chain</li>
                    <li>Gas is paid from your public wallet</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
