import { BigNumber } from '@ethersproject/bignumber';
const debug = require('debug')('v4-js-core:calculatePicksFromAverageTotalSuppliesBetween');

export function calculatePicksFromAverageTotalSuppliesBetween(
  totalPicks: number,
  ticketPrimaryTotalSupply: BigNumber,
  otherTicketsTotalSupply: BigNumber,
): BigNumber {
  if (
    !BigNumber.isBigNumber(ticketPrimaryTotalSupply) ||
    !BigNumber.isBigNumber(otherTicketsTotalSupply)
  )
    return BigNumber.from(0);
  let numberOfPicks;
  if (ticketPrimaryTotalSupply.gt('0')) {
    numberOfPicks = ticketPrimaryTotalSupply
      .mul(totalPicks)
      .div(otherTicketsTotalSupply.add(ticketPrimaryTotalSupply));
  } else {
    numberOfPicks = BigNumber.from('0');
  }
  debug(
    `calculatePicksFromAverageTotalSuppliesBetween:numberOfPicks ${Math.floor(
      numberOfPicks.toNumber(),
    )}`,
  );
  return BigNumber.from(Math.floor(numberOfPicks.toNumber()));
}

export default calculatePicksFromAverageTotalSuppliesBetween;
