import {
    ArtifactStore,
    startRailgunEngine,
    loadProvider,
    createViewOnlyRailgunWallet,
    setOnBalanceUpdateCallback,
    setOnUTXOMerkletreeScanCallback,
    refreshBalances,
    getWalletTransactionHistory,
    POIList
} from '@railgun-community/wallet';
import {
    NetworkName,
    NETWORK_CONFIG,
    RailgunBalancesEvent,
    TransactionHistoryItem,
    RailgunWalletInfo
} from '@railgun-community/shared-models';
import localforage from 'localforage';
import Level from 'level-js'


const createArtifactStore = () => {
    return new ArtifactStore(
        async (path) => {
            return localforage.getItem(path);
        },
        async (dir, path, item) => {
            await localforage.setItem(path, item);
        },
        async (path) => (await localforage.getItem(path)) != null,
    );
};

const initializeEngine = async (): Promise<void> => {
    const walletSource = 'railgun explorer';
    
    const dbPath = 'engine.db';
    const db = new Level(dbPath);
    
    const artifactStore = createArtifactStore();
    
    const shouldDebug = true;
    const useNativeArtifacts = false;
    const skipMerkletreeScans = false;
    const verboseScanLogging = false;

    const poiNodeURLs = [
        'https://ppoi-agg.horsewithsixlegs.xyz',
        'https://poi-node.terminal-wallet.com'
    ];

    const customPOILists: POIList[] = []


    await startRailgunEngine(
        walletSource,
        db,
        shouldDebug,
        artifactStore,
        useNativeArtifacts,
        skipMerkletreeScans,
        poiNodeURLs,
        customPOILists,
        verboseScanLogging
    )
}

const loadEngineProvider = async (): Promise<void> => {
    const PROVIDERS_JSON = {
        "chainId": 137,
        "providers": [
            {
                "provider": "https://uber.us.proxy.railwayapi.xyz/rpc/alchemy/polygon-mainnet",
                "priority": 1,
                "weight": 2,
                "maxLogsPerBatch": 2,
                "stallTimeout": 2500
            },
            {
                "provider": "https://polygon-bor-rpc.publicnode.com",
                "priority": 2,
                "weight": 1,
                "maxLogsPerBatch": 10
            },
            {
                "provider": "https://rpc.ankr.com/polygon",
                "priority": 3,
                "weight": 1,
                "maxLogsPerBatch": 10
            }
        ]
    }

    const pollingInterval = 1000 * 60 * 1000; // Basicly never refresh

    await loadProvider(
        PROVIDERS_JSON,
        NetworkName.Polygon,
        pollingInterval,
    );
}

export const initRailgun = async () => {
  try {
    await initializeEngine();
    await loadEngineProvider();
  } catch (err) {
    console.error(err);
  }
};

export const queryWalletBalance = async (
  shareableViewingKey: string,
  onWalletInfoDecoded: (wallet: RailgunWalletInfo) => void,
  onUpdateProgress: (progress: number) => void  ,
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

  const { chain } = NETWORK_CONFIG[NetworkName.Polygon];
  
  await refreshBalances(chain, [viewOnlyWalletInfo.id]);
  
  //@ts-ignore: wtf?
  const history = await getWalletTransactionHistory(
    chain,
    viewOnlyWalletInfo.id
  );

  onUpdateHistory(history);
};


