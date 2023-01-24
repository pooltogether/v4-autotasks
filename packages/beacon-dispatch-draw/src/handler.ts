import { Relayer } from 'defender-relay-client';
import { DefenderRelayProvider, DefenderRelaySigner } from 'defender-relay-client/lib/ethers';
import {
  beaconDispatchNewestDraw,
  getContracts,
  getProviderUrlOptions,
  Secrets,
} from '@pooltogether/v4-autotasks-library';
import { mainnet, testnet } from '@pooltogether/v4-pool-data';

export async function handler(event: any) {
  const secrets: Secrets = event.secrets;
  const provider = new DefenderRelayProvider(event);
  const signer = new DefenderRelaySigner(event, provider, { speed: 'fast' });
  const relayer = new Relayer(event);

  const chainId = Number(process.env.CHAIN_ID);
  const contracts = getContracts(chainId, mainnet, testnet);

  const beaconChain = {
    chainId,
    provider: signer,
  };

  const receiverChain = getProviderUrlOptions(Number(process.env.RECEIVER_CHAIN_ID), secrets);

  try {
    const transactionPopulated = await beaconDispatchNewestDraw(
      contracts,
      beaconChain,
      receiverChain,
    );

    if (transactionPopulated) {
      let transactionSentToNetwork = await relayer.sendTransaction({
        data: transactionPopulated.data,
        to: transactionPopulated.to,
        gasLimit: 500000,
        speed: 'fast',
      });

      console.log(`TransactionHash: ${transactionSentToNetwork.hash}`);
    } else {
      console.log('DrawDispatcher: Transaction not populated');
    }
  } catch (error) {
    throw new Error(error);
  }
}
