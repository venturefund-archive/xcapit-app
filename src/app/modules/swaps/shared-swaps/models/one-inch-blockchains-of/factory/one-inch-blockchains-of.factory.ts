import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OneInchBlockchainsOf } from '../one-inch-blockchains-of';
import { Blockchains } from '../../blockchains/blockchains.interface';

@Injectable({ providedIn: 'root' })
export class OneInchBlockchainsOfFactory {
  create(blockchains: Blockchains, oneInchBlockchainsId: string[] = environment.ONE_INCH_DEFAULTS.blockchainsId) {
    return new OneInchBlockchainsOf(blockchains, oneInchBlockchainsId);
  }
}
