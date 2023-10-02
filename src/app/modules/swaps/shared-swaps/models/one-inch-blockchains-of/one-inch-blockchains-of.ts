import { Blockchain } from '../blockchain/blockchain';
import { Blockchains } from '../blockchains/blockchains.interface';

export class OneInchBlockchainsOf implements Blockchains {
  constructor(private _blockchains: Blockchains, private _oneInchBlockchainsId: string[]) {}

  value(): Blockchain[] {
    return this._blockchains
      .value()
      .filter((blockchain) => this._oneInchBlockchainsId.find((id) => `${id}` === blockchain.id()));
  }

  oneByName(aBlockchainName: string): Blockchain {
    return this.value().find((blockchain) => blockchain.name() === aBlockchainName);
  }
}
