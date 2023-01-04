import { ethers } from 'ethers';
import { Contract } from 'ethers';
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

export default getContract;
