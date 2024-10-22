import { NetworkName } from "@railgun-community/shared-models";

export type SupportedNetworks = Exclude<
  NetworkName,
  | NetworkName.Hardhat
  | NetworkName.PolygonMumbai_DEPRECATED
  | NetworkName.ArbitrumGoerli_DEPRECATED
  | NetworkName.EthereumGoerli_DEPRECATED
  | NetworkName.EthereumRopsten_DEPRECATED
  | NetworkName.EthereumSepolia
  | NetworkName.PolygonAmoy
  | NetworkName.BNBChain
>;

export const SupportedNetworkValues: SupportedNetworks[] = [
  NetworkName.Ethereum,
  NetworkName.Polygon,
  NetworkName.Arbitrum,
];
