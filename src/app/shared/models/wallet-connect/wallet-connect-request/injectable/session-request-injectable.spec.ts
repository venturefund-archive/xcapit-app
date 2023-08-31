import { SessionRequestInjectable } from './session-request-injectable';
import { rawPersonalSignRequest } from 'src/app/modules/wallets/shared-wallets/fixtures/raw-wallet-connect-requests';
import { SignRequest } from '../sign-request/sign-request';
import { SignClientInjectable } from '../../sign-client/injectable/sign-client.injectable';
import { SignClientV2 } from '../../sign-client/sign-client';
import { FakeWallet } from '../../../../../modules/wallets/shared-wallets/models/wallet/fake/fake-wallet';
import { SessionRequest } from '../../session-request/session-request';

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
    await sessionRequestInjectable.createRequest(new SessionRequest(rawPersonalSignRequest), fakeWallet);
    expect(sessionRequestInjectable.request()).toBeInstanceOf(SignRequest);
  });

});
