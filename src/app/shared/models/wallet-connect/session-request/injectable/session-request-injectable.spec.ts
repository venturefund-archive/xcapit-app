import { SessionRequestInjectable } from './session-request-injectable';
import { rawPersonalSignRequest } from 'src/app/modules/wallets/shared-wallets/fixtures/raw-wallet-connect-requests';
import { SignRequest } from '../sign-request/sign-request';
import { FakeWallet } from '../../../../../modules/swaps/shared-swaps/models/wallet/wallet';
import { SignClientInjectable } from '../../sign-client/injectable/sign-client.injectable';
import { SignClientV2 } from '../../sign-client/sign-client';

describe('SessionRequestInjectable', () => {
  let signClientSpy: jasmine.SpyObj<SignClientV2>;
  let signClientInjectableSpy: jasmine.SpyObj<SignClientInjectable>;
  let fakeWallet: FakeWallet;
  let sessionRequestInjectable: SessionRequestInjectable;

  beforeEach(() => {
    signClientInjectableSpy = jasmine.createSpyObj('SignClientInjectable', {
      create: signClientSpy,
    });
    sessionRequestInjectable = new SessionRequestInjectable(signClientInjectableSpy);
  });

  it('new', () => {
    expect(sessionRequestInjectable).toBeTruthy();
  });

  it('createRequest and request', async () => {
    await sessionRequestInjectable.createRequest(rawPersonalSignRequest, fakeWallet);
    expect(sessionRequestInjectable.request()).toBeInstanceOf(SignRequest);
  });
});
