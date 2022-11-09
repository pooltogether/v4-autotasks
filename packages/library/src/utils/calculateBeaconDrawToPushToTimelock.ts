import { Contract } from '@ethersproject/contracts';
import { Draw } from '../types';

export async function calculateBeaconDrawToPushToTimelock(
  drawBufferBeaconChain: Contract,
  prizeDistributionBufferBeaconChain: Contract,
) {
  let drawNewestFromBeaconChain: Draw;
  let drawIdToFetch: number = 0;
  let newestPrizeDistributionDrawId: number = 0;
  let lockAndPush: Boolean = false;

  /**
   * Fetch Draw newest from Beacon Chain
   * IF the fetch throws an error, the DrawBuffer is not initialized
   */
  try {
    drawNewestFromBeaconChain = await drawBufferBeaconChain.getNewestDraw();
  } catch (error) {
    throw new Error('BeaconChain: DrawBuffer is not initialized');
  }

  /**
   * Fetch PrizeDistribution newest from Beacon Chain
   * IF the fetch throws an error, the PrizeDistribution is not initialized
   */
  try {
    const { drawId } = await prizeDistributionBufferBeaconChain.getNewestPrizeDistribution();
    newestPrizeDistributionDrawId = drawId;
  } catch (error) {
    newestPrizeDistributionDrawId = 0;
  }

  /**
   * IF the PrizeDistribution is behind the DrawBuffer
   */
  if (newestPrizeDistributionDrawId < drawNewestFromBeaconChain.drawId) {
    lockAndPush = true;
    drawIdToFetch = newestPrizeDistributionDrawId + 1;
    console.log('DrawBuffer Newest Draw: ', drawNewestFromBeaconChain);
    console.log(
      'PrizeDistributionBuffer newest PrizeDistribution DrawID: ',
      newestPrizeDistributionDrawId,
    );
  }

  return {
    lockAndPush,
    drawIdToFetch,
  };
}
