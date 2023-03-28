import { PendingProposal } from 'src/app/modules/wallets/shared-wallets/models/wallet-connect/pending-proposal/pending-proposal';

import { SignClientV2 } from 'src/app/shared/models/wallet-connect/sign-client/sign-client';
import { WCUri } from 'src/app/shared/models/wallet-connect/wc-uri/WCUri';
import { PairTo } from './pair-to';
import { rawProposal } from '../../../../modules/wallets/shared-wallets/fixtures/raw-proposal.fixture';
import { FakeWallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { DefaultBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains';
import { rawBlockchainsData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';

describe('PairTo', () => {
  let testUri: WCUri;
  let signClientSpy: jasmine.SpyObj<SignClientV2>;
  let pairTo: PairTo;
  let fakeWallet: FakeWallet;
  beforeEach(() => {
    testUri = new WCUri('testUri');

    signClientSpy = jasmine.createSpyObj('SignClientV2', {
      pair: Promise.resolve(),
      on: null,
    });

    fakeWallet = new FakeWallet(
      Promise.resolve(),
      null,
      '0xtest_wallet',
      new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData)).oneByName('ERC20')
    );

    pairTo = new PairTo(testUri, fakeWallet, signClientSpy);
  });

  it('new', () => {
    expect(pairTo).toBeTruthy();
  });

  it('value should return a pending proposal when connection is successful', async () => {
    signClientSpy.on.and.callFake((eventName, callback) => {
      if (eventName === 'session_proposal') {
        callback(rawProposal);
      }
    });
    expect(await pairTo.value()).toEqual(new PendingProposal(rawProposal, fakeWallet, signClientSpy));
  });

  it('value should throw an error when pair fails', async () => {
    const expectedError = new Error('pair error');
    signClientSpy.pair.and.throwError(expectedError);
    pairTo.value().catch((error) => {
      expect(error).toEqual(expectedError);
    });
  });
});
