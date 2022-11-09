import { BigNumber } from '@ethersproject/bignumber';

export interface ContractData {
  address: string;
  chainId: number;
  type: string;
  abi: any;
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
  providerUrl: string;
}

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

export interface BeaconChainConfig {
  beaconChain: ProviderOptions;
}

export interface PrizePoolNetworkConfig {
  beaconChain: ProviderOptions;
  receiverChain?: ProviderOptions;
  allPrizePoolNetworkChains?: ProviderOptions[];
}
