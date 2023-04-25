import { SignClientTypes } from '@walletconnect/types';

export class SessionRequest {
  constructor(private _aRawSessionRequest: SignClientTypes.EventArguments['session_request']) {}

  id(): number {
    return this._aRawSessionRequest.id;
  }

  topic(): string {
    return this._aRawSessionRequest.topic;
  }

  transaction(): any {
    return this.params()[0];
  }

  gasLimit(): string {
    return this.transaction().gasLimit;
  }

  gasPrice(): string {
    return this.transaction().gasPrice;
  }

  params(): any {
    return this.request().params;
  }

  request(): any {
    return this._aRawSessionRequest.params.request;
  }

  method(): string {
    return this.request().method;
  }
}
