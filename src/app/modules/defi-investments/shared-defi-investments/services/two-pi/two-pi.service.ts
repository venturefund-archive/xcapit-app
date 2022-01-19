import { Injectable } from '@angular/core';
import { TwoPi } from '@2pi-network/js-sdk';
import { environment } from 'variables.env';
import { BlockchainProviderService } from '../../../../wallets/shared-wallets/services/blockchain-provider/blockchain-provider.service';
import { DEFI_PRODUCTS } from '../../constants/defi-products';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
@Injectable({
  providedIn: 'root'
})
export class TwoPiService {
  products = DEFI_PRODUCTS;
  private chainId = environment.chainId.POLYGON;
  twoPi: TwoPi;
  addresses: any = null;
  
  constructor(private blockchainProviderService: BlockchainProviderService, private storageService :  StorageService) {
    this.twoPi = new TwoPi(this.chainId, this.blockchainProviderService.createProvider(environment.maticApiUrl));
  }

  getVaults(){
    return this.twoPi.getVaults();
  }

  async getBalance(product){
    const contract = this.blockchainProviderService.createContract(product.contract, product.abi, this.blockchainProviderService.createProvider(environment.maticApiUrl));
    const wallets = await this.storageService.getWalletFromStorage();
    if (wallets) {
      this.addresses = wallets.addresses;
    }
    return await contract.balanceOf(product.pid, this.addresses.MATIC)
  }
  
}