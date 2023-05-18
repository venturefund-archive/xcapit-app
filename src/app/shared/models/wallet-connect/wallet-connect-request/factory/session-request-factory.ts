import { WalletConnectRequest } from '../wallet-connect-request.interface';
import { SignRequest } from '../sign-request/sign-request';
import { Wallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { SignClientV2 } from '../../sign-client/sign-client';
import { SendTransactionRequest } from '../send-transaction-request/send-transaction-request';
import { SignTypedDataRequest } from '../sign-typed-data-request/sign-typed-data-request';
import { SignTransactionRequest } from '../sign-transaction-request/sign-transaction-request';
import { SessionRequest } from '../../session-request/session-request';
import { NullRequest } from '../null-request/null-request';

export const EIP155_SIGNING_METHODS = {
  PERSONAL_SIGN: 'personal_sign',
  ETH_SIGN: 'eth_sign',
  ETH_SIGN_TRANSACTION: 'eth_signTransaction',
  ETH_SIGN_TYPED_DATA: 'eth_signTypedData',
  ETH_SIGN_TYPED_DATA_V3: 'eth_signTypedData_v3',
  ETH_SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
  ETH_SEND_RAW_TRANSACTION: 'eth_sendRawTransaction',
  ETH_SEND_TRANSACTION: 'eth_sendTransaction',
};
export class SessionRequestFactory {
  private _requestClasses = new Map<string, any>([
    [EIP155_SIGNING_METHODS.PERSONAL_SIGN, SignRequest],
    [EIP155_SIGNING_METHODS.ETH_SIGN, SignRequest],
    [EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION, SignTransactionRequest],
    [EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA, SignTypedDataRequest],
    [EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3, SignTypedDataRequest],
    [EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4, SignTypedDataRequest],
    [EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION, SendTransactionRequest],
  ]);
  constructor(private signClient: SignClientV2) {}

  async create(_aSessionRequest: SessionRequest, _aWallet: Wallet): Promise<WalletConnectRequest> {
    let Request: any = NullRequest;
    if (this._requestClasses.has(_aSessionRequest.method())) {
      Request = this._requestClasses.get(_aSessionRequest.method());
    }
    return new Request(_aSessionRequest, this.signClient, _aWallet);
  }
}
