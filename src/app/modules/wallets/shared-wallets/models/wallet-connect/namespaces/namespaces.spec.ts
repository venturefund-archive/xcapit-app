import { ValidatedNamespaces } from '../namespaces/namespaces';
import { NamespaceErrorMsgs } from '../namespace-error-msgs/namespace-error-msgs';
import { Namespaces } from './namespaces';
import {
  rawRequiredNamespacesWithTwoNamespaces,
  rawRequiredNamespacesWithUnsupportedNamespace,
  rawValidRequiredNamespaces,
} from '../../../fixtures/raw-namespaces.fixture';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import {
  rawBlockchainsData,
  rawEthereumData,
  rawPolygonData,
  rawSolanaData,
} from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { FakeWallet } from '../../wallet/fake/fake-wallet';
import { DefaultBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/default/default-blockchains';
import { Blockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains.interface';
import { Wallets } from '../../wallets/wallets.interface';
import { FakeWallets } from '../../wallets/fake-wallets/fake-wallets';
import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { FakeBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/fake/fake-blockchains';
import { rawOptionalNamespaces } from '../../../fixtures/raw-proposal.fixture';

describe('Namespaces', () => {
  let expectedValidatedNamespaces: ValidatedNamespaces;
  let namespaces: Namespaces;
  let fakeWallet: FakeWallet;
  let blockchains: Blockchains;
  let wallets: Wallets;

  beforeEach(() => {
    expectedValidatedNamespaces = {
      eip155: {
        methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
        accounts: ['eip155:1:0xtest_wallet'],
        events: ['chainChanged', 'accountsChanged'],
      },
    };

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
    namespaces = new Namespaces(fakeWallet, rawValidRequiredNamespaces, undefined, blockchains, wallets);
  });

  it('new', () => {
    expect(namespaces).toBeTruthy();
  });

  it('should return a validated namespace when the required namespaces has only one chain and namespaces are valid', async () => {
    expect(await namespaces.value()).toEqual(expectedValidatedNamespaces);
  });

  it('should throw an error when there is more than one namespace in the required namespaces', async () => {
    try {
      await new Namespaces(fakeWallet, rawRequiredNamespacesWithTwoNamespaces, undefined, blockchains, wallets).value();
    } catch (error) {
      expect(error).toEqual(new Error(new NamespaceErrorMsgs().onlyOneNamespace()));
    }
  });

  it('should throw an error when proposal namespace is not supported', async () => {
    try {
      await new Namespaces(
        fakeWallet,
        rawRequiredNamespacesWithUnsupportedNamespace,
        undefined,
        blockchains,
        wallets
      ).value();
    } catch (error) {
      expect(error).toEqual(new Error(new NamespaceErrorMsgs().notSupportedNamespaces(['bip122'])));
    }
  });

  it('should return a validated namespace when there are required and optional namespaces', async () => {
    expect(
      await new Namespaces(fakeWallet, rawValidRequiredNamespaces, rawOptionalNamespaces, blockchains, wallets).value()
    ).toEqual(expectedValidatedNamespaces);
  });
});
