import { Contract } from '@ethersproject/contracts';

/**
 * Fetches the latest drawId from the drawBeacon on the beacon chain
 * and determine if it should be dispatched to the receiver chain.
 * PoolTogether v4 v1.3.0 Architecture
 * @param drawBuffer
 * @param prizeDistributionBuffer
 * @returns
 */
export async function shouldDispatchNewestDraw(drawBuffer: Contract, receiverDrawBuffer: Contract) {
  let beaconNewestDrawId: number;
  let receiverNewestDrawId: number;
  let shouldDispatchNewestDrawId = false;

  /**
   * Fetch newest drawId from the beacon chain
   * IF the fetch throws an error, the DrawBuffer is not initialized
   */
  try {
    beaconNewestDrawId = (await drawBuffer.getNewestDraw()).drawId;
  } catch (error) {
    throw new Error('DrawBuffer on beacon chain is not initialized');
  }

  /**
   * Fetch newest drawId from the receiver chain
   * IF the fetch throws an error, the DrawBuffer is not initialized
   */
  try {
    receiverNewestDrawId = (await receiverDrawBuffer.getNewestDraw()).drawId;
  } catch (error) {
    console.log('DrawBuffer on receiver chain is not initialized');
  }

  console.log(`Beacon DrawBuffer: Newest drawId: ${beaconNewestDrawId}`);
  console.log(`Receiver DrawBuffer: Newest drawId: ${receiverNewestDrawId}`);

  /**
   * IF the PrizeDistribution is behind the DrawBuffer by one draw
   */
  if (receiverNewestDrawId === beaconNewestDrawId - 1) {
    shouldDispatchNewestDrawId = true;

    console.log(`Dispatching drawId ${beaconNewestDrawId} to receiver chain...`);
  } else if (receiverNewestDrawId < beaconNewestDrawId) {
    throw new Error(
      `Receiver DrawBuffer is late by ${
        beaconNewestDrawId - receiverNewestDrawId
      } draws.\nDispatch draws manually by calling dispatchDraws.`,
    );
  } else {
    console.log('Draws are in sync.');
  }

  return shouldDispatchNewestDrawId;
}
