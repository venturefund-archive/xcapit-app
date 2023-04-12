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
      message: 'My email is john@doe.com - 1678769188349',
      isSignRequest: true,
      decodedData: null,
      isApproval: false,
      totalFeeAmount: undefined,
    };
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
