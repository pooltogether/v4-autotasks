import { ContractsBlob, ProviderUrlOptions, Secrets } from '../types';

// Mainnet chain ids
export const ARBITRUM_CHAIN_ID = 42161;
export const AVALANCHE_CHAIN_ID = 43114;
export const ETHEREUM_MAINNET_CHAIN_ID = 1;
export const OPTIMISM_CHAIN_ID = 10;
export const POLYGON_CHAIN_ID = 137;

// Testnet chain ids
export const ARBITRUM_GOERLI_CHAIN_ID = 421613;
export const FUJI_CHAIN_ID = 43113;
export const ETHEREUM_GOERLI_CHAIN_ID = 5;
export const OPTIMISM_GOERLI_CHAIN_ID = 420;
export const MUMBAI_CHAIN_ID = 80001;

// The Arbitrum prize pool has not been deployed on mainnet yet
export const ETHEREUM_MAINNET_CHAIN_IDS = [
  ETHEREUM_MAINNET_CHAIN_ID,
  AVALANCHE_CHAIN_ID,
  OPTIMISM_CHAIN_ID,
  POLYGON_CHAIN_ID,
];

// The Avalanche Fuji prize pool has been deprecated on testnet
export const TESTNET_CHAIN_IDS = [
  ETHEREUM_GOERLI_CHAIN_ID,
  ARBITRUM_GOERLI_CHAIN_ID,
  OPTIMISM_GOERLI_CHAIN_ID,
  MUMBAI_CHAIN_ID,
];

export const isMainnet = (chainId: number): boolean => {
  switch (chainId) {
    case ETHEREUM_MAINNET_CHAIN_ID:
      return true;
    case ARBITRUM_CHAIN_ID:
      return true;
    case AVALANCHE_CHAIN_ID:
      return true;
    case OPTIMISM_CHAIN_ID:
      return true;
    case POLYGON_CHAIN_ID:
      return true;
    default:
      return false;
  }
};

export const isTestnet = (chainId: number): boolean => {
  switch (chainId) {
    case ETHEREUM_GOERLI_CHAIN_ID:
      return true;
    case ARBITRUM_GOERLI_CHAIN_ID:
      return true;
    case FUJI_CHAIN_ID:
      return true;
    case OPTIMISM_GOERLI_CHAIN_ID:
      return true;
    case MUMBAI_CHAIN_ID:
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
    case ETHEREUM_MAINNET_CHAIN_ID:
      return ethereumMainnetProviderURL;
    case ARBITRUM_CHAIN_ID:
      return arbitrumMainnetProviderURL;
    case AVALANCHE_CHAIN_ID:
      return avalancheMainnetProviderURL;
    case OPTIMISM_CHAIN_ID:
      return optimismMainnetProviderURL;
    case POLYGON_CHAIN_ID:
      return polygonMainnetProviderURL;

    case ETHEREUM_GOERLI_CHAIN_ID:
      return ethereumGoerliProviderURL;
    case ARBITRUM_GOERLI_CHAIN_ID:
      return arbitrumGoerliProviderURL;
    case FUJI_CHAIN_ID:
      return avalancheFujiProviderURL;
    case OPTIMISM_GOERLI_CHAIN_ID:
      return optimismGoerliProviderURL;
    case MUMBAI_CHAIN_ID:
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
