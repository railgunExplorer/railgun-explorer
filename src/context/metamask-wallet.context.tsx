import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider } from 'ethers';
import { initializeEngine } from '../services/railgun-web';
import { useAppConfigurations } from './app-configurations.context';

interface MetamaskWalletContextType {
  account: string | null;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  provider: BrowserProvider | null;
  isEngineInitialized: boolean;
  isEngineInitializing: boolean;
  initializeEngineIfNeeded: () => Promise<void>;
}

const MetamaskWalletContext = createContext<MetamaskWalletContextType | undefined>(undefined);

interface MetamaskWalletProviderProps {
  children: ReactNode;
}

export const MetamaskWalletProvider: React.FC<MetamaskWalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [isEngineInitialized, setIsEngineInitialized] = useState(false);
  const [isEngineInitializing, setIsEngineInitializing] = useState(false);

  const appConfigurations = useAppConfigurations();

  // Function to initialize engine on-demand
  const initializeEngineIfNeeded = async () => {
    if (isEngineInitialized || isEngineInitializing) {
      return;
    }

    console.log('appConfigurations:', appConfigurations);
    console.log('publicPoiAggregatorUrls:', appConfigurations?.publicPoiAggregatorUrls);

    if (!appConfigurations?.publicPoiAggregatorUrls || appConfigurations.publicPoiAggregatorUrls.length === 0) {
      console.error('POI node URLs check failed:', {
        hasAppConfigurations: !!appConfigurations,
        hasPublicPoiAggregatorUrls: !!appConfigurations?.publicPoiAggregatorUrls,
        length: appConfigurations?.publicPoiAggregatorUrls?.length,
      });
      throw new Error('POI node URLs not available');
    }

    setIsEngineInitializing(true);
    try {
      await initializeEngine({
        poiNodeURLs: appConfigurations.publicPoiAggregatorUrls,
      });
      setIsEngineInitialized(true);
      console.log('Railgun Engine initialized successfully');
    } catch (err) {
      console.error('Error initializing Railgun Engine:', err);
      throw err;
    } finally {
      setIsEngineInitializing(false);
    }
  };

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const browserProvider = new BrowserProvider(window.ethereum);
          const accounts = await browserProvider.listAccounts();

          if (accounts.length > 0) {
            const network = await browserProvider.getNetwork();
            setAccount(accounts[0].address);
            setChainId(Number(network.chainId));
            setProvider(browserProvider);
          }
        } catch (err) {
          console.error('Error checking connection:', err);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect();
        } else {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = (chainIdHex: string) => {
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);
        // Reload the page as recommended by Metamask
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('Metamask is not installed. Please install Metamask to continue.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const browserProvider = new BrowserProvider(window.ethereum);

      // Request account access
      const accounts = await browserProvider.send('eth_requestAccounts', []);

      if (accounts.length > 0) {
        const network = await browserProvider.getNetwork();
        setAccount(accounts[0]);
        setChainId(Number(network.chainId));
        setProvider(browserProvider);
      }
    } catch (err: any) {
      console.error('Error connecting to Metamask:', err);
      setError(err.message || 'Failed to connect to Metamask');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setError(null);
  };

  const value: MetamaskWalletContextType = {
    account,
    chainId,
    isConnecting,
    error,
    connect,
    disconnect,
    provider,
    isEngineInitialized,
    isEngineInitializing,
    initializeEngineIfNeeded,
  };

  return (
    <MetamaskWalletContext.Provider value={value}>
      {children}
    </MetamaskWalletContext.Provider>
  );
};

export const useMetamaskWallet = (): MetamaskWalletContextType => {
  const context = useContext(MetamaskWalletContext);
  if (context === undefined) {
    throw new Error('useMetamaskWallet must be used within a MetamaskWalletProvider');
  }
  return context;
};

// Extend window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
