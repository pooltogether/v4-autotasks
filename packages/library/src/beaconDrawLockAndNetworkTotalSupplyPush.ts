import { Contract, PopulatedTransaction } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ContractsBlob, ProviderOptions, ProviderUrlOptions } from './types';
import {
  calculateDrawTimestamps,
  calculateBeaconDrawToPushToTimelock,
  getContract,
  getMultiTicketAverageTotalSuppliesBetween,
  sumBigNumbers,
} from './utils';

const debug = require('debug')('pt-autotask-lib');

export async function beaconDrawLockAndNetworkTotalSupplyPush(
  contracts: ContractsBlob,
  beaconChain: ProviderOptions,
  prizePoolNetworkChains: ProviderUrlOptions[],
): Promise<PopulatedTransaction | undefined> {
  const { chainId, provider } = beaconChain;

  /* ==========================================================================================*/
  // Initializing Contracts using the Beacon/Receiver/SecondaryReceiver chain configurations
  /* ========================================================================================== */
  const drawBufferBeaconChain = getContract('DrawBuffer', chainId, provider, contracts);
  const prizeTierHistoryBeaconChain = getContract('PrizeTierHistory', chainId, provider, contracts);
  const prizeDistributionBufferBeaconChain = getContract(
    'PrizeDistributionBuffer',
    chainId,
    provider,
    contracts,
  );
  const beaconTimelockAndPushRouter = getContract(
    'BeaconTimelockTrigger',
    chainId,
    provider,
    contracts,
  );
  const ticketBeaconChain = getContract('Ticket', chainId, provider, contracts);

  if (
    !drawBufferBeaconChain ||
    !prizeTierHistoryBeaconChain ||
    !prizeDistributionBufferBeaconChain ||
    !beaconTimelockAndPushRouter ||
    !ticketBeaconChain
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

  const { lockAndPush, drawIdToFetch } = await calculateBeaconDrawToPushToTimelock(
    drawBufferBeaconChain,
    prizeDistributionBufferBeaconChain,
  );

  /**
   * The calculateBeaconDrawToPushToTimelock calculate whether a Draw needs to be locked and pushed.
   * IF a Draw and PrizeDistribution need to be locked/pushed we fetch the required data from multiple networks.
   */
  if (lockAndPush) {
    const drawFromBeaconChainToPush = await drawBufferBeaconChain.getDraw(drawIdToFetch);
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
    debug('Draw: ', drawFromBeaconChainToPush);
    debug('TotalNetworkSupply: ', totalNetworkTicketSupply);

    return await beaconTimelockAndPushRouter.populateTransaction.push(
      drawFromBeaconChainToPush,
      totalNetworkTicketSupply,
    );
  } else {
    throw new Error('No Draw to LockAndPush');
  }
}
