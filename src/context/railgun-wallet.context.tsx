import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { RailgunWalletInfo, RailgunBalancesEvent, NetworkName, NETWORK_CONFIG, FallbackProviderJsonConfig } from '@railgun-community/shared-models';
import { getOrCreateRailgunWallet, hasStoredWallet, clearStoredWalletInfo } from '../services/railgun-wallet.service';
import { useMetamaskWallet } from './metamask-wallet.context';
import { setOnBalanceUpdateCallback, refreshBalances, loadProvider } from '@railgun-community/wallet';
import { chainIdToNetworkName } from '../utils/network.utils';

interface RailgunWalletContextType {
  railgunWallet: RailgunWalletInfo | null;
  isLoadingWallet: boolean;
  walletError: string | null;
  balances: RailgunBalancesEvent | null;
  isLoadingBalances: boolean;
  hasExistingWallet: boolean;
  activateWallet: () => Promise<void>;
  deactivateWallet: () => void;
  refreshWalletBalances: (network: NetworkName) => Promise<void>;
}

const RailgunWalletContext = createContext<RailgunWalletContextType | undefined>(undefined);

interface RailgunWalletProviderProps {
  children: ReactNode;
}

export const RailgunWalletProvider: React.FC<RailgunWalletProviderProps> = ({ children }) => {
  const { account, provider, isEngineInitialized, initializeEngineIfNeeded, chainId } = useMetamaskWallet();

  const [railgunWallet, setRailgunWallet] = useState<RailgunWalletInfo | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [balances, setBalances] = useState<RailgunBalancesEvent | null>(null);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [hasExistingWallet, setHasExistingWallet] = useState(false);
  const [loadedNetworks, setLoadedNetworks] = useState<Set<NetworkName>>(new Set());

  // Check if wallet exists when account changes
  useEffect(() => {
    if (account) {
      const exists = hasStoredWallet(account);
      setHasExistingWallet(exists);
    } else {
      setHasExistingWallet(false);
      setRailgunWallet(null);
      setBalances(null);
    }
  }, [account]);

  // Setup balance update callback
  useEffect(() => {
    if (railgunWallet && isEngineInitialized) {
      setOnBalanceUpdateCallback(async (balanceUpdate: RailgunBalancesEvent) => {
        console.log('Balance update received:', balanceUpdate);
        setBalances(balanceUpdate);
      });
    }
  }, [railgunWallet, isEngineInitialized]);

  /**
   * Get RPC URLs for a network
   */
  const getRPCUrlsForNetwork = (networkName: NetworkName): string[] => {
    const rpcUrls: Record<NetworkName, string[]> = {
      [NetworkName.Ethereum]: [
        'https://eth.llamarpc.com',
        'https://rpc.ankr.com/eth',
        'https://cloudflare-eth.com',
      ],
      [NetworkName.EthereumSepolia]: [
        'https://rpc.sepolia.org',
        'https://rpc2.sepolia.org',
      ],
      [NetworkName.Polygon]: [
        'https://polygon-rpc.com',
        'https://rpc.ankr.com/polygon',
      ],
      [NetworkName.PolygonAmoy]: [
        'https://rpc-amoy.polygon.technology',
      ],
      [NetworkName.BNBChain]: [
        'https://bsc-dataseed1.binance.org',
        'https://bsc-dataseed2.binance.org',
      ],
      [NetworkName.Arbitrum]: [
        'https://arb1.arbitrum.io/rpc',
        'https://rpc.ankr.com/arbitrum',
      ],
      [NetworkName.Hardhat]: ['http://localhost:8545'],
    } as Record<NetworkName, string[]>;

    return rpcUrls[networkName] || [];
  };

  /**
   * Load Railgun provider for a network
   */
  const loadNetworkProvider = useCallback(async (networkName: NetworkName) => {
    // Check if already loaded using a ref to avoid stale closure
    setLoadedNetworks(prev => {
      if (prev.has(networkName)) {
        console.log(`Provider already loaded for ${networkName}`);
        return prev;
      }
      return prev;
    });

    try {
      console.log(`Loading Railgun provider for ${networkName}...`);

      const rpcUrls = getRPCUrlsForNetwork(networkName);
      if (rpcUrls.length === 0) {
        throw new Error(`No RPC URLs configured for ${networkName}`);
      }

      // Get the correct chainId for the network
      const networkConfig = NETWORK_CONFIG[networkName];
      if (!networkConfig) {
        throw new Error(`Network config not found for ${networkName}`);
      }

      // Create fallback provider config with public RPC URLs
      const fallbackProviderConfig: FallbackProviderJsonConfig = {
        chainId: networkConfig.chain.id,
        providers: rpcUrls.map((url, index) => ({
          provider: url,
          priority: index + 1,
          weight: 1,
        })),
      };

      console.log('Loading provider with config:', fallbackProviderConfig);
      const result = await loadProvider(fallbackProviderConfig, networkName, 15000);
      console.log('Provider load result:', result);

      setLoadedNetworks(prev => {
        const newSet = new Set(prev);
        newSet.add(networkName);
        return newSet;
      });
      console.log(`✅ Provider loaded successfully for ${networkName}`);
    } catch (error: any) {
      console.error(`❌ Error loading provider for ${networkName}:`, error);
      console.error('Error details:', error.message, error.stack);
      // Don't throw - continue anyway and see what happens
    }
  }, []);  // ✅ Keine Dependencies mehr!

  /**
   * Activate Railgun wallet by requesting signature from MetaMask
   */
  const activateWallet = useCallback(async () => {
    if (!account || !provider) {
      setWalletError('Please connect your MetaMask wallet first');
      return;
    }

    setIsLoadingWallet(true);
    setWalletError(null);

    try {
      // Initialize engine if needed
      if (!isEngineInitialized) {
        await initializeEngineIfNeeded();
      }

      // Load provider for current network
      if (chainId) {
        const networkName = chainIdToNetworkName(chainId);
        await loadNetworkProvider(networkName);
      }

      // Get or create Railgun wallet from MetaMask signature
      const wallet = await getOrCreateRailgunWallet(provider, account);
      setRailgunWallet(wallet);

      console.log('Railgun wallet activated:', wallet.railgunAddress);
    } catch (error: any) {
      console.error('Error activating Railgun wallet:', error);

      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        setWalletError('Signature request was rejected. Please sign the message to access your Railgun wallet.');
      } else {
        setWalletError(error.message || 'Failed to activate Railgun wallet');
      }
    } finally {
      setIsLoadingWallet(false);
    }
  }, [account, provider, isEngineInitialized, initializeEngineIfNeeded, chainId, loadNetworkProvider]);

  /**
   * Deactivate Railgun wallet (clear from memory, keep in storage)
   */
  const deactivateWallet = useCallback(() => {
    setRailgunWallet(null);
    setBalances(null);
    setWalletError(null);
  }, []);

  /**
   * Refresh balances for the current network
   */
  const refreshWalletBalances = useCallback(async (network: NetworkName) => {
    if (!railgunWallet) {
      console.warn('Cannot refresh balances: No wallet active');
      return;
    }

    if (!isEngineInitialized) {
      console.warn('Cannot refresh balances: Engine not initialized');
      return;
    }

    setIsLoadingBalances(true);
    try {
      const { chain } = NETWORK_CONFIG[network];
      await refreshBalances(chain, [railgunWallet.id]);
      console.log('Balances refreshed for network:', network);
    } catch (error) {
      console.error('Error refreshing balances:', error);
      setWalletError('Failed to refresh balances');
    } finally {
      setIsLoadingBalances(false);
    }
  }, [railgunWallet, isEngineInitialized]);

  const value: RailgunWalletContextType = {
    railgunWallet,
    isLoadingWallet,
    walletError,
    balances,
    isLoadingBalances,
    hasExistingWallet,
    activateWallet,
    deactivateWallet,
    refreshWalletBalances,
  };

  return (
    <RailgunWalletContext.Provider value={value}>
      {children}
    </RailgunWalletContext.Provider>
  );
};

export const useRailgunWallet = (): RailgunWalletContextType => {
  const context = useContext(RailgunWalletContext);
  if (context === undefined) {
    throw new Error('useRailgunWallet must be used within a RailgunWalletProvider');
  }
  return context;
};
