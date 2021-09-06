import { Contract, ContractInterface, ethers, Signer } from 'ethers';
import { Injectable } from '@angular/core';
import { Provider } from '@ethersproject/abstract-provider';

@Injectable({
  providedIn: 'root',
})
export class EthersService {
  constructor() {}

  ethers() {
    return ethers;
  }

  newContract(
    addressOrName: string,
    contractInterface: ContractInterface,
    signerOrProvider?: Signer | Provider
  ): Contract {
    return new Contract(addressOrName, contractInterface, signerOrProvider);
  }
}
