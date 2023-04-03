import { RequestMethod } from '../../request-method/request-method';
import { RawSessionRequest } from '../raw-session-request.type';
import { SessionRequest } from '../session-request.interface';

export class NullRequest implements SessionRequest {
  public raw(): RawSessionRequest {
    return {} as RawSessionRequest;
  }

  public method(): RequestMethod {
    return {} as RequestMethod;
  }

  public approve() {}

  public reject() {}
}
