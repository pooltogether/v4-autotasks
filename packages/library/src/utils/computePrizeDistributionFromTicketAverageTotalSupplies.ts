import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { Draw, PrizeDistribution, PrizeTier } from '../types';
import { calculatePicksFromAverageTotalSuppliesBetween } from './calculatePicksFromAverageTotalSuppliesBetween';
import { computeCardinality } from './computeCardinality';
import { sumBigNumbers } from './sumBigNumbers';
const debug = require('debug')('pt-autotask-lib');

export async function computePrizeDistributionFromTicketAverageTotalSupplies(
  draw: Draw,
  prizeTier?: PrizeTier,
  ticketPrimaryAverageTotalSupply?: BigNumberish,
  ticketSecondaryListAverageTotalSupply?: Array<BigNumberish>,
  decimals: BigNumberish = 18,
): Promise<PrizeDistribution | undefined> {
  debug('computePrizeDistributionFromTicketAverageTotalSupplies:ENTER');
  if (
    !draw ||
    !prizeTier ||
    !ticketPrimaryAverageTotalSupply ||
    !ticketSecondaryListAverageTotalSupply
  ) {
    return undefined;
  }
  debug('computePrizeDistributionFromTicketAverageTotalSupplies:STATUS:GOOD');

  const { beaconPeriodSeconds } = draw;
  const { expiryDuration, bitRangeSize, maxPicksPerUser, endTimestampOffset, tiers, prize } =
    prizeTier;

  const ticketPrimaryAverageTotalSupplyBigNumber = BigNumber.from(ticketPrimaryAverageTotalSupply);

  debug(
    'computePrizeDistributionFromTicketAverageTotalSupplies:ticketPrimaryAverageTotalSupplyBigNumber: ',
    ticketPrimaryAverageTotalSupplyBigNumber,
  );

  const ticketSecondaryListAverageTotalSupplyBigNumber = ticketSecondaryListAverageTotalSupply.map(
    BigNumber.from,
  );
  debug(
    'computePrizeDistributionFromTicketAverageTotalSupplies:ticketSecondaryListAverageTotalSupplyBigNumber: ',
    ticketSecondaryListAverageTotalSupplyBigNumber,
  );

  // Sums the ALL ticket average total supplies.
  const totalAverageSupplies = sumBigNumbers([
    ticketPrimaryAverageTotalSupplyBigNumber,
    ...ticketSecondaryListAverageTotalSupplyBigNumber,
  ]);
  debug(
    'computePrizeDistributionFromTicketAverageTotalSupplies:totalAverageSupplies: ',
    totalAverageSupplies,
  );

  // Sums ALL SECONDARY ticket average total supplies.
  const secondaryTotalAverageSupplies = sumBigNumbers(
    ticketSecondaryListAverageTotalSupplyBigNumber,
  );
  debug(
    'computePrizeDistributionFromTicketAverageTotalSupplies:secondaryTotalAverageSupplies: ',
    secondaryTotalAverageSupplies,
  );

  const matchCardinality = computeCardinality(
    BigNumber.from(bitRangeSize),
    totalAverageSupplies,
    BigNumber.from(decimals),
  );

  debug(
    'computePrizeDistributionFromTicketAverageTotalSupplies:matchCardinality: ',
    matchCardinality,
  );

  let numberOfPicks = BigNumber.from(0);
  const totalPicks = BigNumber.from(BigNumber.from(2).pow(bitRangeSize)).pow(matchCardinality);
  debug('computePrizeDistributionFromTicketAverageTotalSupplies:totalPicks: ', totalPicks);

  if (totalAverageSupplies.gt('0')) {
    numberOfPicks = calculatePicksFromAverageTotalSuppliesBetween(
      totalPicks.toNumber(),
      BigNumber.from(ticketPrimaryAverageTotalSupply),
      secondaryTotalAverageSupplies,
    );
  }

  debug('computePrizeDistributionFromTicketAverageTotalSupplies:numberOfPicks: ', numberOfPicks);

  const prizeDistribution: PrizeDistribution = {
    bitRangeSize: bitRangeSize,
    matchCardinality,
    tiers: tiers,
    maxPicksPerUser: maxPicksPerUser,
    expiryDuration,
    numberOfPicks: BigNumber.from(numberOfPicks),
    startTimestampOffset: beaconPeriodSeconds,
    prize: prize,
    endTimestampOffset,
  };
  debug(
    `computePrizeDistributionFromTicketAverageTotalSupplies:prizeDistribution: `,
    prizeDistribution,
  );

  debug(
    'computePrizeDistributionFromTicketAverageTotalSupplies:computePrizeDistributionFromTicketAverageTotalSupplies:EXIT',
  );
  return prizeDistribution;
}
