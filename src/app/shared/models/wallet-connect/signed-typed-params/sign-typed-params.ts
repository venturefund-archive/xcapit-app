import { SessionRequest } from '../session-request/session-request';
import { utils } from 'ethers';

export class SignedTypedParams {
  constructor(private _aSessionRequest: SessionRequest) {}

  domain(): any {
    return this._value().domain;
  }

  types(): any {
    return this._value().types;
  }
  message(): any {
    return this._value().message;
  }

  private _value(): any {
    let data = this._aSessionRequest.params().filter((p) => !utils.isAddress(p))[0];

    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    return data;
  }
}
