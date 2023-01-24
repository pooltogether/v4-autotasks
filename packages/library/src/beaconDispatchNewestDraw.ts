import { PopulatedTransaction } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';

import { ContractsBlob, ProviderOptions, ProviderUrlOptions } from './types';
import {
  shouldDispatchNewestDraw,
  getContract,
  getSingleMessageDispatcherContractAddress,
} from './utils';

/**
 * An autotask to dispatch the newest Draw from a DrawBuffer on a beacon chain
 * to the DrawBuffer on a receiver chain.
 * PoolTogether v4 v1.3.0 Architecture
 */
export async function beaconDispatchNewestDraw(
  contracts: ContractsBlob,
  beaconChain: ProviderOptions,
  receiverChain: ProviderUrlOptions,
): Promise<PopulatedTransaction | undefined> {
  const { chainId, provider } = beaconChain;

  let providerReceiverChain: JsonRpcProvider;

  if (receiverChain.providerUrl) {
    providerReceiverChain = new JsonRpcProvider(receiverChain.providerUrl);
  } else {
    throw new Error('Receiver Unavailable: check providerUrl configuration');
  }

  const drawBuffer = getContract('DrawBuffer', chainId, provider, contracts);
  const receiverDrawBuffer = getContract(
    'DrawBuffer',
    receiverChain.chainId,
    providerReceiverChain,
    contracts,
  );

  const drawDispatcher = getContract('DrawDispatcher', chainId, provider, contracts);
  const drawExecutor = getContract(
    'DrawExecutor',
    receiverChain.chainId,
    providerReceiverChain,
    contracts,
  );

  if (!drawBuffer || !receiverDrawBuffer || !drawDispatcher || !drawExecutor) {
    throw new Error('Contract Unavailable: Check ContractList and Provider Configuration');
  }

  const singleMessageDispatcherAddress = getSingleMessageDispatcherContractAddress(
    chainId,
    receiverChain.chainId,
  );

  if (await shouldDispatchNewestDraw(drawBuffer, receiverDrawBuffer)) {
    return await drawDispatcher.populateTransaction.dispatchNewestDraw(
      singleMessageDispatcherAddress,
      receiverChain.chainId,
      drawExecutor.address,
    );
  } else {
    console.log('No Draw Id to dispatch');
  }
}
