# Railgun Wallet Implementation Guide

## ✅ Was bereits implementiert ist

### 1. Wallet-Management
- **Deterministisches Wallet aus MetaMask**: Der Private Key wird aus der MetaMask-Signatur abgeleitet
- **Persistierung**: Wallet-Info wird im LocalStorage gespeichert
- **Context Management**: Zentrales State Management für Railgun Wallet

### 2. UI-Komponenten
- **RailgunBalances**: Zeigt private Token-Balances an
- **ShieldTokens**: UI zum Shielding von Tokens (Public → Private)
- **SendTokens**: UI für private Transfers und Unshielding

### 3. Utilities
- **Network Mapping**: chainId → Railgun NetworkName
- **Token Metadata Service**: Lädt und cached Token-Informationen
- **Block Explorer Links**: Generiert Links zu Transaktionen

## ⚠️ Was noch zu implementieren ist

Die Railgun Wallet API (@railgun-community/wallet) ist sehr komplex und benötigt spezifische Parameter, die von der Anwendung abhängen. Die folgenden Funktionen müssen noch korrekt implementiert werden:

### 1. Shield (Public → Private)

**Aktuelle Implementierung**: `src/services/railgun-transaction.service.ts:shieldTokens()`

**Was fehlt**:
- Korrekte Verwendung von `populateShield` mit allen Parametern
- POI (Proof of Innocence) Management
- TXIDVersion Handling

**Benötigte Railgun API**:
```typescript
import { populateShield, TXIDVersion } from '@railgun-community/wallet';

// Shield benötigt:
const txidVersion = TXIDVersion.V2_PoseidonMerkle; // oder V3
const shieldTx = await populateShield(
  txidVersion,
  networkName,
  railgunAddress,
  shieldPrivateKey, // Aus Wallet ableiten
  erc20AmountRecipients,
  nftAmountRecipients
);
```

### 2. Private Transfer (Private → Private)

**Aktuelle Implementierung**: `src/services/railgun-transaction.service.ts:transferTokensPrivately()`

**Was fehlt**:
- Proof Generation mit `generateTransferProof`
- Transaction Population mit `populateProvedTransfer`
- Encryption Key Management
- Memo Text Support

**Benötigte Railgun API**:
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

**Aktuelle Implementierung**: `src/services/railgun-transaction.service.ts:unshieldTokens()`

**Was fehlt**:
- Proof Generation mit `generateUnshieldProof`
- Transaction Population mit `populateProvedUnshield`
- Gas Estimation
- POI Handling

**Benötigte Railgun API**:
```typescript
import { generateUnshieldProof, populateProvedUnshield } from '@railgun-community/wallet';

// Similar to transfer, aber mit Unshield-spezifischen Parametern
```

## 🔑 Wichtige Konzepte

### TXIDVersion
Railgun verwendet verschiedene TXID Versionen:
- `TXIDVersion.V2_PoseidonMerkle` - Für ältere Transaktionen
- `TXIDVersion.V3_PoseidonMerkle` - Neueste Version

### Encryption Key
Der Encryption Key wird benötigt um:
- Proof Generation zu ermöglichen
- Wallet-Daten zu verschlüsseln
- Private Transaktionen zu signieren

**Aktuell**: Hardcoded als `0101...`
**Sollte sein**: Aus MetaMask-Signatur abgeleitet (bereits in wallet service implementiert)

### POI (Proof of Innocence)
Railgun benötigt POI für:
- Anti-Geldwäsche Compliance
- Privacy-preserving Compliance

**Implementierung benötigt**:
- POI Node URLs (bereits in Config)
- POI List Management
- POI Proof Generation vor Transaktionen

### Gas Estimation
Railgun-Transaktionen benötigen spezielle Gas-Schätzungen:
- `gasEstimateForShield`
- `gasEstimateForUnprovenTransfer`
- `gasEstimateForUnprovenUnshield`

## 📚 Ressourcen

### Offizielle Railgun Dokumentation
- [Railgun Wallet SDK](https://github.com/Railgun-Community/wallet)
- [Railgun Docs](https://docs.railgun.org/)
- [Railway Wallet (Referenz-Implementation)](https://github.com/Railway-Wallet/Railway-Wallet)

### Beispiel-Code
Die beste Referenz ist die Railway Wallet Implementation:
- [Transfer Logic](https://github.com/Railway-Wallet/Railway-Wallet/tree/main/src/services/transactions)
- [POI Management](https://github.com/Railway-Wallet/Railway-Wallet/tree/main/src/services/poi)

## 🚀 Nächste Schritte

1. **TXIDVersion konfigurieren**
   - Entscheiden welche Version verwendet werden soll
   - Konstante definieren

2. **Encryption Key Management**
   - Wallet Service anpassen um Key bereitzustellen
   - Sicher aus MetaMask-Signatur ableiten

3. **POI Integration**
   - POI Node URLs konfigurieren
   - POI List Management implementieren
   - POI Proofs vor Transaktionen generieren

4. **Proof Generation**
   - `generateTransferProof` korrekt aufrufen
   - `generateUnshieldProof` korrekt aufrufen
   - Progress Callbacks implementieren

5. **Transaction Population**
   - `populateProvedTransfer` mit korrekten Parametern
   - `populateProvedUnshield` mit korrekten Parametern
   - Gas Details korrekt setzen

6. **Testing**
   - Testnet verwenden (Sepolia, Polygon Amoy)
   - Kleine Beträge testen
   - Error Handling verbessern

## 💡 Tipps

1. **Starte mit Shield**: Das ist die einfachste Operation
2. **Verwende Railway Wallet als Referenz**: Der Code ist open source
3. **Teste auf Testnet**: Verwende Sepolia oder Polygon Amoy
4. **Logs aktivieren**: Railgun SDK hat Debug-Logs
5. **Proof Generation dauert**: 10-30 Sekunden sind normal

## 🔧 Temporary Workaround

Für Development/Testing kannst du:
1. Nur die UI verwenden ohne echte Transaktionen
2. Mock-Daten für Balances verwenden
3. Transaktionen als "Coming Soon" markieren
4. Fokus auf Wallet-Management und UI legen

Die komplette Railgun-Integration ist ein größeres Projekt das Zeit benötigt!
