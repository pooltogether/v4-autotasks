import { PopulatedTransaction } from '@ethersproject/contracts';
import { ContractsBlob, ProviderOptions } from './types';
import { getContract } from './utils';

export async function prizeFlush(
  contracts: ContractsBlob,
  config: ProviderOptions,
): Promise<PopulatedTransaction | undefined> {
  const { chainId, provider } = config;

  const prizeFlush = getContract('PrizeFlush', chainId, provider, contracts);
  if (!prizeFlush) {
    throw new Error('PrizeFlush: Contract Unavailable');
  }

  let transactionPopulated: PopulatedTransaction | undefined;
  transactionPopulated = await prizeFlush.populateTransaction.flush();
  return transactionPopulated;
}
