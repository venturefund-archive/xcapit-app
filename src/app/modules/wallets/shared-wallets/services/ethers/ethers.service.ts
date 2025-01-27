import { Contract, ContractInterface, ethers, Signer, Wallet, providers } from 'ethers';
import { Injectable } from '@angular/core';
import { Provider } from '@ethersproject/abstract-provider';

@Injectable({
  providedIn: 'root',
})
export class EthersService {
  walletClass = Wallet;
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

  decryptWalletJsonSync(wallet: string, password: string): Wallet {
    return Wallet.fromEncryptedJsonSync(wallet, password);
  }

  newProvider(rpcUrl) {
    return new providers.JsonRpcProvider(rpcUrl);
  }
  
  encryptWallet(wallet: Wallet, password: string): Promise<string> {
    return wallet.encrypt(password);
  }
}
