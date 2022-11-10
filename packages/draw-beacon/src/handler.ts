import { Relayer, RelayerParams } from 'defender-relay-client';
import { DefenderRelayProvider, DefenderRelaySigner } from 'defender-relay-client/lib/ethers';
import {
  drawBeaconHandleDrawStartAndComplete,
  ContractsBlob,
  isMainnet,
  isTestnet,
} from '@pooltogether/v4-autotasks-library';
import { mainnet, testnet } from '@pooltogether/v4-pool-data';

const getContracts = (chainId: number): ContractsBlob => {
  if (isMainnet(chainId)) {
    return mainnet;
  } else if (isTestnet(chainId)) {
    return testnet;
  } else {
    throw new Error('Unsupported network or CHAIN_ID env variable is missing');
  }
};

export async function handler(event: RelayerParams) {
  const provider = new DefenderRelayProvider(event);
  const signer = new DefenderRelaySigner(event, provider, { speed: 'fast' });
  const relayer = new Relayer(event);

  const chainId = Number(process.env.CHAIN_ID);
  const contracts = getContracts(chainId);

  try {
    const transactionPopulated = await drawBeaconHandleDrawStartAndComplete(contracts, {
      chainId,
      provider: signer,
    });

    if (transactionPopulated) {
      let transactionSentToNetwork = await relayer.sendTransaction({
        data: transactionPopulated.data,
        to: transactionPopulated.to,
        gasLimit: 500000,
      });
      console.log('TransactionHash:', transactionSentToNetwork.hash);
    } else {
      throw new Error('DrawBeacon: Transaction not populated');
    }
  } catch (error) {
    console.log(error);
  }
}
