import { PendingProposal, Proposal } from './pending-proposal';
import { SignClientV2 } from '../../../../../../shared/models/wallet-connect/sign-client/sign-client';
import { rawSession } from '../../../fixtures/raw-session.fixture';
import { rawProposal } from '../../../fixtures/raw-proposal.fixture';
import { FakeWallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { DefaultBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains';
import { rawBlockchainsData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';

describe('PendingProposal', () => {
  let signClientV2Spy: jasmine.SpyObj<SignClientV2>;
  let pendingProposal: PendingProposal;
  let fakeWallet: FakeWallet;

  beforeEach(() => {
    fakeWallet = new FakeWallet(
      Promise.resolve(),
      null,
      '0xtest_wallet',
      new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData)).oneByName('ERC20')
    );
    signClientV2Spy = jasmine.createSpyObj('SignClientV2', {
      approve: Promise.resolve({
        topic: 'test_topic',
        acknowledged: () => Promise.resolve(rawSession),
      }),
    });
    pendingProposal = new PendingProposal(rawProposal, fakeWallet, signClientV2Spy);
  });

  it('new', () => {
    expect(pendingProposal).toBeTruthy();
  });

  it('peerMetadata', () => {
    expect(pendingProposal.peerMetadata()).toEqual(rawProposal.params.proposer.metadata);
  });

  it('wallet', () => {
    expect(pendingProposal.wallet().address()).toEqual(fakeWallet.address());
  });

  it('approve', async () => {
    expect(await pendingProposal.approve()).toEqual(rawSession);
  });
});