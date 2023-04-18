import { WalletConnectRequest } from '../wallet-connect-request.interface';
import { RequestData } from '../../request-data/request-data';
import { NullRequestMessage } from '../../request-message/null-request-message/null-request-message';

export class NullRequest implements WalletConnectRequest {
  public approve(): Promise<void> {
    return Promise.resolve();
  }
  public reject(): Promise<void> {
    return Promise.resolve();
  }

  data(): RequestData {
    return new RequestData(new NullRequestMessage(), false, null, false, undefined);
  }
  public request(): any {
    return undefined;
  }
}
