# Railgun Wallet Implementation Guide

## ✅ What Is Already Implemented

### 1. Wallet Management
- **Deterministic Wallet from MetaMask**: The private key is derived from the MetaMask signature
- **Persistence**: Wallet info is stored in LocalStorage
- **Context Management**: Central state management for Railgun Wallet

### 2. UI Components
- **RailgunBalances**: Shows private token balances
- **ShieldTokens**: UI for shielding tokens (Public → Private)
- **SendTokens**: UI for private transfers and unshielding

### 3. Utilities
- **Network Mapping**: chainId → Railgun NetworkName
- **Token Metadata Service**: Loads and caches token information
- **Block Explorer Links**: Generates links to transactions

## ⚠️ What Still Needs to Be Implemented

The Railgun Wallet API (@railgun-community/wallet) is very complex and requires specific parameters that depend on the application. The following functions still need to be correctly implemented:

### 1. Shield (Public → Private)

**Current Implementation**: `src/services/railgun-transaction.service.ts:shieldTokens()`

**What's Missing**:
- Correct usage of `populateShield` with all parameters
- POI (Proof of Innocence) Management
- TXIDVersion Handling

**Required Railgun API**:
```typescript
import { populateShield, TXIDVersion } from '@railgun-community/wallet';

// Shield requires:
const txidVersion = TXIDVersion.V2_PoseidonMerkle; // or V3
const shieldTx = await populateShield(
  txidVersion,
  networkName,
  railgunAddress,
  shieldPrivateKey, // Derive from wallet
  erc20AmountRecipients,
  nftAmountRecipients
);
```

### 2. Private Transfer (Private → Private)

**Current Implementation**: `src/services/railgun-transaction.service.ts:transferTokensPrivately()`

**What's Missing**:
- Proof Generation with `generateTransferProof`
- Transaction Population with `populateProvedTransfer`
- Encryption Key Management
- Memo Text Support

**Required Railgun API**:
```typescript
import { generateTransferProof, populateProvedTransfer } from '@railgun-community/wallet';

// 1. Generate Proof
const proofResult = await generateTransferProof(
  txidVersion,
  networkName,
  railgunWalletID,
  encryptionKey,
  showSenderAddressToRecipient,
  memoText,
  erc20AmountRecipients,
  nftAmountRecipients,
  relayAdaptContract,
  relayAdaptParams,
  broadcasterFeeERC20AmountRecipient,
  sendWithPublicWallet,
  overallBatchMinGasPrice,
  progressCallback
);

// 2. Populate Transaction
const populatedTx = await populateProvedTransfer(...);
```

### 3. Unshield (Private → Public)

**Current Implementation**: `src/services/railgun-transaction.service.ts:unshieldTokens()`

**What's Missing**:
- Proof Generation with `generateUnshieldProof`
- Transaction Population with `populateProvedUnshield`
- Gas Estimation
- POI Handling

**Required Railgun API**:
```typescript
import { generateUnshieldProof, populateProvedUnshield } from '@railgun-community/wallet';

// Similar to transfer, but with Unshield-specific parameters
```

## 🔑 Important Concepts

### TXIDVersion
Railgun uses different TXID versions:
- `TXIDVersion.V2_PoseidonMerkle` - For older transactions
- `TXIDVersion.V3_PoseidonMerkle` - Latest version

### Encryption Key
The Encryption Key is required to:
- Enable proof generation
- Encrypt wallet data
- Sign private transactions

**Currently**: Hardcoded as `0101...`
**Should be**: Derived from MetaMask signature (already implemented in wallet service)

### POI (Proof of Innocence)
Railgun requires POI for:
- Anti-money laundering compliance
- Privacy-preserving compliance

**Implementation required**:
- POI Node URLs (already in config)
- POI List Management
- POI Proof generation before transactions

### Gas Estimation
Railgun transactions require special gas estimations:
- `gasEstimateForShield`
- `gasEstimateForUnprovenTransfer`
- `gasEstimateForUnprovenUnshield`

## 📚 Resources

### Official Railgun Documentation
- [Railgun Wallet SDK](https://github.com/Railgun-Community/wallet)
- [Railgun Docs](https://docs.railgun.org/)
- [Railway Wallet (Reference Implementation)](https://github.com/Railway-Wallet/Railway-Wallet)

### Example Code
The best reference is the Railway Wallet implementation:
- [Transfer Logic](https://github.com/Railway-Wallet/Railway-Wallet/tree/main/src/services/transactions)
- [POI Management](https://github.com/Railway-Wallet/Railway-Wallet/tree/main/src/services/poi)

## 🚀 Next Steps

1. **Configure TXIDVersion**
   - Decide which version to use
   - Define constant

2. **Encryption Key Management**
   - Adapt wallet service to provide key
   - Securely derive from MetaMask signature

3. **POI Integration**
   - Configure POI Node URLs
   - Implement POI List Management
   - Generate POI proofs before transactions

4. **Proof Generation**
   - Call `generateTransferProof` correctly
   - Call `generateUnshieldProof` correctly
   - Implement progress callbacks

5. **Transaction Population**
   - `populateProvedTransfer` with correct parameters
   - `populateProvedUnshield` with correct parameters
   - Set gas details correctly

6. **Testing**
   - Use testnet (Sepolia, Polygon Amoy)
   - Test small amounts
   - Improve error handling

## 💡 Tips

1. **Start with Shield**: This is the easiest operation
2. **Use Railway Wallet as reference**: The code is open source
3. **Test on testnet**: Use Sepolia or Polygon Amoy
4. **Enable logs**: Railgun SDK has debug logs
5. **Proof generation takes time**: 10-30 seconds is normal

## 🔧 Temporary Workaround

For development/testing you can:
1. Use only the UI without real transactions
2. Use mock data for balances
3. Mark transactions as "Coming Soon"
4. Focus on wallet management and UI

The complete Railgun integration is a larger project that takes time!
