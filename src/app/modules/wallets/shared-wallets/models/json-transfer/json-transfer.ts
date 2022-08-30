import { Transfer } from '../transfer/transfer.interface';

export class JSONTransfer {
  constructor(private readonly _aTransfer: Transfer) {}

  public value(): any {
    return {
      fee: this._aTransfer.fee(),
      type: this._aTransfer.type(),
      icon: this._aTransfer.icon(),
      token: this._aTransfer.token(),
      ...this._aTransfer.raw(),
    };
  }
}
