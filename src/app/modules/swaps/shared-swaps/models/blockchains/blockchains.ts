import { Blockchain } from "../blockchain/blockchain";
import { BlockchainRepo } from "../blockchain-repo/blockchain-repo";


export class Blockchains {

  constructor(private _dataRepo: BlockchainRepo) { }

  value(): Blockchain[] {
    return this._dataRepo.all().map(item => (new Blockchain(item)));
  }

  oneByName(aBlockchainName: string): Blockchain {
    return new Blockchain(this._dataRepo.byName(aBlockchainName));
  }
}
