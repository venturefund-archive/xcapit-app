import { WalletConnectRequest } from '../wallet-connect-request.interface';
import { SignClientV2 } from '../../sign-client/sign-client';
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils';
import { getSdkError } from '@walletconnect/utils';
import { Wallet } from 'src/app/modules/wallets/shared-wallets/models/wallet/wallet';
import { TextRequestMessage } from '../../request-message/text-request-message/text-request-message';
import { SessionRequest } from '../../session-request/session-request';
import { RequestData } from '../../request-data/request-data';

export class SignRequest implements WalletConnectRequest {
  constructor(
    private readonly _aSessionRequest: SessionRequest,
    private readonly _aSignClient: SignClientV2,
    private readonly _aWallet: Wallet
  ) {}

  async approve(): Promise<void> {
    await this._aSignClient.respond({
      topic: this._aSessionRequest.topic(),
      response: formatJsonRpcResult(
        this._aSessionRequest.id(),
        await this._aWallet.signMessage(new TextRequestMessage(this._aSessionRequest).asText())
      ),
    });
  }

  async reject(): Promise<void> {
    await this._aSignClient.respond({
      topic: this._aSessionRequest.topic(),
      response: formatJsonRpcError(this._aSessionRequest.id(), getSdkError('USER_REJECTED_METHODS').message),
    });
  }

  public data(): RequestData {
    return new RequestData(new TextRequestMessage(this._aSessionRequest), true, null, false, undefined);
  }

  public request(): any {
    return this._aSessionRequest.request();
  }
}
