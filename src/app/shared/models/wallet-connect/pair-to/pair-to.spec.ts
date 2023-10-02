import { PendingProposal } from 'src/app/modules/wallets/shared-wallets/models/wallet-connect/pending-proposal/pending-proposal';
import { SignClientV2 } from 'src/app/shared/models/wallet-connect/sign-client/sign-client';
import { DefaultWCUri } from 'src/app/shared/models/wallet-connect/wc-uri/default/default-wc-uri';
import { PairTo } from './pair-to';
import { rawProposalWithoutOptionalNamespaces } from '../../../../modules/wallets/shared-wallets/fixtures/raw-proposal.fixture';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import {
  rawBlockchainsData,
  rawEthereumData,
  rawPolygonData,
  rawSolanaData,
} from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { WCUri } from '../wc-uri/wc-uri.interface';
import { FakeWallet } from '../../../../modules/wallets/shared-wallets/models/wallet/fake/fake-wallet';
import { DefaultBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/default/default-blockchains';
import { Blockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains.interface';
import { Wallets } from 'src/app/modules/wallets/shared-wallets/models/wallets/wallets.interface';
import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { FakeBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/fake/fake-blockchains';
import { FakeWallets } from 'src/app/modules/wallets/shared-wallets/models/wallets/fake-wallets/fake-wallets';

describe('PairTo', () => {
  let testUri: WCUri;
  let signClientSpy: jasmine.SpyObj<SignClientV2>;
  let pairTo: PairTo;
  let fakeWallet: FakeWallet;
  let blockchains: Blockchains;
  let wallets: Wallets;

  beforeEach(() => {
    testUri = new DefaultWCUri('testUri');

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
    wallets = new FakeWallets(fakeWallet);

    const blockchainsValueReturn = [
      new Blockchain(rawEthereumData),
      new Blockchain(rawPolygonData),
      new Blockchain(rawSolanaData),
    ];
    blockchains = new FakeBlockchains(blockchainsValueReturn, null, new Blockchain(rawPolygonData));
    pairTo = new PairTo(testUri, fakeWallet, signClientSpy, blockchains, wallets);
  });

  it('new', () => {
    expect(pairTo).toBeTruthy();
  });

  it('value should return a pending proposal when connection is successful', async () => {
    signClientSpy.on.and.callFake((eventName, callback) => {
      if (eventName === 'session_proposal') {
        callback(rawProposalWithoutOptionalNamespaces);
      }
    });
    expect(await pairTo.value()).toEqual(
      new PendingProposal(rawProposalWithoutOptionalNamespaces, fakeWallet, signClientSpy, blockchains, wallets)
    );
  });

  it('value should throw an error when pair fails', async () => {
    const expectedError = new Error('pair error');
    signClientSpy.pair.and.throwError(expectedError);
    pairTo.value().catch((error) => {
      expect(error).toEqual(expectedError);
    });
  });
});
