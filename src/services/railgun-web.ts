import {
  ArtifactStore,
  startRailgunEngine,
  loadProvider,
  createViewOnlyRailgunWallet,
  setOnBalanceUpdateCallback,
  setOnUTXOMerkletreeScanCallback,
  refreshBalances,
  getWalletTransactionHistory,
  unloadProvider,
} from "@railgun-community/wallet";
import {
  NETWORK_CONFIG,
  RailgunBalancesEvent,
  TransactionHistoryItem,
  RailgunWalletInfo,
  NetworkName,
} from "@railgun-community/shared-models";
import localforage from "localforage";
import Level from "level-js";

const createArtifactStore = () => {
  return new ArtifactStore(
    async (path) => {
      return localforage.getItem(path);
    },
    async (dir, path, item) => {
      await localforage.setItem(path, item);
    },
    async (path) => (await localforage.getItem(path)) != null
  );
};

export const initializeEngine = async ({
  poiNodeURLs,
}: {
  poiNodeURLs: string[];
}): Promise<void> => {
  const walletSource = "railgun explorer";

  const dbPath = "engine.db";
  const db = new Level(dbPath);

  const artifactStore = createArtifactStore();

  const shouldDebug = true;
  const useNativeArtifacts = false;
  const skipMerkletreeScans = false;
  const verboseScanLogging = false;

  await startRailgunEngine(
    walletSource,
    db,
    shouldDebug,
    artifactStore,
    useNativeArtifacts,
    skipMerkletreeScans,
    poiNodeURLs,
    [],
    verboseScanLogging
  );
};

export const queryWalletBalance = async (
  shareableViewingKey: string,
  network: NetworkName,
  onWalletInfoDecoded: (wallet: RailgunWalletInfo) => void,
  onUpdateProgress: (progress: number) => void,
  onUpdateBalance: (balances: RailgunBalancesEvent) => void,
  onUpdateHistory: (history: TransactionHistoryItem[]) => void
) => {
  const encryptionKey =
    "0101010101010101010101010101010101010101010101010101010101010101";

  const creationBlockNumberMap = 0;

  const viewOnlyWalletInfo = await createViewOnlyRailgunWallet(
    encryptionKey,
    shareableViewingKey,
    creationBlockNumberMap
  );
  onWalletInfoDecoded(viewOnlyWalletInfo);

  setOnBalanceUpdateCallback(async (balances) => {
    onUpdateBalance(balances);
  });

  setOnUTXOMerkletreeScanCallback((data) => {
    onUpdateProgress(data?.progress);
  });

  const { chain } = NETWORK_CONFIG[network];

  await refreshBalances(chain, [viewOnlyWalletInfo.id]);

  //@ts-ignore: wtf?
  const history = await getWalletTransactionHistory(
    chain,
    viewOnlyWalletInfo.id
  );

  onUpdateHistory(history);
};

export { loadProvider, unloadProvider };



