import { SessionRequest, TplSessionRequest } from '../session-request.interface';
import { RawSessionRequest } from '../raw-session-request.type';
import { SignClientV2 } from '../../sign-client/sign-client';
import { Wallet } from '../../../../../modules/swaps/shared-swaps/models/wallet/wallet';
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils';
import { RequestMethod } from '../../request-method/request-method';
import { AmountOf } from '../../../../../modules/swaps/shared-swaps/models/amount-of/amount-of';
import { BigNumber } from 'ethers';
import erc20Abi from '../../../../../modules/wallets/shared-wallets/constants/assets-abi/erc20-abi.json';
import routerAbi from '../../../../../modules/wallets/shared-wallets/constants/assets-abi/exchange-abi.json';
import * as AbiDecoder from 'abi-decoder';
import { transactionType } from '../../../../../modules/wallets/shared-wallets/constants/transaction-type';
import { WalletConnectTxOf } from '../../../../../modules/swaps/shared-swaps/models/wallet-connect-tx-of/wallet-connect-tx-of';
import { getSdkError } from '@walletconnect/utils';

export class SendTransactionRequest implements SessionRequest {
  constructor(
    private readonly _aRawSessionRequest: RawSessionRequest,
    private readonly _aSignClient: SignClientV2,
    private readonly _aWallet: Wallet
  ) {}

  async approve(): Promise<void> {
    await this._aSignClient.respond({
      topic: this._aRawSessionRequest.topic,
      response: formatJsonRpcResult(
        this._aRawSessionRequest.id,
        (
          await this._aWallet.sendTransaction(new WalletConnectTxOf(this._aRawSessionRequest.params.request.params[0]))
        ).hash
      ),
    });
  }

  public method(): RequestMethod {
    return new RequestMethod(this.raw());
  }

  public json(): TplSessionRequest {
    const decodedData = this._decodedData();
    return {
      message: undefined,
      isSignRequest: false,
      decodedData: decodedData,
      isApproval: this._isApproval(decodedData),
      totalFeeAmount: this._fee(),
    };
  }

  private _contractsAbi() {
    const decoder = AbiDecoder;
    decoder.addABI(erc20Abi);
    decoder.addABI(routerAbi);
    return decoder;
  }

  private _decodedData() {
    const decodedData = this._contractsAbi().decodeMethod(this._aRawSessionRequest.params.request.params[0].data);

    if (decodedData && decodedData.name) {
      const type = transactionType.filter((type) => type.name === decodedData.name)[0];
      if (type) {
        type.data = decodedData.params;

        return type;
      }
    }

    return null;
  }

  private _fee(): number {
    return new AmountOf(
      BigNumber.from(this._aRawSessionRequest.params.request.params[0].gasLimit)
        .mul(BigNumber.from(this._aRawSessionRequest.params.request.params[0].gasPrice))
        .toString(),
      this._aWallet.blockchain().nativeToken()
    ).value();
  }

  private _isApproval(decodedData: any): boolean {
    return !!(decodedData && decodedData.name === 'approve');
  }

  public raw(): RawSessionRequest {
    return this._aRawSessionRequest;
  }

  async reject(): Promise<void> {
    await this._aSignClient.respond({
      topic: this._aRawSessionRequest.topic,
      response: formatJsonRpcError(this._aRawSessionRequest.id, getSdkError('USER_REJECTED_METHODS').message),
    });
  }
}
