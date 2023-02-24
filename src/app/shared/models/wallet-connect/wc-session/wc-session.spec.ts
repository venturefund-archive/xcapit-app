import { getSdkError } from '@walletconnect/utils';
import { FakeWallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { rawSession } from 'src/app/modules/wallets/shared-wallets/fixtures/raw-session.fixture';
import { SignClientV2 } from 'src/app/shared/models/wallet-connect/sign-client/sign-client';
import { WCSession } from './wc-session';

describe('WCSession', () => {
  let signClientSpy: jasmine.SpyObj<SignClientV2>;
  let wcSession: WCSession;

  beforeEach(() => {
    signClientSpy = jasmine.createSpyObj('SignClientV2', { disconnect: Promise.resolve() });
    wcSession = new WCSession(rawSession, signClientSpy, new FakeWallet(Promise.resolve(), null, '0xtest_wallet'));
  });

  it('new', () => {
    expect(wcSession).toBeTruthy();
  });

  it('wallet', () => {
    expect(wcSession.wallet().address()).toEqual('0xtest_wallet');
  });

  it('peerMetadata', () => {
    expect(wcSession.peerMetadata()).toEqual(rawSession.peer.metadata);
  });

  it('disconnect', () => {
    wcSession.disconnect();
    expect(signClientSpy.disconnect).toHaveBeenCalledOnceWith({
      topic: 'a847b03d85d017ff3b7b59b428a4b3f2fa443f49490c79ceb81204b9e2a1a391',
      reason: getSdkError('USER_DISCONNECTED'),
    });
  });
});
