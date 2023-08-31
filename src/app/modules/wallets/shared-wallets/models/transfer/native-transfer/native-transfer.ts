import { RawToken } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { DefaultToken } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { RawTransfer } from '../../../types/raw-transfer.type';
import { Transfer } from '../transfer.interface';
import { AmountOf } from '../../blockchain-tx/amount-of/amount-of';

export class NativeTransfer implements Transfer {
  constructor(
    private readonly _aRawTransfer: RawTransfer,
    private readonly _aToken: RawToken,
    private readonly _anAddress: string
  ) {}

  public fee(): number {
    return new AmountOf(this._aRawTransfer.gas_price.toString(), new DefaultToken(this._aToken))
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
    return this._aRawTransfer;
  }

  public amount(): number {
    return new AmountOf(this._aRawTransfer.value.toString(), new DefaultToken(this._aToken)).value();
  }

  public quoteAmount(): number {
    return this._aRawTransfer.value_quote;
  }
}
