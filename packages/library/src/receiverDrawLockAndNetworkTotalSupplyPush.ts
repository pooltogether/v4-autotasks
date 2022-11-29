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
  beaconChain: ProviderUrlOptions,
  receiverChain: ProviderOptions,
  prizePoolNetworkChains: ProviderUrlOptions[],
): Promise<PopulatedTransaction | undefined> {
  const { chainId, provider } = receiverChain;

  let providerBeaconChain: JsonRpcProvider;

  if (beaconChain.providerUrl) {
    providerBeaconChain = new JsonRpcProvider(beaconChain.providerUrl);
  } else {
    throw new Error('Beacon Unavailable: check providerUrl configuration');
  }

  /* ==========================================================================================*/
  // Initializing Contracts using the Beacon/Receiver/SecondaryReceiver chain configurations
  /* ========================================================================================== */

  //  Beacon Chain Contracts
  const drawBufferBeaconChain = getContract(
    'DrawBuffer',
    beaconChain.chainId,
    providerBeaconChain,
    contracts,
  );
  const prizeTierHistoryBeaconChain = getContract(
    'PrizeTierHistory',
    beaconChain.chainId,
    providerBeaconChain,
    contracts,
  );
  const prizeDistributionBufferBeaconChain = getContract(
    'PrizeDistributionBuffer',
    beaconChain.chainId,
    providerBeaconChain,
    contracts,
  );

  //  Receiver Chain Contracts
  const ticketReceiverChain = getContract('Ticket', chainId, provider, contracts);

  const prizeDistributionBufferReceiverChain = getContract(
    'PrizeDistributionBuffer',
    chainId,
    provider,
    contracts,
  );

  const drawCalculatorTimelockReceiverChain = getContract(
    'DrawCalculatorTimelock',
    chainId,
    provider,
    contracts,
  );

  const receiverTimelockTrigger = getContract(
    'ReceiverTimelockTrigger',
    chainId,
    provider,
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
    console.log('No Draw to LockAndPush');
  }
}
