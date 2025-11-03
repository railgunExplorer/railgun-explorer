import React, { useState } from 'react';
import { useMetamaskWallet } from '../context/metamask-wallet.context';
import { useRailgunWallet } from '../context/railgun-wallet.context';
import { useNavigate } from 'react-router-dom';
import { RailgunBalances } from '../components/RailgunBalances/RailgunBalances';
import { ShieldTokens } from '../components/ShieldTokens/ShieldTokens';
import { SendTokens } from '../components/SendTokens/SendTokens';
import { PublicBalances } from '../components/PublicBalances/PublicBalances';
import { NetworkName } from '@railgun-community/shared-models';
import { chainIdToNetworkName, isNetworkSupported } from '../utils/network.utils';

const MyWalletScreen: React.FC = () => {
  const { account, chainId, connect } = useMetamaskWallet();
  const { railgunWallet, isLoadingWallet, walletError, activateWallet, hasExistingWallet } = useRailgunWallet();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [copiedRailgun, setCopiedRailgun] = useState(false);
  const [activeTab, setActiveTab] = useState<'balances' | 'shield' | 'send'>('balances');

  // Map chainId to Railgun NetworkName
  const currentNetwork: NetworkName = chainIdToNetworkName(chainId);
  const networkSupported = isNetworkSupported(chainId);

  const copyToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyRailgunAddress = () => {
    if (railgunWallet?.railgunAddress) {
      navigator.clipboard.writeText(railgunWallet.railgunAddress);
      setCopiedRailgun(true);
      setTimeout(() => setCopiedRailgun(false), 2000);
    }
  };

  const getChainName = (chainId: number | null): string => {
    if (!chainId) return 'Unknown';

    const chainNames: Record<number, string> = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      11155111: 'Sepolia Testnet',
      137: 'Polygon Mainnet',
      80001: 'Mumbai Testnet',
      56: 'BNB Smart Chain',
      97: 'BNB Testnet',
      42161: 'Arbitrum One',
      421613: 'Arbitrum Goerli',
      10: 'Optimism',
      420: 'Optimism Goerli',
      8453: 'Base',
      84531: 'Base Goerli',
    };

    return chainNames[chainId] || `Chain ID: ${chainId}`;
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Wallet Not Connected
          </h1>
          <p className="text-gray-600 mb-6">
            Please connect your Metamask wallet to view your wallet information.
          </p>
          <button
            onClick={connect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Connect Wallet
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center mb-4"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </button>
          <h1 className="text-4xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-gray-600 mt-2">View your wallet information</p>
        </div>

        {/* Public Balances Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <PublicBalances />
        </div>

        {/* Wallet Address Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Wallet Address
            </h2>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm text-green-600 font-medium">
                Connected
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-4">
            <div className="flex items-center justify-between">
              <code className="text-lg font-mono text-gray-900 break-all">
                {account}
              </code>
              <button
                onClick={copyToClipboard}
                className="ml-4 flex-shrink-0 p-2 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-200 border border-gray-200"
                title="Copy to clipboard"
              >
                {copied ? (
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 mt-2 font-medium">
                Copied to clipboard!
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Network</p>
              <p className="text-lg font-semibold text-gray-900">
                {getChainName(chainId)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Chain ID</p>
              <p className="text-lg font-semibold text-gray-900">
                {chainId || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Network Warning */}
        {!networkSupported && chainId && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-yellow-600 mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-yellow-900 mb-1">
                  Unsupported Network
                </h3>
                <p className="text-sm text-yellow-800">
                  The current network is not supported by Railgun. Please switch to Ethereum, Polygon, BSC, or Arbitrum.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Railgun Address Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Railgun Wallet
            </h2>
            {railgunWallet && (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm text-purple-600 font-medium">
                  Active
                </span>
              </div>
            )}
          </div>

          {!railgunWallet ? (
            <div>
              <p className="text-gray-600 mb-4">
                {hasExistingWallet
                  ? 'Activate your existing Railgun wallet by signing with MetaMask.'
                  : 'Create your Railgun wallet from your Ethereum wallet. You\'ll need to sign a message to create a deterministic Railgun identity.'}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
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
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">How it works:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Sign a message with your MetaMask wallet</li>
                      <li>Your signature derives your Railgun identity</li>
                      <li>No private keys leave your browser</li>
                      <li>Same MetaMask = Same Railgun address (always)</li>
                    </ul>
                  </div>
                </div>
              </div>
              <button
                onClick={activateWallet}
                disabled={isLoadingWallet || !networkSupported}
                className={`w-full px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  isLoadingWallet || !networkSupported
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                } text-white flex items-center justify-center`}
              >
                {isLoadingWallet ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {hasExistingWallet ? 'Activating...' : 'Creating...'}
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
                    {hasExistingWallet ? 'Activate Railgun Wallet' : 'Create Railgun Wallet'}
                  </>
                )}
              </button>
              {walletError && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p className="text-sm font-medium">Error</p>
                  <p className="text-xs mt-1">{walletError}</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-4">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-gray-900 break-all">
                    {railgunWallet.railgunAddress}
                  </code>
                  <button
                    onClick={copyRailgunAddress}
                    className="ml-4 flex-shrink-0 p-2 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-200 border border-gray-200"
                    title="Copy to clipboard"
                  >
                    {copiedRailgun ? (
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {copiedRailgun && (
                  <p className="text-sm text-green-600 mt-2 font-medium">
                    Copied to clipboard!
                  </p>
                )}
              </div>

              {/* Tabs for Balances, Shield, and Send */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab('balances')}
                    className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'balances'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Balances
                  </button>
                  <button
                    onClick={() => setActiveTab('shield')}
                    className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'shield'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Shield
                  </button>
                  <button
                    onClick={() => setActiveTab('send')}
                    className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'send'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Send
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'balances' && <RailgunBalances network={currentNetwork} />}
              {activeTab === 'shield' && <ShieldTokens network={currentNetwork} />}
              {activeTab === 'send' && <SendTokens network={currentNetwork} />}
            </div>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={`https://etherscan.io/address/${account}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 group"
            >
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-blue-600 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="font-medium text-gray-900">
                  View on Etherscan
                </span>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>

            <button
              onClick={() => navigate(`/search-result?address=${account}`)}
              className="flex items-center justify-between p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-200 group"
            >
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-indigo-600 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="font-medium text-gray-900">
                  View Railgun Activity
                </span>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyWalletScreen;
