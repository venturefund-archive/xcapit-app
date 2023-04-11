import { RequestMethod } from '../../request-method/request-method';
import { RawSessionRequest } from '../raw-session-request.type';
import { SessionRequest, TplSessionRequest } from '../session-request.interface';

export class NullRequest implements SessionRequest {
  public raw(): RawSessionRequest {
    return undefined as RawSessionRequest;
  }

  public method(): RequestMethod {
    return undefined as RequestMethod;
  }

  public approve() {
    return Promise.resolve();
  }

  public reject(): Promise<void> {
    return Promise.resolve();
  }

  json(): TplSessionRequest {
    return {
      message: '',
      isSignRequest: false,
      decodedData: null,
      isApproval: false,
      totalFeeAmount: undefined,
    };
  }
}
