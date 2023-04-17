import { SessionRequest, TplSessionRequest } from '../session-request.interface';
import { RawSessionRequest } from '../raw-session-request.type';
import { SignClientV2 } from '../../sign-client/sign-client';
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils';
import { getSdkError } from '@walletconnect/utils';
import { Wallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { RequestMethod } from '../../request-method/request-method';
import { TextRequestMessage } from '../../request-message/text-request-message/text-request-message';

export class SignRequest implements SessionRequest {
  constructor(
    private readonly _aRawSessionRequest: RawSessionRequest,
    private readonly _aSignClient: SignClientV2,
    private readonly _aWallet: Wallet
  ) {}

  public json(): TplSessionRequest {
    return {
      message: new TextRequestMessage(this._aRawSessionRequest).value(),
      isSignRequest: true,
      decodedData: null,
      isApproval: false,
      totalFeeAmount: undefined,
    };
  }

  public raw(): RawSessionRequest {
    return this._aRawSessionRequest;
  }

  public method(): RequestMethod {
    return new RequestMethod(this.raw());
  }

  async approve(): Promise<void> {
    await this._aSignClient.respond({
      topic: this._aRawSessionRequest.topic,
      response: formatJsonRpcResult(
        this._aRawSessionRequest.id,
        await this._aWallet.signMessage(new TextRequestMessage(this._aRawSessionRequest).asText())
      ),
    });
  }

  async reject(): Promise<void> {
    await this._aSignClient.respond({
      topic: this._aRawSessionRequest.topic,
      response: formatJsonRpcError(this._aRawSessionRequest.id, getSdkError('USER_REJECTED_METHODS').message),
    });
  }
}
