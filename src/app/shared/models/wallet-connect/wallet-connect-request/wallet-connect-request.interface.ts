import { RequestData } from '../request-data/request-data';

export interface WalletConnectRequest {
  request: () => any;
  approve: () => Promise<void>;
  reject: () => Promise<void>;
  data: () => RequestData;
}
