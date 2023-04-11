import { SessionRequest, TplSessionRequest } from '../session-request.interface';
import { RawSessionRequest } from '../raw-session-request.type';
import { RequestMethod } from '../../request-method/request-method';

export class FakeRequest implements SessionRequest {
  constructor(
    private rawSessionRequest: RawSessionRequest,
    private approveResponse = Promise.resolve(),
    private rejectResponse = Promise.resolve()
  ) {}

  approve(): Promise<void> {
    return this.approveResponse;
  }

  json(): TplSessionRequest {
    return {
      message: this._message(),
      isSignRequest: true,
      decodedData: null,
      isApproval: false,
      totalFeeAmount: undefined,
    };
  }

  private _message() {
    const element = document.createElement('div');
    element.appendChild(document.createTextNode('My email is john@doe.com - 1678769188349'));
    return element;
  }

  method(): RequestMethod {
    return undefined;
  }

  raw(): RawSessionRequest {
    return this.rawSessionRequest;
  }

  reject(): Promise<void> {
    return this.rejectResponse;
  }
}
