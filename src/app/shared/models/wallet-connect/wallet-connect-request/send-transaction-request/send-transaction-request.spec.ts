import { SendTransactionRequest } from './send-transaction-request';
import { SignClientV2 } from '../../sign-client/sign-client';
import { Wallet } from '../../../../../modules/swaps/shared-swaps/models/wallet/wallet';
import {
  rawSwapTransactionRequest,
  rawSendTransactionRequestDefault,
} from '../../../../../modules/wallets/shared-wallets/fixtures/raw-wallet-connect-requests';
import { Blockchain } from '../../../../../modules/swaps/shared-swaps/models/blockchain/blockchain';
import { rawPolygonData } from '../../../../../modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { getSdkError } from '@walletconnect/utils';
import { FakeWallet } from '../../../../../modules/swaps/shared-swaps/models/wallet/fake/fake-wallet';
import { DecodedData } from '../../decoded-data/decoded-data';
import { SessionRequest } from '../../session-request/session-request';
import { NullRequestMessage } from '../../request-message/null-request-message/null-request-message';

describe('SendTransactionRequest', () => {
  let sendTransactionRequest: SendTransactionRequest;
  let signClientSpy: jasmine.SpyObj<SignClientV2>;
  let fakeWallet: Wallet;

  beforeEach(() => {
    signClientSpy = jasmine.createSpyObj('SignClientV2', {
      respond: Promise.resolve(),
    });

    fakeWallet = new FakeWallet(Promise.resolve(), null, '', new Blockchain(rawPolygonData));

    sendTransactionRequest = new SendTransactionRequest(
      new SessionRequest(rawSendTransactionRequestDefault),
      signClientSpy,
      fakeWallet
    );
  });

  it('new', () => {
    expect(sendTransactionRequest).toBeTruthy();
  });

  it('request', () => {
    expect(sendTransactionRequest.request()).toEqual(rawSendTransactionRequestDefault.params.request);
  });

  it('data', () => {
    const requestData = sendTransactionRequest.data()
    expect(requestData.message()).toEqual(new NullRequestMessage());
    expect(requestData.isSignRequest()).toEqual(false);
    expect(requestData.decodedData()).toEqual(null);
    expect(requestData.isApproval()).toBeFalse();
    expect(requestData.fee()).toEqual(0.004685388547413,);
  });

  it('json with encoded data', () => {
    sendTransactionRequest = new SendTransactionRequest(
      new SessionRequest(rawSwapTransactionRequest),
      signClientSpy,
      fakeWallet
    );
    expect(sendTransactionRequest.data().decodedData().name).toEqual(
      new DecodedData(rawSwapTransactionRequest.params.request.params[0].data).name()
    );
  });

  it('approve', async () => {
    await sendTransactionRequest.approve();

    expect(signClientSpy.respond).toHaveBeenCalledOnceWith({
      topic: rawSendTransactionRequestDefault.topic,
      response: {
        id: rawSendTransactionRequestDefault.id,
        jsonrpc: '2.0',
        result: 'aTxHash',
      },
    });
  });

  it('reject', async () => {
    await sendTransactionRequest.reject();

    const message = getSdkError('USER_REJECTED_METHODS').message;
    expect(signClientSpy.respond).toHaveBeenCalledOnceWith({
      topic: rawSendTransactionRequestDefault.topic,
      response: {
        id: rawSendTransactionRequestDefault.id,
        jsonrpc: '2.0',
        error: { code: -32000, message },
      },
    });
  });
});
