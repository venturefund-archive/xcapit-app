import { WalletConnectRequest } from '../wallet-connect-request.interface';
import { SessionRequest } from '../../session-request/session-request';
import { RequestData } from '../../request-data/request-data';
import { HtmlRequestMessage } from '../../request-message/html-request-message/html-request-message';
import { TextRequestMessage } from '../../request-message/text-request-message/text-request-message';

export class FakeRequest implements WalletConnectRequest {
  constructor(
    private _aSessionRequest: SessionRequest,
    private approveResponse = Promise.resolve(),
    private rejectResponse = Promise.resolve()
  ) {}

  approve(): Promise<void> {
    return this.approveResponse;
  }

  reject(): Promise<void> {
    return this.rejectResponse;
  }

  data(): RequestData {
    return new RequestData(new TextRequestMessage(this._aSessionRequest), true, null, false, undefined);
  }

  request(): any {
    return this._aSessionRequest.request();
  }
}
