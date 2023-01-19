import { Blockchain, DefaultBlockchain } from "../blockchain/blockchain";
import { BlockchainRepo } from "../blockchain-repo/blockchain-repo";


export interface Blockchains {
  value(): Blockchain[];
  oneByName(aBlockchainName: string): Blockchain;
}


export class DefaultBlockchains implements Blockchains {

  constructor(private _dataRepo: BlockchainRepo) { }

  value(): Blockchain[] {
    return this._dataRepo.all().map(item => (new DefaultBlockchain(item)));
  }

  oneByName(aBlockchainName: string): Blockchain {
    return new DefaultBlockchain(this._dataRepo.byName(aBlockchainName));
  }
}
