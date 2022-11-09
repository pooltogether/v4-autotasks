import { PopulatedTransaction } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ContractsBlob, BeaconChainConfig } from './types';
import { getContract } from './utils';

const debug = require('debug')('pt-autotask-lib');

export async function drawBeaconHandleDrawStartAndComplete(
  contracts: ContractsBlob,
  config: BeaconChainConfig,
): Promise<PopulatedTransaction | undefined> {
  let providerBeaconChain;
  if (config?.beaconChain?.providerUrl) {
    providerBeaconChain = new JsonRpcProvider(config.beaconChain.providerUrl);
  } else {
    throw new Error('No Beacon Chain Provider URL');
  }

  const drawBeacon = getContract(
    'DrawBeacon',
    config.beaconChain.chainId,
    providerBeaconChain,
    contracts,
  );
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
  // Action : Can Start Draw
  if (await drawBeacon.canStartDraw()) {
    console.log('DrawBeacon: Starting Draw');
    transactionPopulated = await drawBeacon.populateTransaction.startDraw();
  }

  // Action : Can Complete Draw
  if (await drawBeacon.canCompleteDraw()) {
    console.log('DrawBeacon: Completing Draw');
    transactionPopulated = await drawBeacon.populateTransaction.completeDraw();
  }

  return transactionPopulated;
}
