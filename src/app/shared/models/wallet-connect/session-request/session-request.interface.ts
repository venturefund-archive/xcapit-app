import { RawSessionRequest } from './raw-session-request.type';
import { RequestMethod } from '../request-method/request-method';

export interface SessionRequest {
  raw: () => RawSessionRequest;
  method: () => RequestMethod;
  approve: () => void;
  reject: () => void;
}
