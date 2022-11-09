import { PopulatedTransaction } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ContractsBlob, ProviderOptions } from './types';
import { getContract } from './utils';

export async function prizeFlushFlush(
  contracts: ContractsBlob,
  config: ProviderOptions,
): Promise<PopulatedTransaction | undefined> {
  let provider;
  if (config?.providerUrl) {
    provider = new JsonRpcProvider(config.providerUrl);
  } else {
    throw new Error('No Provider URL');
  }

  const prizeFlush = getContract('PrizeFlush', config.chainId, provider, contracts);
  if (!prizeFlush) {
    throw new Error('PrizeFlush: Contract Unavailable');
  }

  let transactionPopulated: PopulatedTransaction | undefined;
  transactionPopulated = await prizeFlush.populateTransaction.flush();
  return transactionPopulated;
}
