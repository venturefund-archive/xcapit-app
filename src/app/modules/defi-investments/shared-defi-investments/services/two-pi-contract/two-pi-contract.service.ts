import { Injectable } from '@angular/core';
import { BlockchainProviderService } from 'src/app/modules/wallets/shared-wallets/services/blockchain-provider/blockchain-provider.service';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { environment } from 'variables.env';
import { InvestmentProduct } from '../../interfaces/investment-product.interface';
import twoPiAbi from '../../abi/twoPi-abi.json';
import { Contract } from 'ethers';
@Injectable({
  providedIn: 'root'
})
export class TwoPiContractService {

  constructor(private blockchainProviderService: BlockchainProviderService, private storageService: StorageService) {
  }

  async balance(product: InvestmentProduct): Promise<number> {
    const contract = this.createContract(product);
    const wallets = await this.storageService.getWalletFromStorage();
    return parseInt(await contract.balanceOf(product.id(), wallets.addresses.MATIC));
  }

  private createContract(product: InvestmentProduct): Contract {
    return this.blockchainProviderService.createContract(product.contractAddress(), twoPiAbi, this.blockchainProviderService.createProvider(environment.maticApiUrl));
  }

}
