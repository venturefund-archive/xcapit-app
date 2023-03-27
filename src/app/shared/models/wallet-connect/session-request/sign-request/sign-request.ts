import { SessionRequest } from '../session-request.interface';
import { RawSessionRequest } from '../raw-session-request.type';
import { SignClientV2 } from '../../sign-client/sign-client';
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils';
import { isAddress } from 'ethers/lib/utils';
import { getSdkError } from '@walletconnect/utils';
import { HexString } from '../../../hex-string/hex-string';
import { Wallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { RequestMethod } from '../../request-method/request-method';

export class SignRequest implements SessionRequest {
  _id: number;
  _topic: string;
  _method: string;
  _namespace: string;
  _chainId: string;
  _params: string[];

  constructor(
    private readonly _aRawSessionRequest: RawSessionRequest,
    private readonly _aSignClient: SignClientV2,
    private readonly _aWallet: Wallet
  ) {
    this._id = _aRawSessionRequest.id;
    this._topic = _aRawSessionRequest.topic;
    this._method = _aRawSessionRequest.params.request.method;
    [this._namespace, this._chainId] = _aRawSessionRequest.params.chainId.split(':');
    this._params = _aRawSessionRequest.params.request.params;
  }

  public raw(): RawSessionRequest {
    return this._aRawSessionRequest;
  }

  public method(): RequestMethod {
    return new RequestMethod(this.raw());
  }

  async approve(): Promise<void> {
    await this._aSignClient.respond({
      topic: this._topic,
      response: formatJsonRpcResult(this._id, await this._aWallet.signMessage(this.message())),
    });
  }

  async reject(): Promise<void> {
    await this._aSignClient.respond({
      topic: this._topic,
      response: formatJsonRpcError(this._id, getSdkError('USER_REJECTED_METHODS').message),
    });
  }

  public message(): string {
    return this._getSignParamsMessage(this._params);
  }

  private _getSignParamsMessage(params: string[]) {
    const message = params.filter((param) => !isAddress(param))[0];

    return new HexString(message).toUtf8();
  }
}
