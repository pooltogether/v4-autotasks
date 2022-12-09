import { Contract } from '@ethersproject/contracts';
import { Draw } from '../types';

/**
 * Fetches the latest draw id from the draw buffer and increments it by 1.
 * PoolTogether v4 v1.3.0 Architecture
 * @param drawBuffer
 * @param prizeDistributionBuffer
 * @returns
 */
export async function fetchDrawIdToPush(drawBuffer: Contract, prizeDistributionBuffer: Contract) {
  let newestDraw: Draw;
  let drawIdToPush = 0;
  let newestPrizeDistributionDrawId = 0;
  let shouldPush = false;

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
    shouldPush = true;
    drawIdToPush = newestPrizeDistributionDrawId + 1;

    console.log(`DrawBuffer Newest Draw: ${newestDraw}`);
    console.log(
      `PrizeDistributionBuffer newest PrizeDistribution DrawID: ${newestPrizeDistributionDrawId}`,
    );
  }

  return {
    shouldPush,
    drawIdToPush,
  };
}
