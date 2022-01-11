import { Injectable } from '@angular/core';
import { TwoPi } from '@2pi-network/js-sdk';
import { environment } from 'variables.env';
import { BlockchainProviderService } from '../blockchain-provider/blockchain-provider.service';


@Injectable({
  providedIn: 'root'
})
export class TwoPiService {
  private chainId = 80001 //  Polygon testnet
  private twoPi: TwoPi;
  
  constructor(private blockchainProviderService: BlockchainProviderService) {
    this.twoPi = new TwoPi(this.chainId, this.blockchainProviderService.createProvider(environment.maticApiUrl));
  }

  getVaults(){
    const vaults = this.twoPi.getVaults();
    return vaults
  }
  

}