import { Blockchain } from '../../blockchain/blockchain';
import { BlockchainRepo } from '../../blockchain-repo/blockchain-repo';
import { Blockchains } from '../blockchains.interface';

export class DefaultBlockchains implements Blockchains {
  constructor(private _dataRepo: BlockchainRepo) {}

  value(): Blockchain[] {
    return this._dataRepo.all().map((item) => new Blockchain(item));
  }

  oneByName(aBlockchainName: string): Blockchain {
    return new Blockchain(this._dataRepo.byName(aBlockchainName));
  }
  oneById(aBlockchainId: string): Blockchain {
    return new Blockchain(this._dataRepo.byId(aBlockchainId));
  }
}
