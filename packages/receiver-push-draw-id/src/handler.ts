import { Relayer } from 'defender-relay-client';
import { DefenderRelayProvider, DefenderRelaySigner } from 'defender-relay-client/lib/ethers';
import {
  receiverPushDrawId,
  getContracts,
  getProviderUrlOptions,
  isMainnet,
  isTestnet,
  Secrets,
} from '@pooltogether/v4-autotasks-library';
import { mainnet, testnet } from '@pooltogether/v4-pool-data';

const getBeaconChainConfig = (chainId: number, secrets: Secrets) => {
  if (isMainnet(chainId)) {
    return getProviderUrlOptions(1, secrets);
  } else if (isTestnet(chainId)) {
    return getProviderUrlOptions(5, secrets);
  } else {
    throw new Error(`getConfig: Unsupported network ${chainId}`);
  }
};

export async function handler(event: any) {
  const provider = new DefenderRelayProvider(event);
  const signer = new DefenderRelaySigner(event, provider, { speed: 'fast' });
  const relayer = new Relayer(event);

  const chainId = Number(process.env.CHAIN_ID);
  const contracts = getContracts(chainId, mainnet, testnet);
  const beaconChain = getBeaconChainConfig(chainId, event.secrets);

  try {
    const transactionPopulated = await receiverPushDrawId(contracts, beaconChain, {
      chainId,
      provider: signer,
    });

    if (transactionPopulated) {
      let transactionSentToNetwork = await relayer.sendTransaction({
        data: transactionPopulated.data,
        to: transactionPopulated.to,
        gasLimit: 500000,
        speed: 'fast',
      });

      console.log(`TransactionHash: ${transactionSentToNetwork.hash}`);
    } else {
      console.log('Error sending transaction');
    }
  } catch (error) {
    throw new Error(error);
  }
}
