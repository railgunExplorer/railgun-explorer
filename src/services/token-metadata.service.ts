import { Contract, BrowserProvider } from 'ethers';

const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address owner) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
];

export interface TokenMetadata {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface TokenBalance extends TokenMetadata {
  balance: string;
  balanceFormatted: string;
}

const METADATA_CACHE_KEY = 'token_metadata_cache';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedMetadata {
  metadata: TokenMetadata;
  timestamp: number;
}

/**
 * Get token metadata from cache
 */
const getCachedMetadata = (tokenAddress: string, chainId: number): TokenMetadata | null => {
  try {
    const cacheKey = `${METADATA_CACHE_KEY}_${chainId}`;
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const cache: Record<string, CachedMetadata> = JSON.parse(cached);
    const entry = cache[tokenAddress.toLowerCase()];

    if (!entry) return null;

    // Check if cache is expired
    if (Date.now() - entry.timestamp > CACHE_EXPIRY_MS) {
      return null;
    }

    return entry.metadata;
  } catch (error) {
    console.error('Error reading token metadata cache:', error);
    return null;
  }
};

/**
 * Save token metadata to cache
 */
const cacheMetadata = (tokenAddress: string, chainId: number, metadata: TokenMetadata): void => {
  try {
    const cacheKey = `${METADATA_CACHE_KEY}_${chainId}`;
    const cached = localStorage.getItem(cacheKey);
    const cache: Record<string, CachedMetadata> = cached ? JSON.parse(cached) : {};

    cache[tokenAddress.toLowerCase()] = {
      metadata,
      timestamp: Date.now(),
    };

    localStorage.setItem(cacheKey, JSON.stringify(cache));
  } catch (error) {
    console.error('Error caching token metadata:', error);
  }
};

/**
 * Fetch token metadata from blockchain
 */
export const getTokenMetadata = async (
  tokenAddress: string,
  provider: BrowserProvider,
  chainId: number
): Promise<TokenMetadata> => {
  // Check cache first
  const cached = getCachedMetadata(tokenAddress, chainId);
  if (cached) {
    return cached;
  }

  // Fetch from blockchain
  const contract = new Contract(tokenAddress, ERC20_ABI, provider);

  try {
    const [name, symbol, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
    ]);

    const metadata: TokenMetadata = {
      address: tokenAddress,
      name,
      symbol,
      decimals: Number(decimals),
    };

    // Cache the result
    cacheMetadata(tokenAddress, chainId, metadata);

    return metadata;
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    throw new Error(`Failed to fetch token metadata for ${tokenAddress}`);
  }
};

/**
 * Get token balance for an address
 */
export const getTokenBalance = async (
  tokenAddress: string,
  ownerAddress: string,
  provider: BrowserProvider,
  chainId: number
): Promise<TokenBalance> => {
  const metadata = await getTokenMetadata(tokenAddress, provider, chainId);
  const contract = new Contract(tokenAddress, ERC20_ABI, provider);

  const balance = await contract.balanceOf(ownerAddress);
  const balanceString = balance.toString();

  // Format balance (simple division, can be improved)
  const balanceFormatted = formatTokenAmount(balanceString, metadata.decimals);

  return {
    ...metadata,
    balance: balanceString,
    balanceFormatted,
  };
};

/**
 * Format token amount from wei to human-readable
 */
export const formatTokenAmount = (amount: string, decimals: number): string => {
  try {
    const num = BigInt(amount);
    const divisor = BigInt(Math.pow(10, decimals));
    const whole = num / divisor;
    const remainder = num % divisor;

    const zero = BigInt(0);
    if (remainder === zero) {
      return whole.toString();
    }

    // Get decimal part
    const decimalStr = remainder.toString().padStart(decimals, '0');
    // Trim trailing zeros
    const trimmed = decimalStr.replace(/0+$/, '');

    if (trimmed === '') {
      return whole.toString();
    }

    return `${whole}.${trimmed}`;
  } catch (error) {
    console.error('Error formatting token amount:', error);
    return '0';
  }
};

/**
 * Get native token metadata (ETH, MATIC, etc.)
 */
export const getNativeTokenMetadata = (chainId: number): TokenMetadata => {
  const nativeTokens: Record<number, TokenMetadata> = {
    1: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    5: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Goerli Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    11155111: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    137: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18,
    },
    80001: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Mumbai MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    56: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    42161: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  };

  return (
    nativeTokens[chainId] || {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Native Token',
      symbol: 'NATIVE',
      decimals: 18,
    }
  );
};

/**
 * Common token addresses for popular networks
 */
export const COMMON_TOKENS: Record<number, Array<{ address: string; symbol: string }>> = {
  1: [
    { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC' },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT' },
    { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI' },
    { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC' },
    { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH' },
  ],
  137: [
    { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', symbol: 'USDC' },
    { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', symbol: 'USDT' },
    { address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', symbol: 'DAI' },
    { address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', symbol: 'WMATIC' },
  ],
  56: [
    { address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', symbol: 'USDC' },
    { address: '0x55d398326f99059fF775485246999027B3197955', symbol: 'USDT' },
    { address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', symbol: 'DAI' },
    { address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', symbol: 'WBNB' },
  ],
  42161: [
    { address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', symbol: 'USDC' },
    { address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', symbol: 'USDT' },
    { address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', symbol: 'DAI' },
    { address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', symbol: 'WETH' },
  ],
};

/**
 * Get common tokens for a network
 */
export const getCommonTokens = (chainId: number): Array<{ address: string; symbol: string }> => {
  return COMMON_TOKENS[chainId] || [];
};
