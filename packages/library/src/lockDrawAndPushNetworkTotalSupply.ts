import { Contract, PopulatedTransaction } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ContractsBlob, ProviderOptions, ProviderUrlOptions } from './types';
import {
  calculateDrawTimestamps,
  calculateDrawToPushToTimelock,
  getContract,
  getMultiTicketAverageTotalSuppliesBetween,
  sumBigNumbers,
} from './utils';

const debug = require('debug')('pt-autotask-lib');

export async function lockDrawAndPushNetworkTotalSupply(
  contracts: ContractsBlob,
  chain: ProviderOptions,
  prizePoolNetworkChains: ProviderUrlOptions[],
): Promise<PopulatedTransaction | undefined> {
  const { chainId, provider } = chain;

  const drawBuffer = getContract('DrawBuffer', chainId, provider, contracts);
  const prizeTierHistory = getContract('PrizeTierHistory', chainId, provider, contracts);
  const prizeDistributionBuffer = getContract(
    'PrizeDistributionBuffer',
    chainId,
    provider,
    contracts,
  );

  const beaconTimelockTrigger = getContract('BeaconTimelockTrigger', chainId, provider, contracts);

  const ticket = getContract('Ticket', chainId, provider, contracts);

  if (
    !drawBuffer ||
    !prizeTierHistory ||
    !prizeDistributionBuffer ||
    !beaconTimelockTrigger ||
    !ticket
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

  const { lockAndPush, drawIdToFetch } = await calculateDrawToPushToTimelock(
    drawBuffer,
    prizeDistributionBuffer,
  );

  /**
   * The calculateDrawToPushToTimelock calculate whether a Draw needs to be locked and pushed.
   * IF a Draw and PrizeDistribution need to be locked/pushed we fetch the required data from multiple networks.
   */
  if (lockAndPush) {
    const drawToPush = await drawBuffer.getDraw(drawIdToFetch);
    const prizeTier = await prizeTierHistory.getPrizeTier(drawIdToFetch);
    const [startTime, endTime] = calculateDrawTimestamps(prizeTier, drawToPush);
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
    debug('Draw: ', drawToPush);
    debug('TotalNetworkSupply: ', totalNetworkTicketSupply);

    return await beaconTimelockTrigger.populateTransaction.push(
      drawToPush,
      totalNetworkTicketSupply,
    );
  } else {
    throw new Error('No Draw to LockAndPush');
  }
}
