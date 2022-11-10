import { PopulatedTransaction } from '@ethersproject/contracts';
import { ContractsBlob, ProviderOptions } from './types';
import { getContract } from './utils';

const debug = require('debug')('pt-autotask-lib');

export async function drawBeaconHandleDrawStartAndComplete(
  contracts: ContractsBlob,
  config: ProviderOptions,
): Promise<PopulatedTransaction | undefined> {
  const { chainId, provider } = config;

  const drawBeacon = getContract('DrawBeacon', chainId, provider, contracts);

  if (!drawBeacon) {
    throw new Error('DrawBeacon: Contract Unavailable');
  }

  const nextDrawId = await drawBeacon.getNextDrawId();
  const beaconPeriodStartedAt = await drawBeacon.getBeaconPeriodStartedAt();
  const isRngRequested = await drawBeacon.isRngRequested();
  const isBeaconPeriodOver = await drawBeacon.isRngRequested();
  const beaconPeriodSeconds = await drawBeacon.getBeaconPeriodSeconds();
  const canStartDraw = await drawBeacon.canStartDraw();
  const canCompleteDraw = await drawBeacon.canCompleteDraw();

  // Debug Contract Request Parameters
  debug('DrawBeacon next Draw.drawId:', nextDrawId);
  debug('DrawBeacon Beacon PeriodStartedAt:', beaconPeriodStartedAt.toString());
  debug('DrawBeacon Beacon PeriodSeconds:', beaconPeriodSeconds.toString());
  debug('DrawBeacon Beacon PeriodOver:', isBeaconPeriodOver);
  debug('Is RNG Requested:', isRngRequested);
  debug('Can Start Draw:', canStartDraw);
  debug('Can Complete Draw:', canCompleteDraw);

  let transactionPopulated: PopulatedTransaction | undefined;

  if (await drawBeacon.canStartDraw()) {
    console.log('DrawBeacon: Starting Draw');
    transactionPopulated = await drawBeacon.populateTransaction.startDraw();
  }

  if (await drawBeacon.canCompleteDraw()) {
    console.log('DrawBeacon: Completing Draw');
    transactionPopulated = await drawBeacon.populateTransaction.completeDraw();
  }

  return transactionPopulated;
}
