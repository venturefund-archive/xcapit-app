import { RawSessionRequest } from './raw-session-request.type';
import { RequestMethod } from '../request-method/request-method';

export interface SessionRequest {
  _id: number;
  _topic: string;
  _method: string;
  _namespace: string;
  _chainId: string;
  _params: string[];

  raw: () => RawSessionRequest;
  method: () => RequestMethod;
  approve: () => void;
  reject: () => void;
}
