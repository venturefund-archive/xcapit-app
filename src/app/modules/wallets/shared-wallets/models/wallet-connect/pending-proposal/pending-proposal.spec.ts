import { PendingProposal } from './pending-proposal';
import { SignClientV2 } from '../../../../../../shared/models/wallet-connect/sign-client/sign-client';
import { rawSession } from '../../../fixtures/raw-session.fixture';
import { rawProposalWithoutOptionalNamespaces } from '../../../fixtures/raw-proposal.fixture';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import {
  rawBlockchainsData,
  rawEthereumData,
  rawPolygonData,
  rawSolanaData,
} from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { FakeWallet } from '../../wallet/fake/fake-wallet';
import { DefaultBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/default/default-blockchains';
import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { Blockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains.interface';
import { FakeBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/fake/fake-blockchains';
import { FakeWallets } from '../../wallets/fake-wallets/fake-wallets';
import { Wallets } from '../../wallets/wallets.interface';

describe('PendingProposal', () => {
  let signClientV2Spy: jasmine.SpyObj<SignClientV2>;
  let pendingProposal: PendingProposal;
  let fakeWallet: FakeWallet;
  let blockchains: Blockchains;
  let wallets: Wallets;

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
    wallets = new FakeWallets(fakeWallet);

    const blockchainsValueReturn = [
      new Blockchain(rawEthereumData),
      new Blockchain(rawPolygonData),
      new Blockchain(rawSolanaData),
    ];
    blockchains = new FakeBlockchains(blockchainsValueReturn, null, new Blockchain(rawPolygonData));
    pendingProposal = new PendingProposal(rawProposalWithoutOptionalNamespaces, fakeWallet, signClientV2Spy, blockchains, wallets);
  });

  it('new', () => {
    expect(pendingProposal).toBeTruthy();
  });

  it('peerMetadata', () => {
    expect(pendingProposal.peerMetadata()).toEqual(rawProposalWithoutOptionalNamespaces.params.proposer.metadata);
  });

  it('wallet', () => {
    expect(pendingProposal.wallet().address()).toEqual(fakeWallet.address());
  });

  it('approve', async () => {
    expect(await pendingProposal.approve()).toEqual(rawSession);
  });

  it('raw', () => {
    expect(pendingProposal.raw()).toEqual(rawProposalWithoutOptionalNamespaces);
  });
});
