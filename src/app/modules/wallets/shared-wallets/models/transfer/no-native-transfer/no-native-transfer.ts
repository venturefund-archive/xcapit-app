import { AmountOf } from 'src/app/modules/swaps/shared-swaps/models/amount-of/amount-of';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { Blockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains';
import { RawToken } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { DefaultToken } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { environment } from 'src/environments/environment';
import { RawTransfer } from '../../../types/raw-transfer.type';
import { Transfer } from '../transfer.interface';

export class NoNativeTransfer implements Transfer {
  constructor(private readonly _aRawTransfer: RawTransfer, private readonly _aToken: RawToken) {}

  public fee(): number {
    return new AmountOf(this._aRawTransfer.gas_price.toString(), this._nativeToken())
      .times(this._aRawTransfer.gas_spent)
      .value();
  }

  public token(): RawToken {
    return this._aToken;
  }

  public raw(): RawTransfer {
    return this._aRawTransfer;
  }

  private _nativeToken() {
   return new Blockchains(new BlockchainRepo(environment.BLOCKCHAIN_DATA)).oneByName(this._aToken.network).nativeToken();
  }
}
