import { SignRequest } from './sign-request';
import { rawPersonalSignRequest } from '../../../../../modules/wallets/shared-wallets/fixtures/raw-wallet-connect-requests';
import { SignClientV2 } from '../../sign-client/sign-client';
import { getSdkError } from '@walletconnect/utils';
import { Wallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';

describe('SignRequest', () => {
  let signClientSpy: jasmine.SpyObj<SignClientV2>;
  let walletSpy: jasmine.SpyObj<Wallet>;
  let signRequest: SignRequest;
  const testSignedMessage =
    '0x3a786eeacd6de94e665bb3ddf3a4d6d9ee9e8b71f07ee463f810ec2df131583d6bc6ebb721a9d4a901a7aa508cd082846b346d323bec564e07c0adbcddb50e991b';

  beforeEach(() => {
    signClientSpy = jasmine.createSpyObj('SignClientV2', {
      respond: Promise.resolve(),
    });

    walletSpy = jasmine.createSpyObj('Wallet', {
      signMessage: testSignedMessage,
    });

    signRequest = new SignRequest(rawPersonalSignRequest, signClientSpy, walletSpy);
  });

  it('new', () => {
    expect(signRequest).toBeTruthy();
  });

  it('raw', () => {
    expect(signRequest.raw()).toEqual(rawPersonalSignRequest);
  });

  it('isSignRequest', () => {
    expect(signRequest.method().isSignRequest()).toBeTrue();
  });

  it('json', () => {
    const message = document.createElement('div');
    message.appendChild(document.createTextNode('My email is john@doe.com - 1678769188349'));
    expect(signRequest.json()).toEqual({
      message: message,
      isSignRequest: true,
      decodedData: null,
      isApproval: false,
      totalFeeAmount: undefined,
    });
  });

  it('approve', async () => {
    await signRequest.approve();

    expect(signClientSpy.respond).toHaveBeenCalledOnceWith({
      topic: rawPersonalSignRequest.topic,
      response: {
        id: rawPersonalSignRequest.id,
        jsonrpc: '2.0',
        result: testSignedMessage,
      },
    });
  });

  it('reject', async () => {
    await signRequest.reject();

    const message = getSdkError('USER_REJECTED_METHODS').message;
    expect(signClientSpy.respond).toHaveBeenCalledOnceWith({
      topic: rawPersonalSignRequest.topic,
      response: {
        id: rawPersonalSignRequest.id,
        jsonrpc: '2.0',
        error: { code: -32000, message },
      },
    });
  });
});
