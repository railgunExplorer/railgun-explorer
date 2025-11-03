import { createRailgunWallet, loadWalletByID } from '@railgun-community/wallet';
import { RailgunWalletInfo } from '@railgun-community/shared-models';
import { BrowserProvider, Mnemonic, sha256, toUtf8Bytes } from 'ethers';

const STORAGE_KEY = 'railgun_wallet_info';
const SIGNATURE_MESSAGE = 'Sign this message to access your Railgun wallet.\n\nThis signature is used locally to derive your private Railgun identity from your Ethereum wallet.\n\nNo private keys will be transmitted or stored.\n\nWallet address: ';

export interface StoredWalletInfo {
  walletId: string;
  railgunAddress: string;
  ethereumAddress: string;
  createdAt: number;
}

/**
 * Derives a deterministic mnemonic from MetaMask signature
 */
const deriveMnemonicFromSignature = (signature: string): Mnemonic => {
  // Hash the signature to get deterministic entropy
  const hash = sha256(toUtf8Bytes(signature));
  // Take first 16 bytes (128 bits) for a 12-word mnemonic
  const entropy = hash.slice(0, 34); // 0x + 32 hex chars = 16 bytes
  return Mnemonic.fromEntropy(entropy);
};

/**
 * Derives an encryption key from the signature (used to encrypt wallet in IndexedDB)
 */
const deriveEncryptionKey = (signature: string): string => {
  // Use a different derivation path for encryption key
  const hash = sha256(toUtf8Bytes(signature + '_encryption'));
  return hash.slice(2); // Remove 0x prefix
};

/**
 * Request user signature from MetaMask to derive Railgun wallet
 */
export const requestWalletSignature = async (
  provider: BrowserProvider,
  ethereumAddress: string
): Promise<string> => {
  const signer = await provider.getSigner();
  const message = SIGNATURE_MESSAGE + ethereumAddress;
  const signature = await signer.signMessage(message);
  return signature;
};

/**
 * Create or load Railgun wallet from MetaMask signature
 */
export const getOrCreateRailgunWallet = async (
  provider: BrowserProvider,
  ethereumAddress: string
): Promise<RailgunWalletInfo> => {
  // Check if wallet is already stored
  const storedInfo = getStoredWalletInfo(ethereumAddress);

  // Request signature from user
  const signature = await requestWalletSignature(provider, ethereumAddress);

  // Derive mnemonic and encryption key from signature
  const mnemonic = deriveMnemonicFromSignature(signature);
  const encryptionKey = deriveEncryptionKey(signature);

  let walletInfo: RailgunWalletInfo;

  if (storedInfo) {
    // Try to load existing wallet
    try {
      walletInfo = await loadWalletByID(
        encryptionKey,
        storedInfo.walletId,
        false // onlyIfAlreadyLoaded
      );
      console.log('Loaded existing Railgun wallet:', storedInfo.walletId);
      return walletInfo;
    } catch (error) {
      console.warn('Could not load stored wallet, creating new one:', error);
    }
  }

  // Create new wallet
  const creationBlockNumberMap = {}; // Empty map means scan from latest block

  walletInfo = await createRailgunWallet(
    encryptionKey,
    mnemonic.phrase,
    creationBlockNumberMap
  );

  // Store wallet info
  storeWalletInfo(ethereumAddress, walletInfo);

  console.log('Created new Railgun wallet:', walletInfo.id);
  return walletInfo;
};

/**
 * Get stored wallet info for an Ethereum address
 */
export const getStoredWalletInfo = (ethereumAddress: string): StoredWalletInfo | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const walletMap: Record<string, StoredWalletInfo> = JSON.parse(stored);
    return walletMap[ethereumAddress.toLowerCase()] || null;
  } catch (error) {
    console.error('Error reading stored wallet info:', error);
    return null;
  }
};

/**
 * Store wallet info for an Ethereum address
 */
const storeWalletInfo = (ethereumAddress: string, walletInfo: RailgunWalletInfo): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const walletMap: Record<string, StoredWalletInfo> = stored ? JSON.parse(stored) : {};

    walletMap[ethereumAddress.toLowerCase()] = {
      walletId: walletInfo.id,
      railgunAddress: walletInfo.railgunAddress,
      ethereumAddress: ethereumAddress.toLowerCase(),
      createdAt: Date.now(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(walletMap));
  } catch (error) {
    console.error('Error storing wallet info:', error);
  }
};

/**
 * Clear stored wallet info for an Ethereum address
 */
export const clearStoredWalletInfo = (ethereumAddress: string): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const walletMap: Record<string, StoredWalletInfo> = JSON.parse(stored);
    delete walletMap[ethereumAddress.toLowerCase()];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(walletMap));
  } catch (error) {
    console.error('Error clearing wallet info:', error);
  }
};

/**
 * Check if a Railgun wallet exists for the given Ethereum address
 */
export const hasStoredWallet = (ethereumAddress: string): boolean => {
  return getStoredWalletInfo(ethereumAddress) !== null;
};

/**
 * Derive Shield Private Key from signature
 * This key is used for shielding operations (public -> private)
 */
export const deriveShieldPrivateKey = (signature: string): string => {
  // The shield private key is derived from the same entropy as the wallet
  // but using a different derivation path to ensure security
  const hash = sha256(toUtf8Bytes(signature + '_shield'));
  return hash; // Returns 0x-prefixed 32-byte hex string
};

/**
 * Get shield private key for current session
 * Requires the user to have signed the wallet message
 */
export const getShieldPrivateKey = async (
  provider: BrowserProvider,
  ethereumAddress: string
): Promise<string> => {
  const signature = await requestWalletSignature(provider, ethereumAddress);
  return deriveShieldPrivateKey(signature);
};
