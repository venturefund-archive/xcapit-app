import { RawSessionRequest } from '../raw-session-request.type';
import { SessionRequest } from '../session-request.interface';
import { SignRequest } from '../sign-request/sign-request';
import { Wallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { SignClientV2 } from '../../sign-client/sign-client';
import { RequestMethod } from '../../request-method/request-method';
import { NullRequest } from '../null-request/null-request';
import { SendTransactionRequest } from '../send-transaction-request/send-transaction-request';

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
  constructor(private signClient: SignClientV2) {}

  async createRequest(_aRawSessionRequest: RawSessionRequest, _aWallet: Wallet): Promise<SessionRequest> {
    const requestMethod = new RequestMethod(_aRawSessionRequest);

    if (requestMethod.isSignRequest()) {
      return new SignRequest(_aRawSessionRequest, this.signClient, _aWallet);
    } else if (requestMethod.isSendTransactionRequest()) {
      return new SendTransactionRequest(_aRawSessionRequest, this.signClient, _aWallet);
    } else {
      return new NullRequest();
    }
  }
}
