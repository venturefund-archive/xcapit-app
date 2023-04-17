import { SendTransactionRequest } from './send-transaction-request';
import { SignClientV2 } from '../../sign-client/sign-client';
import { Wallet } from '../../../../../modules/swaps/shared-swaps/models/wallet/wallet';
import { rawSendTransactionRequestDefault } from '../../../../../modules/wallets/shared-wallets/fixtures/raw-wallet-connect-requests';
import { Blockchain } from '../../../../../modules/swaps/shared-swaps/models/blockchain/blockchain';
import { rawPolygonData } from '../../../../../modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { getSdkError } from '@walletconnect/utils';
import { FakeWallet } from '../../../../../modules/swaps/shared-swaps/models/wallet/fake/fake-wallet';

describe('SendTransactionRequest', () => {
  let sendTransactionRequest: SendTransactionRequest;
  let signClientSpy: jasmine.SpyObj<SignClientV2>;
  let fakeWallet: Wallet;

  beforeEach(() => {
    signClientSpy = jasmine.createSpyObj('SignClientV2', {
      respond: Promise.resolve(),
    });

    fakeWallet = new FakeWallet(Promise.resolve(), null, '', new Blockchain(rawPolygonData));

    sendTransactionRequest = new SendTransactionRequest(rawSendTransactionRequestDefault, signClientSpy, fakeWallet);
  });

  it('new', () => {
    expect(sendTransactionRequest).toBeTruthy();
  });

  it('raw', () => {
    expect(sendTransactionRequest.raw()).toEqual(rawSendTransactionRequestDefault);
  });

  it('json', () => {
    expect(sendTransactionRequest.json()).toEqual({
      message: undefined,
      isSignRequest: false,
      decodedData: null,
      isApproval: false,
      totalFeeAmount: 0.004685388547413,
    });
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
