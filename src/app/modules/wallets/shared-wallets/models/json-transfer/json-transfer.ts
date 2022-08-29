import { Transfer } from '../transfer/transfer';

export class JSONTransfer {
  constructor(private readonly _aTransfer: Transfer) {}

  public value(): any {
    return {
      fee: this._aTransfer.fee(),
      token: this._aTransfer.token(),
      ...this._aTransfer.raw(),
    };
  }
}
