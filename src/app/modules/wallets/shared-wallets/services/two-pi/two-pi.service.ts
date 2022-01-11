import { Injectable } from '@angular/core';
import { TwoPi } from '@2pi-network/js-sdk';
import { environment } from 'variables.env';
import { BlockchainProviderService } from '../blockchain-provider/blockchain-provider.service';

@Injectable({
  providedIn: 'root'
})
export class TwoPiService {
  private chainId = 80001 //  Polygon testnet
  twoPi: TwoPi;
  
  constructor(private blockchainProviderService: BlockchainProviderService) {
    this.twoPi = new TwoPi(this.chainId, this.blockchainProviderService.createProvider(environment.maticApiUrl));
  }

  getVaults(){
    return this.twoPi.getVaults();
  }
  
}