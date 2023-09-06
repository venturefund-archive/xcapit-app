import { WalletConnectRequest } from '../wallet-connect-request.interface';
import { SignClientV2 } from '../../sign-client/sign-client';
import { Wallet } from '../../../../../modules/wallets/shared-wallets/models/wallet/wallet';
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils';
import { getSdkError } from '@walletconnect/utils';
import { TransactionType } from '../../transaction-type/transaction-type';
import { SessionRequest } from '../../session-request/session-request';
import { RequestData } from '../../request-data/request-data';
import { NullRequestMessage } from '../../request-message/null-request-message/null-request-message';
import { AmountOf } from 'src/app/modules/wallets/shared-wallets/models/blockchain-tx/amount-of/amount-of';
import { WalletConnectTxOf } from 'src/app/modules/wallets/shared-wallets/models/blockchain-tx/wallet-connect-tx-of/wallet-connect-tx-of';

export class SendTransactionRequest implements WalletConnectRequest {
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
        (
          await this._aWallet.sendTransaction(new WalletConnectTxOf(this._aSessionRequest.transaction()))
        ).hash
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
    const transactionType = new TransactionType(this._aSessionRequest);
    return new RequestData(
      new NullRequestMessage(),
      false,
      transactionType.value(),
      transactionType.isApproval(),
      this._fee()
    );
  }

  public request(): any {
    return this._aSessionRequest.request();
  }
  private _fee(): number {
    return new AmountOf(this._aSessionRequest.gasLimit(), this._aWallet.blockchain().nativeToken())
      .times(this._aSessionRequest.gasPrice())
      .value();
  }
}
