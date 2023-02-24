import { SignClientV2 } from '../../sign-client/sign-client';
import { SessionRequestFactory } from './session-request-factory';
import {
  rawPersonalSignRequest,
  rawEthSignRequest,
} from '../../../../../modules/wallets/shared-wallets/fixtures/raw-wallet-connect-requests';
import { FakeWallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { SignRequest } from '../sign-request/sign-request';

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
});
