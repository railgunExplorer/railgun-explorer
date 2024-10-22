export interface RailgunConfigurations {
  minVersionNumberIOS: string;
  minVersionNumberAndroid: string;
  minVersionNumberWeb: string;
  wakuPubSubTopic: string;
  additionalDirectPeers: string[];
  wakuPeerDiscoveryTimeout: number;
  pollingInterval: number;
  proxyApiUrl: string;
  proxyNftsApiUrl: string;
  proxyPoiAggregatorUrl: string;
  publicPoiAggregatorUrls: string[];
  poiDocumentation: {
    railgunPOIDocUrl: string;
    railwayPOIDocUrl: string;
  };
  defaultNetworkName: string;
  availableNetworks: {
    [networkName: string]: {
      canSendPublic: boolean;
      canSendShielded: boolean;
      canShield: boolean;
      canUnshield: boolean;
      canSwapPublic: boolean;
      canSwapShielded: boolean;
      canRelayAdapt: boolean;
      isDevOnly?: boolean;
    };
  };
  networkProvidersConfig: {
    [networkName: string]: {
      chainId: number;
      providers: {
        provider: string;
        priority: number;
        weight: number;
        maxLogsPerBatch?: number;
        stallTimeout?: number;
      }[];
    };
  };
  networkProvidersConfigArchiveNodes: Record<string, never>;
}
