import { AmountOf } from 'src/app/modules/swaps/shared-swaps/models/amount-of/amount-of';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { Blockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains';
import { RawToken } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { Token } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { environment } from 'src/environments/environment';
import { RawTransfer } from '../../../types/raw-transfer.type';
import { Transfer } from '../transfer.interface';

export class NoNativeTransfer implements Transfer {
  constructor(
    private readonly _aRawTransfer: RawTransfer,
    private readonly _aToken: RawToken,
    private readonly _anAddress: string
  ) {}

  public fee(): number {
    return new AmountOf(this._aRawTransfer.gas_price.toString(), this._nativeToken())
      .times(this._aRawTransfer.gas_spent)
      .value();
  }

  public type(): 'IN' | 'OUT' {
    return this._aRawTransfer.to_address === this._anAddress ? 'IN' : 'OUT';
  }

  public icon(): string {
    return this.type() === 'IN'
      ? 'assets/img/wallet-transactions/received.svg'
      : 'assets/img/wallet-transactions/sended.svg';
  }

  public token(): RawToken {
    return this._aToken;
  }

  public raw(): RawTransfer {
    const result = { ...this._aRawTransfer, ...this._aRawTransfer.transfers[0] };
    delete result.transfers;
    return result;
  }

  public amount(): number {
    return parseInt(this.raw().delta, 10) / Math.pow(10, this.raw().contract_decimals);
   /*  return new AmountOf(this.raw().delta, this._nativeToken()).value() */
  }

  private _nativeToken(): Token {
    return new Blockchains(new BlockchainRepo(environment.BLOCKCHAIN_DATA))
      .oneByName(this._aToken.network)
      .nativeToken();
  }
}
