import { PopulatedTransaction } from '@ethersproject/contracts';
import { ContractsBlob, ProviderOptions } from './types';
import { fetchReceiverDrawIdToPush, getContract } from './utils';

const debug = require('debug')('pt-autotask-lib');

/**
 * An autotask to handle pushing a new draw id to a PrizeDistributionFactoryV2 on a receiver chain.
 * PoolTogether v4 v1.3.0 Architecture
 * @param contracts
 * @param beaconChain
 * @param chain
 * @returns
 */
export async function receiverPushDrawId(
  contracts: ContractsBlob,
  beaconChain: ProviderOptions,
  chain: ProviderOptions,
): Promise<PopulatedTransaction | undefined> {
  const { chainId: beaconChainId, provider: beaconProvider } = beaconChain;
  const { chainId, provider } = chain;

  // Receiver Chain Contracts
  const prizeDistributionFactoryV2 = getContract(
    'PrizeDistributionFactoryV2',
    chainId,
    provider,
    contracts,
  );
  const prizeDistributionBuffer = getContract(
    'PrizeDistributionBuffer',
    chainId,
    provider,
    contracts,
  );

  // Beacon Chain Contracts
  const beaconDrawBuffer = getContract('DrawBuffer', beaconChainId, beaconProvider, contracts);
  const beaconPrizeDistributionBuffer = getContract(
    'PrizeDistributionBuffer',
    beaconChainId,
    beaconProvider,
    contracts,
  );

  if (
    !prizeDistributionFactoryV2 ||
    !prizeDistributionBuffer ||
    !beaconDrawBuffer ||
    !beaconPrizeDistributionBuffer
  ) {
    throw new Error('Contract Unavailable: Check ContractList and Provider Configuration');
  }

  const { shouldPush, drawIdToPush } = await fetchReceiverDrawIdToPush(
    beaconDrawBuffer,
    beaconPrizeDistributionBuffer,
    prizeDistributionBuffer,
  );

  if (shouldPush) {
    debug('Pushing Draw Id: ', drawIdToPush);
    return await prizeDistributionFactoryV2.pushPrizeDistribution(drawIdToPush);
  } else {
    console.log('No Draw Id to push');
  }
}
