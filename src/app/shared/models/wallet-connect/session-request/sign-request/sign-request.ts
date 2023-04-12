import { SessionRequest, TplSessionRequest } from '../session-request.interface';
import { RawSessionRequest } from '../raw-session-request.type';
import { SignClientV2 } from '../../sign-client/sign-client';
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils';
import { isAddress } from 'ethers/lib/utils';
import { getSdkError } from '@walletconnect/utils';
import { HexString } from '../../../hex-string/hex-string';
import { Wallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { RequestMethod } from '../../request-method/request-method';
export class SignRequest implements SessionRequest {
  constructor(
    private readonly _aRawSessionRequest: RawSessionRequest,
    private readonly _aSignClient: SignClientV2,
    private readonly _aWallet: Wallet
  ) {}

  public json(): TplSessionRequest {
    return {
      message: this.message(),
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
      response: formatJsonRpcResult(this._aRawSessionRequest.id, await this._aWallet.signMessage(this.message())),
    });
  }

  async reject(): Promise<void> {
    await this._aSignClient.respond({
      topic: this._aRawSessionRequest.topic,
      response: formatJsonRpcError(this._aRawSessionRequest.id, getSdkError('USER_REJECTED_METHODS').message),
    });
  }

  public message(): string {
    return this._getSignParamsMessage(this._aRawSessionRequest.params.request.params);
  }

  private _getSignParamsMessage(params: string[]) {
    const message = params.filter((param) => !isAddress(param))[0];

    return new HexString(message).toUtf8();
  }
}
