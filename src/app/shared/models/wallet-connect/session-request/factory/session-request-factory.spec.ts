import { SignClientV2 } from '../../sign-client/sign-client';
import { SessionRequestFactory } from './session-request-factory';
import {
  rawPersonalSignRequest,
  rawEthSignRequest,
} from '../../../../../modules/wallets/shared-wallets/fixtures/raw-wallet-connect-requests';
import { SignRequest } from '../sign-request/sign-request';
import { NullRequest } from '../null-request/null-request';
import { RawSessionRequest } from '../raw-session-request.type';
import { FakeWallet } from '../../../../../modules/swaps/shared-swaps/models/wallet/fake/fake-wallet';

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
    expect(await sessionRequestFactory.createRequest(rawPersonalSignRequest, fakeWallet)).toBeInstanceOf(SignRequest);
  });

  it('createRequest must create a sign request if the method is eth_sign', async () => {
    expect(await sessionRequestFactory.createRequest(rawEthSignRequest, fakeWallet)).toBeInstanceOf(SignRequest);
  });

  it('createRequest must create a null request if doesnt meet any method criteria', async () => {
    const nullRequest = { params: { request: { method: 'nullMethod' } } } as RawSessionRequest;
    expect(await sessionRequestFactory.createRequest(nullRequest, fakeWallet)).toBeInstanceOf(NullRequest);
  });
});
