import {
  RailgunERC20Amount,
  NetworkName,
} from "@railgun-community/shared-models";
import { DEFAULT_TOKENS_FOR_NETWORK } from "../models/token-list";

export interface FormattedTokenBalance {
  tokenAddress: string;
  name: string;
  symbol: string;
  amount: string;
  logoURI?: string;
  isBaseToken?: boolean;
  isUnknown?: boolean;
}

const formatTokenAmount = (amount: bigint, decimals: number): string => {
  const divisor = BigInt(10 ** decimals);
  const integerPart = amount / divisor;
  const fractionalPart = amount % divisor;
  return `${integerPart}.${fractionalPart.toString().padStart(decimals, "0")}`;
};

export const formatToken = (
  token: RailgunERC20Amount,
  networkName: NetworkName
): FormattedTokenBalance => {
  const defaultTokensInfo = DEFAULT_TOKENS_FOR_NETWORK[networkName];
  const tokenInfo = defaultTokensInfo.find(
    (t) => t.address.toLowerCase() === token.tokenAddress.toLowerCase()
  );

  if (!tokenInfo) {
    return {
      name: "",
      symbol: "",
      tokenAddress: token.tokenAddress,
      amount: token.amount.toString(),
      isUnknown: true,
    };
  }

  const formattedAmount = formatTokenAmount(token.amount, tokenInfo.decimals);

  return {
    ...tokenInfo,
    tokenAddress: token.tokenAddress,
    amount: formattedAmount,
  };
};
