import { Relayer } from 'defender-relay-client';
import { DefenderRelayProvider, DefenderRelaySigner } from 'defender-relay-client/lib/ethers';
import {
  getContracts,
  getProviderUrl,
  getProviderUrlOptions,
  isMainnet,
  isTestnet,
  MAINNET_CHAIN_IDS,
  TESTNET_CHAIN_IDS,
  ProviderUrlOptions,
  receiverDrawLockAndNetworkTotalSupplyPush,
  Secrets,
} from '@pooltogether/v4-autotasks-library';
import { mainnet, testnet } from '@pooltogether/v4-pool-data';

const getPrizePoolNetworkChains = (chainIds: number[], secrets: Secrets): ProviderUrlOptions[] => {
  return chainIds.map((chainId) => {
    return getProviderUrlOptions(chainId, secrets);
  });
};

const getConfig = (chainId: number, secrets: Secrets) => {
  if (isMainnet(chainId)) {
    return {
      beaconChain: getProviderUrlOptions(1, secrets),
      prizePoolNetworkChains: getPrizePoolNetworkChains(MAINNET_CHAIN_IDS, secrets),
    };
  } else if (isTestnet(chainId)) {
    return {
      beaconChain: getProviderUrlOptions(5, secrets),
      prizePoolNetworkChains: getPrizePoolNetworkChains(TESTNET_CHAIN_IDS, secrets),
    };
  } else {
    throw new Error(`getConfig: Unsupported network ${chainId}`);
  }
};

export async function handler(event: any) {
  const provider = new DefenderRelayProvider(event);
  const signer = new DefenderRelaySigner(event, provider, { speed: 'fast' });
  const relayer = new Relayer(event);

  const chainId = Number(process.env.RECEIVER_CHAIN_ID);
  const contracts = getContracts(chainId, mainnet, testnet);

  const { beaconChain, prizePoolNetworkChains } = getConfig(chainId, event.secrets);

  try {
    const transactionPopulated = await receiverDrawLockAndNetworkTotalSupplyPush(
      contracts,
      beaconChain,
      {
        chainId,
        provider: signer,
      },
      prizePoolNetworkChains,
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
      throw new Error('ReceiverTimelockTrigger: Transaction not populated');
    }
  } catch (error) {
    throw new Error(error);
  }
}
