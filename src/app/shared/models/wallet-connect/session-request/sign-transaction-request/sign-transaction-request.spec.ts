import { SignClientV2 } from '../../sign-client/sign-client';
import { Wallet } from '../../../../../modules/swaps/shared-swaps/models/wallet/wallet';
import { rawSignTransactionRequestDefault } from '../../../../../modules/wallets/shared-wallets/fixtures/raw-wallet-connect-requests';
import { Blockchain } from '../../../../../modules/swaps/shared-swaps/models/blockchain/blockchain';
import { rawPolygonData } from '../../../../../modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { getSdkError } from '@walletconnect/utils';
import { SignTransactionRequest } from './sign-transaction-request';
import { FakeWallet } from '../../../../../modules/swaps/shared-swaps/models/wallet/fake/fake-wallet';

describe('SignTransactionRequest', () => {
  let signTransactionRequest: SignTransactionRequest;
  let signClientSpy: jasmine.SpyObj<SignClientV2>;
  let fakeWallet: Wallet;

  beforeEach(() => {
    signClientSpy = jasmine.createSpyObj('SignClientV2', {
      respond: Promise.resolve(),
    });

    fakeWallet = new FakeWallet(Promise.resolve(), null, '', new Blockchain(rawPolygonData));

    signTransactionRequest = new SignTransactionRequest(rawSignTransactionRequestDefault, signClientSpy, fakeWallet);
  });

  it('new', () => {
    expect(signTransactionRequest).toBeTruthy();
  });

  it('raw', () => {
    expect(signTransactionRequest.raw()).toEqual(rawSignTransactionRequestDefault);
  });

  it('json', () => {
    expect(signTransactionRequest.json()).toEqual({
      message: undefined,
      isSignRequest: false,
      decodedData: null,
      isApproval: false,
      totalFeeAmount: 0.000052500000315,
    });
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
