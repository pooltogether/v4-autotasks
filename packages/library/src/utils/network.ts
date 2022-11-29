import { ContractsBlob, ProviderUrlOptions, Secrets } from '../types';

// The Arbitrum prize pool has not been deployed on mainnet yet
export const MAINNET_CHAIN_IDS = [
  1, // Ethereum
  43114, // Avalanche
  10, // Optimism
  137, // Polygon
];

// The Avalanche Fuji prize pool has been deprecated on testnet
export const TESTNET_CHAIN_IDS = [
  5, // Ethereum Goerli
  421613, // Arbitrum Goerli
  420, // Optimism Goerli
  80001, // Polygon Mumbai
];

export const isMainnet = (chainId: number): boolean => {
  switch (chainId) {
    case 1:
      return true;
    case 42161:
      return true;
    case 43114:
      return true;
    case 10:
      return true;
    case 137:
      return true;
    default:
      return false;
  }
};

export const isTestnet = (chainId: number): boolean => {
  switch (chainId) {
    case 5:
      return true;
    case 421613:
      return true;
    case 43113:
      return true;
    case 420:
      return true;
    case 80001:
      return true;
    default:
      return false;
  }
};

export const getContracts = (
  chainId: number,
  mainnet: ContractsBlob,
  testnet: ContractsBlob,
): ContractsBlob => {
  if (isMainnet(chainId)) {
    return mainnet;
  } else if (isTestnet(chainId)) {
    return testnet;
  } else {
    throw new Error(`getContracts: Unsupported network ${chainId}`);
  }
};

export const getProviderUrl = (chainId: number, secrets: Secrets) => {
  const {
    ethereumMainnetProviderURL,
    arbitrumMainnetProviderURL,
    avalancheMainnetProviderURL,
    optimismMainnetProviderURL,
    polygonMainnetProviderURL,
    ethereumGoerliProviderURL,
    arbitrumGoerliProviderURL,
    avalancheFujiProviderURL,
    optimismGoerliProviderURL,
    polygonMumbaiProviderURL,
  } = secrets;

  switch (chainId) {
    case 1:
      return ethereumMainnetProviderURL;
    case 42161:
      return arbitrumMainnetProviderURL;
    case 43114:
      return avalancheMainnetProviderURL;
    case 10:
      return optimismMainnetProviderURL;
    case 137:
      return polygonMainnetProviderURL;

    case 5:
      return ethereumGoerliProviderURL;
    case 421613:
      return arbitrumGoerliProviderURL;
    case 43113:
      return avalancheFujiProviderURL;
    case 420:
      return optimismGoerliProviderURL;
    case 80001:
      return polygonMumbaiProviderURL;

    default:
      throw new Error(`getProviderUrl: Unsupported network ${chainId}`);
  }
};

export const getProviderUrlOptions = (chainId: number, secrets: Secrets): ProviderUrlOptions => {
  return {
    chainId,
    providerUrl: getProviderUrl(chainId, secrets),
  };
};
