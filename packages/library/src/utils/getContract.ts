import { ethers } from 'ethers';
import { Contract } from 'ethers';

import {
  ARBITRUM_GOERLI_CHAIN_ID,
  ETHEREUM_GOERLI_CHAIN_ID,
  OPTIMISM_GOERLI_CHAIN_ID,
  MUMBAI_CHAIN_ID,
} from './network';
import { ContractsBlob } from '../types';

const debug = require('debug')('pt-autotask-lib');

export function getContract(
  name: string,
  chainId: number,
  providerOrSigner: any,
  contractsBlob: ContractsBlob,
  version = {
    major: 1,
    minor: 0,
    patch: 0,
  },
): Contract | undefined {
  debug('name:', name);
  debug('chainId:', chainId);

  if (!name || !chainId) throw new Error(`Invalid Contract Parameters`);

  const contracts = contractsBlob.contracts.filter(
    (cont) => cont.type === name && cont.chainId === chainId,
  );

  const contract = contracts.find(
    (contract) => JSON.stringify(contract.version) === JSON.stringify(version),
  );

  if (contract) {
    return new ethers.Contract(contract.address, contract.abi, providerOrSigner);
  }

  throw new Error(`Contract Unavailable: ${name} on chainId: ${chainId} `);
}

export function getSingleMessageDispatcherContractAddress(
  beaconChainId: number,
  receiverChainId: number,
): string | Error {
  switch (beaconChainId) {
    case ETHEREUM_GOERLI_CHAIN_ID:
      switch (receiverChainId) {
        case ARBITRUM_GOERLI_CHAIN_ID:
          return '0xBc244773f71a2f897fAB5D5953AA052B8ff68670';
        case OPTIMISM_GOERLI_CHAIN_ID:
          return '0x81F4056FFFa1C1fA870de40BC45c752260E3aD13';
        case MUMBAI_CHAIN_ID:
          return '0xBA8d8a0554dFd7F7CCf3cEB47a88d711e6a65F5b';
        default:
          throw new Error(
            `SingleMessageDispatcher Contract unavailable for receiver chainId: ${receiverChainId}`,
          );
      }
    default:
      throw new Error(
        `SingleMessageDispatcher Contract unavailable on beacon chainId: ${beaconChainId}`,
      );
  }
}
