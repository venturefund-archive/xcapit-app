import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BlockchainRepo } from '../../blockchain-repo/blockchain-repo';
import { DefaultBlockchains } from '../default/default-blockchains';
import { Blockchains } from '../blockchains.interface';

@Injectable({ providedIn: 'root' })
export class BlockchainsFactory {
  create(blockchainData: any = environment.BLOCKCHAIN_DATA): Blockchains {
    return new DefaultBlockchains(new BlockchainRepo(blockchainData));
  }
}
