import { Contract, PopulatedTransaction } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ContractsBlob, ProviderOptions, ProviderUrlOptions } from './types';
import {
  calculateDrawTimestamps,
  calculateReceiverDrawToPushToTimelock,
  getContract,
  getMultiTicketAverageTotalSuppliesBetween,
  sumBigNumbers,
} from './utils';

const debug = require('debug')('pt-autotask-lib');

export async function receiverDrawLockAndNetworkTotalSupplyPush(
  contracts: ContractsBlob,
  beaconChain: ProviderOptions,
  receiverChain: ProviderUrlOptions,
  prizePoolNetworkChains: ProviderUrlOptions[],
): Promise<PopulatedTransaction | undefined> {
  const { chainId, provider } = beaconChain;
  let providerReceiverChain;

  if (receiverChain.providerUrl && receiverChain.chainId) {
    providerReceiverChain = new JsonRpcProvider(receiverChain.providerUrl);
  } else {
    throw new Error('Receiver Unavailable: check providerUrl configuration');
  }

  /* ==========================================================================================*/
  // Initializing Contracts using the Beacon/Receiver/SecondaryReceiver chain configurations
  /* ========================================================================================== */

  //  Beacon Chain Contracts
  const drawBufferBeaconChain = getContract('DrawBuffer', chainId, provider, contracts);
  const prizeTierHistoryBeaconChain = getContract('PrizeTierHistory', chainId, provider, contracts);
  const prizeDistributionBufferBeaconChain = getContract(
    'PrizeDistributionBuffer',
    chainId,
    provider,
    contracts,
  );

  //  Receiver Chain Contracts
  const ticketReceiverChain = getContract(
    'Ticket',
    receiverChain.chainId,
    providerReceiverChain,
    contracts,
  );
  const prizeDistributionBufferReceiverChain = getContract(
    'PrizeDistributionBuffer',
    receiverChain.chainId,
    providerReceiverChain,
    contracts,
  );
  const drawCalculatorTimelockReceiverChain = getContract(
    'DrawCalculatorTimelock',
    receiverChain.chainId,
    providerReceiverChain,
    contracts,
  );
  const receiverTimelockTrigger = getContract(
    'ReceiverTimelockTrigger',
    receiverChain.chainId,
    providerReceiverChain,
    contracts,
  );

  if (
    !drawBufferBeaconChain ||
    !prizeTierHistoryBeaconChain ||
    !prizeDistributionBufferBeaconChain ||
    !prizeDistributionBufferReceiverChain ||
    !drawCalculatorTimelockReceiverChain ||
    !receiverTimelockTrigger ||
    !ticketReceiverChain
  ) {
    throw new Error('Contract Unavailable: Check ContractList and Provider Configuration');
  }

  let otherTicketContracts: Array<Contract | undefined> | undefined = prizePoolNetworkChains.map(
    (otherTicket) => {
      return getContract(
        'Ticket',
        otherTicket.chainId,
        new JsonRpcProvider(otherTicket.providerUrl),
        contracts,
      );
    },
  );

  /* ============================================================ */
  // Fetching data from Beacon/Receiver/SecondaryReceiver Chains
  /* ============================================================ */
  const { drawFromBeaconChainToPush, drawIdToFetch, lockAndPush } =
    await calculateReceiverDrawToPushToTimelock(
      drawBufferBeaconChain,
      prizeDistributionBufferBeaconChain,
      prizeDistributionBufferReceiverChain,
      drawCalculatorTimelockReceiverChain,
    );

  /**
   * The calculateReceiverDrawToPushToTimelock calculate whether a Draw needs to be locked and pushed.
   * IF a Draw and PrizeDistribution need to be locked/pushed we fetch the required data from multiple networks.
   */
  if (lockAndPush) {
    const prizeTier = await prizeTierHistoryBeaconChain.getPrizeTier(drawIdToFetch);

    const [startTime, endTime] = calculateDrawTimestamps(prizeTier, drawFromBeaconChainToPush);

    const allTicketAverageTotalSupply = await getMultiTicketAverageTotalSuppliesBetween(
      otherTicketContracts,
      startTime,
      endTime,
    );

    debug('allTicketAverageTotalSupply', allTicketAverageTotalSupply);

    if (!allTicketAverageTotalSupply || allTicketAverageTotalSupply.length === 0) {
      throw new Error('No Ticket data available');
    }

    const totalNetworkTicketSupply = sumBigNumbers(allTicketAverageTotalSupply);
    return await receiverTimelockTrigger.populateTransaction.push(
      drawFromBeaconChainToPush,
      totalNetworkTicketSupply,
    );
  } else {
    throw new Error('No Draw to LockAndPush');
  }
}
