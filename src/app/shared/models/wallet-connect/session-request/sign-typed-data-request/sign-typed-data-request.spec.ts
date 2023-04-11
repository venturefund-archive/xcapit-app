import { rawSignTypedDataRequest } from '../../../../../modules/wallets/shared-wallets/fixtures/raw-wallet-connect-requests';
import { SignClientV2 } from '../../sign-client/sign-client';
import { FakeWallet, Wallet } from '../../../../../modules/swaps/shared-swaps/models/wallet/wallet';
import { Blockchain } from '../../../../../modules/swaps/shared-swaps/models/blockchain/blockchain';
import { rawPolygonData } from '../../../../../modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { SignTypedDataRequest } from './sign-typed-data-request';
import { HtmlRequestMessage } from '../../request-message/html-request-message/html-request-message';
import { getSdkError } from '@walletconnect/utils';

describe('SignTypedDataRequest', () => {
  let signTypedDataRequest: SignTypedDataRequest;
  let signClientSpy: jasmine.SpyObj<SignClientV2>;
  let fakeWallet: Wallet;

  beforeEach(() => {
    signClientSpy = jasmine.createSpyObj('SignClientV2', {
      respond: Promise.resolve(),
    });

    fakeWallet = new FakeWallet(Promise.resolve(), null, '', new Blockchain(rawPolygonData));

    signTypedDataRequest = new SignTypedDataRequest(rawSignTypedDataRequest, signClientSpy, fakeWallet);
  });

  it('new', () => {
    expect(signTypedDataRequest).toBeTruthy();
  });

  it('raw', () => {
    expect(signTypedDataRequest.raw()).toEqual(rawSignTypedDataRequest);
  });

  it('json', () => {
    expect(signTypedDataRequest.json()).toEqual({
      message: new HtmlRequestMessage(rawSignTypedDataRequest).value(),
      isSignRequest: true,
      decodedData: null,
      isApproval: false,
      totalFeeAmount: undefined,
    });
  });

  it('isSignTypedRequest', () => {
    expect(signTypedDataRequest.method().isSignTypedRequest()).toBeTrue();
  });

  it('approve', async () => {
    await signTypedDataRequest.approve();

    expect(signClientSpy.respond).toHaveBeenCalledOnceWith({
      topic: rawSignTypedDataRequest.topic,
      response: {
        id: rawSignTypedDataRequest.id,
        jsonrpc: '2.0',
        result: undefined,
      },
    });
  });

  it('reject', async () => {
    await signTypedDataRequest.reject();

    const message = getSdkError('USER_REJECTED_METHODS').message;
    expect(signClientSpy.respond).toHaveBeenCalledOnceWith({
      topic: rawSignTypedDataRequest.topic,
      response: {
        id: rawSignTypedDataRequest.id,
        jsonrpc: '2.0',
        error: { code: -32000, message },
      },
    });
  });
});
