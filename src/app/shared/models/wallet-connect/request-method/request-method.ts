import { EIP155_SIGNING_METHODS } from '../session-request/factory/session-request-factory';
import { RawSessionRequest } from '../session-request/raw-session-request.type';

export class RequestMethod {
  constructor(private readonly _aRawSessionRequest: RawSessionRequest) {}

  public isSignRequest(): boolean {
    return [EIP155_SIGNING_METHODS.ETH_SIGN, EIP155_SIGNING_METHODS.PERSONAL_SIGN].indexOf(this._method()) >= 0;
  }

  public isSignTypedRequest(): boolean {
    return (
      [
        EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA,
        EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3,
        EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4,
      ].indexOf(this._method()) >= 0
    );
  }

  public isSignTransactionRequest(): boolean {
    return [EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION].indexOf(this._method()) >= 0;
  }

  public isSendTransactionRequest(): boolean {
    return [EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION].indexOf(this._method()) >= 0;
  }

  private _method(): string {
    return this._aRawSessionRequest.params.request.method;
  }
}
