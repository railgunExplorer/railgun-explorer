import { NETWORK_CONFIG, NetworkName } from "@railgun-community/shared-models";

export type ERC20Info = {
  address: string;
  name: string;
  symbol: string;
  logoURI?: string;
  decimals: number;
  isBaseToken?: boolean;
};

export const DEFAULT_TOKENS_FOR_NETWORK: {
  [key in NetworkName]: ERC20Info[];
} = {
  [NetworkName.Ethereum]: [
    {
      name: "Ether",
      symbol: "ETH",
      address: NETWORK_CONFIG[NetworkName.Ethereum].baseToken.wrappedAddress,
      decimals: 18,
      isBaseToken: true,
    },
    {
      name: "Frankencoin",
      symbol: "ZCHF",
      address: "0xB58E61C3098d85632Df34EecfB899A1Ed80921cB",
      decimals: 18,
      logoURI:
        "https://assets.coingecko.com/coins/images/37150/standard/Coin_Logo_Frankencoin_1024px.png?1728679791",
    },
    {
      name: "RAIL",
      symbol: "RAIL",
      logoURI:
        "https://assets.coingecko.com/coins/images/16840/large/railgun.jpeg?1625322775",
      address: "0xe76c6c83af64e4c60245d8c7de953df673a7a33d",
      decimals: 18,
    },
    {
      name: "Tether",
      symbol: "USDT",
      logoURI:
        "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
      address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      decimals: 6,
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      logoURI:
        "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      decimals: 6,
    },
    {
      name: "Binance USD",
      symbol: "BUSD",
      logoURI:
        "https://assets.coingecko.com/coins/images/9576/large/BUSD.png?1568947766",
      address: "0x4fabb145d64652a948d72533023f6e7a623c7c53",
      decimals: 18,
    },
    {
      name: "Wrapped Bitcoin",
      symbol: "WBTC",
      logoURI:
        "https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1548822744",
      address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
      decimals: 8,
    },
    {
      name: "Shiba Inu",
      symbol: "SHIB",
      logoURI:
        "https://assets.coingecko.com/coins/images/11939/large/shiba.png?1622619446",
      address: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
      decimals: 18,
    },
    {
      name: "Dai",
      symbol: "DAI",
      logoURI:
        "https://assets.coingecko.com/coins/images/9956/large/4943.png?1636636734",
      address: "0x6b175474e89094c44da98b954eedeac495271d0f",
      decimals: 18,
    },
    {
      name: "Polygon",
      symbol: "MATIC",
      logoURI:
        "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912",
      address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
      decimals: 18,
    },
    {
      address: "0x514910771af9ca656af840dff83e8264ecf986ca",
      name: "Chainlink",
      symbol: "LINK",
      decimals: 18,
      logoURI:
        "https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png?1547034700",
    },
  ],
  [NetworkName.BNBChain]: [
    {
      name: "Binance Coin",
      symbol: "BNB",
      address: NETWORK_CONFIG[NetworkName.BNBChain].baseToken.wrappedAddress,
      decimals: 18,
      isBaseToken: true,
    },
    {
      name: "RAILBSC",
      symbol: "RAILBSC",
      logoURI:
        "https://assets.coingecko.com/coins/images/16840/large/railgun.jpeg?1625322775",
      address: "0x3f847b01d4d498a293e3197b186356039ecd737f",
      decimals: 18,
    },
    {
      name: "Tether",
      symbol: "USDT",
      logoURI:
        "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
      address: "0x55d398326f99059ff775485246999027b3197955",
      decimals: 18,
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      logoURI:
        "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
      address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
      decimals: 18,
    },
    {
      name: "Binance USD",
      symbol: "BUSD",
      logoURI:
        "https://assets.coingecko.com/coins/images/9576/large/BUSD.png?1568947766",
      address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
      decimals: 18,
    },
    {
      name: "Dogecoin",
      symbol: "DOGE",
      logoURI:
        "https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1547792256",
      address: "0x4206931337dc273a630d328da6441786bfad668f",
      decimals: 8,
    },
    {
      name: "Dai",
      symbol: "DAI",
      logoURI:
        "https://assets.coingecko.com/coins/images/9956/large/4943.png?1636636734",
      address: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
      decimals: 18,
    },
    {
      name: "Polygon",
      symbol: "MATIC",
      logoURI:
        "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912",
      address: "0xcc42724c6683b7e57334c4e856f4c9965ed682bd",
      decimals: 18,
    },
    {
      name: "Chainlink",
      symbol: "LINK",
      logoURI:
        "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png?1547034700",
      address: "0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd",
      decimals: 18,
    },
    {
      name: "Cosmos Hub",
      symbol: "ATOM",
      logoURI:
        "https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png?1555657960",
      address: "0x0eb3a705fc54725037cc9e008bdede697f62f335",
      decimals: 18,
    },
    {
      name: "Uniswap",
      symbol: "UNI",
      logoURI:
        "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png?1600306604",
      address: "0xbf5140a22578168fd562dccf235e5d43a02ce9b1",
      decimals: 18,
    },
  ],
  [NetworkName.Polygon]: [
    {
      name: "Polygon",
      symbol: "MATIC",
      address: NETWORK_CONFIG[NetworkName.Polygon].baseToken.wrappedAddress,
      logoURI:
        "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912",
      decimals: 18,
      isBaseToken: true,
    },
    {
      name: "Frankencoin",
      symbol: "ZCHF",
      address: "0x02567e4b14b25549331fcee2b56c647a8bab16fd",
      decimals: 18,
      logoURI:
        "https://assets.coingecko.com/coins/images/37150/standard/Coin_Logo_Frankencoin_1024px.png?1728679791",
    },
    {
      name: "RAILPOLY",
      symbol: "RAILPOLY",
      logoURI:
        "https://assets.coingecko.com/coins/images/16840/large/railgun.jpeg?1625322775",
      address: "0x92A9C92C215092720C731c96D4Ff508c831a714f",
      decimals: 18,
    },
    {
      name: "Tether",
      symbol: "USDT",
      logoURI:
        "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
      decimals: 6,
    },
    {
      name: "USD Coin (PoS)",
      symbol: "USDC.e",
      logoURI:
        "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
      address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
      decimals: 6,
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      logoURI:
        "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
      address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      decimals: 6,
    },
    {
      name: "Binance USD",
      symbol: "BUSD",
      logoURI:
        "https://assets.coingecko.com/coins/images/9576/large/BUSD.png?1568947766",
      address: "0x9fb83c0635de2e815fd1c21b3a292277540c2e8d",
      decimals: 18,
    },
    {
      name: "Avalanche",
      symbol: "AVAX",
      logoURI:
        "https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png?1604021818",
      address: "0x2c89bbc92bd86f8075d1decc58c7f4e0107f286b",
      decimals: 18,
    },
    {
      name: "Wrapped Bitcoin",
      symbol: "WBTC",
      logoURI:
        "https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1548822744",
      address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
      decimals: 8,
    },
    {
      name: "Dai",
      symbol: "DAI",
      logoURI:
        "https://assets.coingecko.com/coins/images/9956/large/4943.png?1636636734",
      address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
      decimals: 18,
    },
    {
      name: "Chainlink",
      symbol: "LINK",
      logoURI:
        "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png?1547034700",
      address: "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",
      decimals: 18,
    },
  ],
  [NetworkName.Arbitrum]: [
    {
      name: "Tether USD",
      symbol: "USDT",
      logoURI:
        "https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663",
      decimals: 6,
      address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    },
    {
      name: "Frankencoin",
      symbol: "ZCHF",
      address: "0xB33c4255938de7A6ec1200d397B2b2F329397F9B",
      decimals: 18,
      logoURI:
        "https://assets.coingecko.com/coins/images/37150/standard/Coin_Logo_Frankencoin_1024px.png?1728679791",
    },
    {
      name: "Dai Stablecoin",
      symbol: "DAI",
      logoURI:
        "https://assets.coingecko.com/coins/images/9956/large/4943.png?1636636734",
      decimals: 18,
      address: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
      decimals: 6,
    },
    {
      name: "Wrapped BTC",
      symbol: "WBTC",
      logoURI:
        "https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1548822744",
      decimals: 8,
      address: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
    },
    {
      name: "Matic Token",
      symbol: "MATIC",
      logoURI:
        "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912",
      decimals: 18,
      address: "0x561877b6b3dd7651313794e5f2894b2f18be0766",
    },
    {
      name: "ChainLink Token",
      symbol: "LINK",
      logoURI:
        "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png?1547034700",
      decimals: 18,
      address: "0xf97f4df75117a78c1a5a0dbb814af92458539fb4",
    },
    {
      name: "Aave Token",
      symbol: "AAVE",
      logoURI:
        "https://assets.coingecko.com/coins/images/12645/large/AAVE.png?1601374110",
      decimals: 18,
      address: "0xba5ddd1f9d7f570dc94a51479a000e3bce967196",
    },
  ],
  // Only to meet the type requirement, please ignore
  [NetworkName.EthereumSepolia]: [],
  [NetworkName.PolygonAmoy]: [],
  [NetworkName.Hardhat]: [],
  [NetworkName.EthereumRopsten_DEPRECATED]: [],
  [NetworkName.EthereumGoerli_DEPRECATED]: [],
  [NetworkName.ArbitrumGoerli_DEPRECATED]: [],
  [NetworkName.PolygonMumbai_DEPRECATED]: [],
};
