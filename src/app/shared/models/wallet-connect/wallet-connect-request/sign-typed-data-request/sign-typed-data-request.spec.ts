import { rawSignTypedDataRequest } from '../../../../../modules/wallets/shared-wallets/fixtures/raw-wallet-connect-requests';
import { SignClientV2 } from '../../sign-client/sign-client';
import { Wallet } from '../../../../../modules/wallets/shared-wallets/models/wallet/wallet';
import { Blockchain } from '../../../../../modules/swaps/shared-swaps/models/blockchain/blockchain';
import { rawPolygonData } from '../../../../../modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { SignTypedDataRequest } from './sign-typed-data-request';
import { HtmlRequestMessage } from '../../request-message/html-request-message/html-request-message';
import { getSdkError } from '@walletconnect/utils';
import { FakeWallet } from '../../../../../modules/wallets/shared-wallets/models/wallet/fake/fake-wallet';
import { SessionRequest } from '../../session-request/session-request';

describe('SignTypedDataRequest', () => {
  let signTypedDataRequest: SignTypedDataRequest;
  let signClientSpy: jasmine.SpyObj<SignClientV2>;
  let fakeWallet: Wallet;

  beforeEach(() => {
    signClientSpy = jasmine.createSpyObj('SignClientV2', {
      respond: Promise.resolve(),
    });

    fakeWallet = new FakeWallet(Promise.resolve(), null, '', new Blockchain(rawPolygonData));

    signTypedDataRequest = new SignTypedDataRequest(
      new SessionRequest(rawSignTypedDataRequest),
      signClientSpy,
      fakeWallet
    );
  });

  it('new', () => {
    expect(signTypedDataRequest).toBeTruthy();
  });

  it('request', () => {
    expect(signTypedDataRequest.request()).toEqual(rawSignTypedDataRequest.params.request);
  });

  it('data', () => {
    const requestData = signTypedDataRequest.data();
    expect(requestData.message()).toEqual(new HtmlRequestMessage(new SessionRequest(rawSignTypedDataRequest)));
    expect(requestData.isSignRequest()).toEqual(true);
    expect(requestData.decodedData()).toEqual(null);
    expect(requestData.isApproval()).toBeFalse();
    expect(requestData.fee()).toEqual(undefined);
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
