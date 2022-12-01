import { Contract } from '@ethersproject/contracts';
import { Draw } from '../types';

export async function calculateDrawToPushToTimelock(
  drawBuffer: Contract,
  drawCalculatorTimelock: Contract,
  prizeDistributionBuffer: Contract,
) {
  let newestDraw: Draw;
  let drawIdToFetch = 0;
  let newestPrizeDistributionDrawId = 0;
  let lockAndPush = false;

  const hasTimelockElapsed = await drawCalculatorTimelock.hasElapsed();

  /**
   * Check if timelock has elapsed.
   * If not, we return early since the transaction would fail.
   */
  if (!hasTimelockElapsed) {
    console.log('DrawCalculatorTimelock: timelock has not elapsed.');

    return {
      lockAndPush,
      drawIdToFetch,
    };
  }

  /**
   * Fetch newest Draw
   * IF the fetch throws an error, the DrawBuffer is not initialized
   */
  try {
    newestDraw = await drawBuffer.getNewestDraw();
  } catch (error) {
    throw new Error('DrawBuffer is not initialized');
  }

  /**
   * Fetch newest PrizeDistribution
   * IF the fetch throws an error, the PrizeDistribution is not initialized
   */
  try {
    const { drawId } = await prizeDistributionBuffer.getNewestPrizeDistribution();
    newestPrizeDistributionDrawId = drawId;
  } catch (error) {
    console.log('PrizeDistribution is not initialized');
  }

  /**
   * IF the PrizeDistribution is behind the DrawBuffer
   */
  if (newestPrizeDistributionDrawId < newestDraw.drawId) {
    lockAndPush = true;
    drawIdToFetch = newestPrizeDistributionDrawId + 1;

    console.log(
      `PrizeDistributionBuffer newest PrizeDistribution DrawID: ${newestPrizeDistributionDrawId}`,
    );

    console.log(`DrawBuffer Newest Draw: ${newestDraw}`);
  }

  return {
    lockAndPush,
    drawIdToFetch,
  };
}
