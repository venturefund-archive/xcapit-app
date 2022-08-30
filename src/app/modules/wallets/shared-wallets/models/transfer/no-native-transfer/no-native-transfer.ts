import { AmountOf } from 'src/app/modules/swaps/shared-swaps/models/amount-of/amount-of';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { Blockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains';
import { RawToken } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { Token } from 'src/app/modules/swaps/shared-swaps/models/token/token';
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
    const result = { ...this._aRawTransfer, ...this._aRawTransfer.transfers[0] };
    delete result.transfers;
    return result as RawTransfer;
  }

  private _nativeToken(): Token {
    return new Blockchains(new BlockchainRepo(environment.BLOCKCHAIN_DATA))
      .oneByName(this._aToken.network)
      .nativeToken();
  }
}
