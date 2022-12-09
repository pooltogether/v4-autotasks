import { PopulatedTransaction } from '@ethersproject/contracts';
import { ContractsBlob, ProviderOptions } from './types';
import { fetchDrawIdToPush, getContract } from './utils';

const debug = require('debug')('pt-autotask-lib');

/**
 * An autotask to handle pushing a new PrizeDistribution to a PrizeDistributionFactoryV2 on a beacon chain.
 * PoolTogether v4 v1.3.0 Architecture
 * @param contracts
 * @param chain
 * @returns
 */
export async function beaconPushPrizeDistribution(
  contracts: ContractsBlob,
  chain: ProviderOptions,
): Promise<PopulatedTransaction | undefined> {
  const { chainId, provider } = chain;

  const drawBuffer = getContract('DrawBuffer', chainId, provider, contracts);
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

  if (!drawBuffer || !prizeDistributionFactoryV2 || !prizeDistributionBuffer) {
    throw new Error('Contract Unavailable: Check ContractList and Provider Configuration');
  }

  const { shouldPush, drawIdToPush } = await fetchDrawIdToPush(drawBuffer, prizeDistributionBuffer);

  if (shouldPush) {
    debug('Pushing Draw Id: ', drawIdToPush);
    return await prizeDistributionFactoryV2.pushPrizeDistribution(drawIdToPush);
  } else {
    console.log('No Draw Id to push');
  }
}
