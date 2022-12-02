import { Contract } from '@ethersproject/contracts';

const debug = require('debug')('pt-autotask-lib');

/**
 * Fetches the latest draw ids from the beacon and receiver chain draw buffers and returns the next draw id to push to the receiver chain.
 * PoolTogether v4 v1.3.0 Architecture
 * @param drawBufferBeaconChain
 * @param prizeDistributionBufferBeaconChain
 * @param prizeDistributionBufferReceiverChain
 * @returns
 */
export async function fetchReceiverDrawIdToPush(
  drawBufferBeaconChain: Contract,
  prizeDistributionBufferBeaconChain: Contract,
  prizeDistributionBufferReceiverChain: Contract,
) {
  let oldestDrawIdFromBeaconChain = 0;
  let newestDrawIdFromBeaconChain = 0;

  try {
    const drawNewestFromBeaconChain = await drawBufferBeaconChain.getNewestDraw();
    newestDrawIdFromBeaconChain = drawNewestFromBeaconChain.drawId;
    debug(drawNewestFromBeaconChain);
  } catch (error) {
    throw new Error(`BeaconChain: DrawBuffer is not initialized:\n${error}`);
  }
  let shouldPush: Boolean = false;
  let newestDrawIdFromReceiverChain = 0;
  try {
    const { drawId: drawIdNewestFromReceiverChain } =
      await prizeDistributionBufferReceiverChain.getNewestPrizeDistribution();
    newestDrawIdFromReceiverChain = drawIdNewestFromReceiverChain;
  } catch (e) {
    // IF no prize distribution exists on the RECEIVER chain, the RPC call will throw an error.
    // IF no PrizeDistribution struct exists we know that the ReceiverChain PrizeDistributionBuffer has not been initialized yet.
    const { drawId: drawIdNewestFromBeaconChain } =
      await prizeDistributionBufferBeaconChain.getNewestPrizeDistribution();
    newestDrawIdFromBeaconChain = drawIdNewestFromBeaconChain;

    const { drawId: drawIdOldestFromBeaconChain } =
      await prizeDistributionBufferBeaconChain.getOldestPrizeDistribution();
    oldestDrawIdFromBeaconChain = drawIdOldestFromBeaconChain;
  }
  debug(`ReceiverChain: Newest PrizeDistribution Draw ID is ${newestDrawIdFromReceiverChain}`);
  debug(newestDrawIdFromBeaconChain);

  debug('oldestBeaconChainDrawId: ', oldestDrawIdFromBeaconChain);
  debug('newestBeaconChainDrawId: ', newestDrawIdFromBeaconChain);
  debug('newestReceiverChainDrawId: ', newestDrawIdFromReceiverChain);

  /**
   * Depending on the state of the Beacon and Receiver chain, existing prize distributions may NOT required on the Receiver chain.
   * State 0: The Beacon and Receiver chains have not been initialized.
   * State 1: Beacon chain is 1 draw ahead of the Receiver chain.
   * State 2: Beacon chain is 2 draws ahead of an uninitialized Receiver chain.
   * State 3: Beacon chain is 2 draws ahead of an initialized Receiver chain.
   * State 4: Beacon chain and Receiver chain draws are identic.
   */

  if (oldestDrawIdFromBeaconChain === 0 && newestDrawIdFromBeaconChain === 0) {
    throw new Error('BeaconChainPrizeDistributionBuffer/no-prize-distribution-buffer-available');
  }

  let drawIdToPush = 0;

  if (newestDrawIdFromBeaconChain === newestDrawIdFromReceiverChain + 1) {
    /**
     * IF the Beacon chain has exactly 1 more draw and than Receiver chain we can
     * PUSH the NEWEST draw from the Beacon chain to the Receiver chain.
     * @dev This includes the case where the Receiver chain has 0 draws and the Beacon chain has 1 draws.
     * @dev This includes the case where the Receiver chain has 1 draw and the Beacon chain has 2 draws.
     * @dev When the Receiver is staying in sync with the Beacon chain we can request the newest draw from the Beacon chain.
     */
    drawIdToPush = newestDrawIdFromBeaconChain;
    shouldPush = true;
  } else if (newestDrawIdFromBeaconChain > 1 && newestDrawIdFromReceiverChain === 0) {
    /**
     * IF the Beacon chain has 2 or more draws and the Receiver chain is NOT initialized, we can
     * PUSH the NEWEST draw from the Beacon chain to the Receiver chain.
     * @dev This scenario is likely to occur if a new PrizePool is created on the Receiver chain, after a Beacon chain has
     *      been previously initialized with 2 or more draws.
     *      We're assuming the Receiver chain has no need to sync with previous Beacon chain Draws/PrizeDistributions
     *      because the Receiver chain PrizePool DID NOT exist yet when the parameters were created.
     */
    drawIdToPush = newestDrawIdFromBeaconChain;
    shouldPush = true;
  } else if (
    newestDrawIdFromBeaconChain > newestDrawIdFromReceiverChain + 1 &&
    newestDrawIdFromReceiverChain > 0
  ) {
    /**
     * IF the Beacon chain is 2 draws ahead of the Receiver chain AFTER the Receiver has been initialized and synced, we can
     * PUSH a Draw between the OLDEST and NEWEST from the Beacon chain to the Receiver chain.
     * @dev This scenario is likely to occur if the Receiver chain missed a draw from the Beacon chain
     *      and needs to catch up to Beacon chain, since it was previously in sync.
     */
    drawIdToPush = newestDrawIdFromReceiverChain + 1;
    shouldPush = true;
  } else if (newestDrawIdFromBeaconChain === newestDrawIdFromReceiverChain) {
    console.log('No Draw ID to push.');
    console.log(`Beacon chain draw ID: ${newestDrawIdFromBeaconChain}`);
    console.log(`Receiver chain draw ID: ${newestDrawIdFromReceiverChain}`);
  }

  debug('DrawID: ', drawIdToPush);

  return {
    drawIdToPush,
    shouldPush,
  };
}
