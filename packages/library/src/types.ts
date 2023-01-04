import { BigNumber } from '@ethersproject/bignumber';
import { JsonRpcProvider } from '@ethersproject/providers';
import { DefenderRelayProvider, DefenderRelaySigner } from 'defender-relay-client/lib/ethers';

// Config types
export interface ContractData {
  address: string;
  chainId: number;
  type: string;
  abi: any;
  version: {
    major: number;
    minor: number;
    patch: number;
  }
}

export interface ContractsBlob {
  contracts: ContractData[];
}

export interface Config {
  chainId: number;
  network: string;
  apiKey: string | undefined;
  speed?: 'slow' | 'normal' | 'fast';
  gasLimit?: number | string;
  execute?: Boolean;
}

export interface ProviderOptions {
  chainId: number;
  provider: DefenderRelayProvider | DefenderRelaySigner | JsonRpcProvider;
}

export interface ProviderUrlOptions {
  chainId: number;
  providerUrl: string;
}

// OpenZeppelin Defender types
export type Secrets = {
  infuraApiKey?: string;

  // Mainnet
  ethereumMainnetProviderURL?: string;
  arbitrumMainnetProviderURL?: string;
  avalancheMainnetProviderURL?: string;
  optimismMainnetProviderURL?: string;
  polygonMainnetProviderURL?: string;

  // Testnet
  ethereumGoerliProviderURL?: string;
  arbitrumGoerliProviderURL?: string;
  avalancheFujiProviderURL?: string;
  optimismGoerliProviderURL?: string;
  polygonMumbaiProviderURL?: string;
};

// Contracts types
export interface Draw {
  drawId: number;
  beaconPeriodSeconds: number;
  timestamp: number;
  getBeaconPeriodSeconds: Function;
}

export interface ContractPrizeTierHistory {
  getPrizeTier: Function;
}
export interface ReserverContract {
  getReserveAccumulatedBetween: Function;
}

export interface Draw {
  drawId: number;
  winningRandomNumber: BigNumber;
  timestamp: number;
  beaconPeriodStartedAt: number;
  beaconPeriodSeconds: number;
}

export interface PrizeDistribution {
  bitRangeSize: number;
  matchCardinality: number;
  startTimestampOffset?: number;
  endTimestampOffset?: number;
  maxPicksPerUser: number;
  expiryDuration: number;
  numberOfPicks: BigNumber;
  tiers: Array<BigNumber | number>;
  prize: BigNumber;
}

export interface PrizeTier {
  bitRangeSize: number;
  drawId: number;
  maxPicksPerUser: number;
  expiryDuration: number;
  endTimestampOffset: number;
  prize: BigNumber;
  tiers: Array<number>;
}
