import { SignClientV2 } from '../../sign-client/sign-client';
import { SessionRequestFactory } from './session-request-factory';
import { rawPersonalSignRequest } from '../../../../../modules/wallets/shared-wallets/fixtures/raw-wallet-connect-requests';
import { SignRequest } from '../sign-request/sign-request';
import { NullRequest } from '../null-request/null-request';
import { FakeWallet } from '../../../../../modules/wallets/shared-wallets/models/wallet/fake/fake-wallet';
import { SessionRequest } from '../../session-request/session-request';
import { SignClientTypes } from '@walletconnect/types';

describe('SessionRequestFactory', () => {
  let signClientSpy: jasmine.SpyObj<SignClientV2>;
  let sessionRequestFactory: SessionRequestFactory;
  let fakeWallet: FakeWallet;

  beforeEach(() => {
    sessionRequestFactory = new SessionRequestFactory(signClientSpy);
  });

  it('new', () => {
    expect(sessionRequestFactory).toBeTruthy();
  });

  it('createRequest must create a sign request if the method is personal_sign', async () => {
    expect(
      await sessionRequestFactory.create(new SessionRequest(rawPersonalSignRequest), fakeWallet)
    ).toBeInstanceOf(SignRequest);
  });

  it('createRequest must create a null request if doesnt meet any method criteria', async () => {
    const nullRequest = { params: { request: { method: 'nullMethod' } } } as SignClientTypes.EventArguments['session_request'];
    expect(await sessionRequestFactory.create(new SessionRequest(nullRequest), fakeWallet)).toBeInstanceOf(
      NullRequest
    );
  });
});
