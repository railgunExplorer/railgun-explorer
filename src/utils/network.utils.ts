import { NetworkName } from '@railgun-community/shared-models';

/**
 * Map Ethereum chainId to Railgun NetworkName
 */
export const chainIdToNetworkName = (chainId: number | null): NetworkName => {
  if (!chainId) return NetworkName.Ethereum;

  const networkMap: Record<number, NetworkName> = {
    // Ethereum
    1: NetworkName.Ethereum,
    11155111: NetworkName.EthereumSepolia,

    // Polygon
    137: NetworkName.Polygon,
    80002: NetworkName.PolygonAmoy, // Amoy is the new testnet for Polygon

    // BSC
    56: NetworkName.BNBChain,

    // Arbitrum
    42161: NetworkName.Arbitrum,

    // Hardhat (for testing)
    31337: NetworkName.Hardhat,
  };

  return networkMap[chainId] || NetworkName.Ethereum;
};

/**
 * Get human-readable network name
 */
export const getNetworkDisplayName = (chainId: number | null): string => {
  if (!chainId) return 'Unknown Network';

  const displayNames: Record<number, string> = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    11155111: 'Sepolia Testnet',
    137: 'Polygon',
    80001: 'Mumbai Testnet',
    56: 'BNB Chain',
    97: 'BNB Testnet',
    42161: 'Arbitrum',
    421613: 'Arbitrum Goerli',
    10: 'Optimism',
    420: 'Optimism Goerli',
    8453: 'Base',
    84531: 'Base Goerli',
    31337: 'Hardhat',
  };

  return displayNames[chainId] || `Chain ID: ${chainId}`;
};

/**
 * Check if network is supported by Railgun
 */
export const isNetworkSupported = (chainId: number | null): boolean => {
  if (!chainId) return false;

  const supportedChainIds = [
    1,      // Ethereum
    11155111, // Sepolia
    137,    // Polygon
    80002,  // Polygon Amoy
    56,     // BSC
    42161,  // Arbitrum
    31337,  // Hardhat
  ];

  return supportedChainIds.includes(chainId);
};

/**
 * Get block explorer URL for the network
 */
export const getBlockExplorerUrl = (chainId: number | null): string => {
  if (!chainId) return 'https://etherscan.io';

  const explorerMap: Record<number, string> = {
    1: 'https://etherscan.io',
    5: 'https://goerli.etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    137: 'https://polygonscan.com',
    80001: 'https://mumbai.polygonscan.com',
    56: 'https://bscscan.com',
    97: 'https://testnet.bscscan.com',
    42161: 'https://arbiscan.io',
    421613: 'https://goerli.arbiscan.io',
    10: 'https://optimistic.etherscan.io',
    420: 'https://goerli-optimism.etherscan.io',
    8453: 'https://basescan.org',
    84531: 'https://goerli.basescan.org',
  };

  return explorerMap[chainId] || 'https://etherscan.io';
};

/**
 * Get transaction URL for block explorer
 */
export const getTxUrl = (chainId: number | null, txHash: string): string => {
  const baseUrl = getBlockExplorerUrl(chainId);
  return `${baseUrl}/tx/${txHash}`;
};

/**
 * Get address URL for block explorer
 */
export const getAddressUrl = (chainId: number | null, address: string): string => {
  const baseUrl = getBlockExplorerUrl(chainId);
  return `${baseUrl}/address/${address}`;
};

/**
 * Get token URL for block explorer
 */
export const getTokenUrl = (chainId: number | null, tokenAddress: string): string => {
  const baseUrl = getBlockExplorerUrl(chainId);
  return `${baseUrl}/token/${tokenAddress}`;
};
