import { WalletConnectRequest } from '../wallet-connect-request.interface';
import { SignClientV2 } from '../../sign-client/sign-client';
import { Wallet } from '../../../../../modules/wallets/shared-wallets/models/wallet/wallet';
import { HtmlRequestMessage } from '../../request-message/html-request-message/html-request-message';
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils';
import { getSdkError } from '@walletconnect/utils';
import { SessionRequest } from '../../session-request/session-request';
import { RequestData } from '../../request-data/request-data';
import { SignedTypedParams } from '../../signed-typed-params/sign-typed-params';

export class SignTypedDataRequest implements WalletConnectRequest {
  constructor(
    private readonly _aSessionRequest: SessionRequest,
    private readonly _aSignClient: SignClientV2,
    private readonly _aWallet: Wallet
  ) {}
  async approve(): Promise<void> {
    const signedParams = new SignedTypedParams(this._aSessionRequest);
    await this._aSignClient.respond({
      topic: this._aSessionRequest.topic(),
      response: formatJsonRpcResult(
        this._aSessionRequest.id(),
        await this._aWallet.signTypedData(signedParams.domain(), signedParams.types(), signedParams.message())
      ),
    });
  }

  async reject(): Promise<void> {
    await this._aSignClient.respond({
      topic: this._aSessionRequest.topic(),
      response: formatJsonRpcError(this._aSessionRequest.id(), getSdkError('USER_REJECTED_METHODS').message),
    });
  }

  data(): RequestData {
    return new RequestData(new HtmlRequestMessage(this._aSessionRequest), true, null, false, undefined);
  }

  request(): any {
    return this._aSessionRequest.request();
  }
}
