import { SignClientV2 } from '../../sign-client/sign-client';
import { Wallet } from '../../../../../modules/wallets/shared-wallets/models/wallet/wallet';
import { rawSignTransactionRequestDefault } from '../../../../../modules/wallets/shared-wallets/fixtures/raw-wallet-connect-requests';
import { Blockchain } from '../../../../../modules/swaps/shared-swaps/models/blockchain/blockchain';
import { rawPolygonData } from '../../../../../modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { getSdkError } from '@walletconnect/utils';
import { SignTransactionRequest } from './sign-transaction-request';
import { FakeWallet } from '../../../../../modules/wallets/shared-wallets/models/wallet/fake/fake-wallet';
import { SessionRequest } from '../../session-request/session-request';
import { NullRequestMessage } from '../../request-message/null-request-message/null-request-message';

describe('SignTransactionRequest', () => {
  let signTransactionRequest: SignTransactionRequest;
  let signClientSpy: jasmine.SpyObj<SignClientV2>;
  let fakeWallet: Wallet;

  beforeEach(() => {
    signClientSpy = jasmine.createSpyObj('SignClientV2', {
      respond: Promise.resolve(),
    });

    fakeWallet = new FakeWallet(Promise.resolve(), null, '', new Blockchain(rawPolygonData));

    signTransactionRequest = new SignTransactionRequest(
      new SessionRequest(rawSignTransactionRequestDefault),
      signClientSpy,
      fakeWallet
    );
  });

  it('new', () => {
    expect(signTransactionRequest).toBeTruthy();
  });

  it('request', () => {
    expect(signTransactionRequest.request()).toEqual(rawSignTransactionRequestDefault.params.request);
  });

  it('data', () => {
    const requestData = signTransactionRequest.data();
    expect(requestData.message()).toEqual(new NullRequestMessage());
    expect(requestData.isSignRequest()).toEqual(false);
    expect(requestData.decodedData()).toEqual(null);
    expect(requestData.isApproval()).toBeFalse();
    expect(requestData.fee()).toEqual(0.000052500000315);
  });

  it('approve', async () => {
    await signTransactionRequest.approve();

    expect(signClientSpy.respond).toHaveBeenCalledOnceWith({
      topic: rawSignTransactionRequestDefault.topic,
      response: {
        id: rawSignTransactionRequestDefault.id,
        jsonrpc: '2.0',
        result: 'a signed tx',
      },
    });
  });

  it('reject', async () => {
    await signTransactionRequest.reject();

    const message = getSdkError('USER_REJECTED_METHODS').message;
    expect(signClientSpy.respond).toHaveBeenCalledOnceWith({
      topic: rawSignTransactionRequestDefault.topic,
      response: {
        id: rawSignTransactionRequestDefault.id,
        jsonrpc: '2.0',
        error: { code: -32000, message },
      },
    });
  });
});
