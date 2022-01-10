import { Injectable } from '@angular/core';
import { AlchemyProvider} from '@ethersproject/providers';
import { TwoPi }  from '@2pi-network/js-sdk';

const chainId  = 80001 //  Polygon testnet
const provider = new AlchemyProvider();
const twoPi = new TwoPi(chainId, provider);
@Injectable({
  providedIn: 'root'
})
export class TwoPiService {
  
  constructor() {}

  createTwoPi(){
      twoPi.getVaults().forEach(async vault => {
        const apy = await vault.apy() || 0
      })
  }
}