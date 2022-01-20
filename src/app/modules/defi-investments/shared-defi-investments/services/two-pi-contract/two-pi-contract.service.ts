import { Injectable } from '@angular/core';
import { BlockchainProviderService } from 'src/app/modules/wallets/shared-wallets/services/blockchain-provider/blockchain-provider.service';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { environment } from 'variables.env';
import { InvestmentProduct } from '../../interfaces/investment-product.interface';
import twoPiAbi from '../../abi/twoPi-abi.json';
@Injectable({
  providedIn: 'root'
})
export class TwoPiContractService {
  
  constructor(private blockchainProviderService : BlockchainProviderService, private storageService : StorageService) { }

  async getBalance(product : InvestmentProduct){
    const contract = this.createContract(product);
    const wallets = await this.storageService.getWalletFromStorage();
    return await contract.balanceOf(product.id(), wallets.addresses.MATIC)
  }

  createContract(product : InvestmentProduct){
    return this.blockchainProviderService.createContract(product.contractAddress(),  twoPiAbi, this.blockchainProviderService.createProvider(environment.maticApiUrl));
  }
  
}
