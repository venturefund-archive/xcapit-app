import { SessionRequest, TplSessionRequest } from '../session-request.interface';
import { RawSessionRequest } from '../raw-session-request.type';
import { SignClientV2 } from '../../sign-client/sign-client';
import { Wallet } from '../../../../../modules/swaps/shared-swaps/models/wallet/wallet';
import { RequestMethod } from '../../request-method/request-method';
import { HtmlRequestMessage } from '../../request-message/html-request-message/html-request-message';
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils';
import { utils } from 'ethers';
import { getSdkError } from '@walletconnect/utils';

export class SignTypedDataRequest implements SessionRequest {
  constructor(
    private readonly _aRawSessionRequest: RawSessionRequest,
    private readonly _aSignClient: SignClientV2,
    private readonly _aWallet: Wallet
  ) {}
  async approve(): Promise<void> {
    const signedParams = this._signedTypedDataParamsData();
    await this._aSignClient.respond({
      topic: this._aRawSessionRequest.topic,
      response: formatJsonRpcResult(
        this._aRawSessionRequest.id,
        await this._aWallet.signTypedData(signedParams.domain, signedParams.types, signedParams.message)
      ),
    });
  }

  private _signedTypedDataParamsData() {
    const signedParams = this._getSignTypedDataParamsData(this._aRawSessionRequest.params.request.params);
    delete signedParams.types.EIP712Domain;
    return signedParams;
  }

  private _getSignTypedDataParamsData(params: string[]): any {
    let data = params.filter((p) => !utils.isAddress(p))[0];

    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    return data;
  }

  json(): TplSessionRequest {
    return {
      message: new HtmlRequestMessage(this._aRawSessionRequest).value(),
      isSignRequest: true,
      decodedData: null,
      isApproval: false,
      totalFeeAmount: undefined,
    };
  }

  method(): RequestMethod {
    return new RequestMethod(this.raw());
  }

  raw(): RawSessionRequest {
    return this._aRawSessionRequest;
  }

  async reject(): Promise<void> {
    await this._aSignClient.respond({
      topic: this._aRawSessionRequest.topic,
      response: formatJsonRpcError(this._aRawSessionRequest.id, getSdkError('USER_REJECTED_METHODS').message),
    });
  }
}
