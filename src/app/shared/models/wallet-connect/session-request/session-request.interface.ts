import { RawSessionRequest } from './raw-session-request.type';
import { RequestMethod } from '../request-method/request-method';

export type TplSessionRequest = {
  message: string;
  isSignRequest: boolean;
  decodedData: any;
  isApproval: boolean;
  totalFeeAmount: number;
};
export interface SessionRequest {
  raw: () => RawSessionRequest;
  method: () => RequestMethod;
  approve: () => Promise<void>;
  reject: () => Promise<void>;

  json: () => TplSessionRequest;
}
