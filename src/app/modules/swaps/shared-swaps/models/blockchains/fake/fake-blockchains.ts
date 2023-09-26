import { Blockchain } from '../../blockchain/blockchain';
import { Blockchains } from '../blockchains.interface';

export class FakeBlockchains implements Blockchains {
  constructor(
    private readonly _valueReturn: Blockchain[] = null,
    private readonly _oneByNameReturn: Blockchain = null,
    private readonly _oneByIdReturn: Blockchain = null
  ) {}

  value(): Blockchain[] {
    return this._valueReturn;
  }

  oneByName(aBlockchainName: string): Blockchain {
    return this._oneByNameReturn;
  }

  oneById(aBlockchainId: string): Blockchain {
    return this._oneByIdReturn;
  }
}
