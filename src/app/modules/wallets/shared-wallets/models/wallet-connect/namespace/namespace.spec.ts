import { Namespace, RawNamespace } from './namespace';
import { ValidatedNamespaces } from '../namespaces/namespaces';
import { NamespaceErrorMsgs } from '../namespace-error-msgs/namespace-error-msgs';
import {
  rawNamespaceWithTwoChains,
  rawNamespaceWithNotMatchingNetwork,
} from '../../../fixtures/raw-namespaces.fixture';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { DefaultBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/default/default-blockchains';
import {
  rawBlockchainsData,
  rawEthereumData,
  rawPolygonData,
  rawSolanaData,
} from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { FakeWallet } from '../../wallet/fake/fake-wallet';
import { rawOptionalNamespaces, rawRequiredNamespaces } from '../../../fixtures/raw-proposal.fixture';
import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { Wallets } from '../../wallets/wallets.interface';
import { FakeWallets } from '../../wallets/fake-wallets/fake-wallets';
import { FakeBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/fake/fake-blockchains';
import { Blockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains.interface';

describe('Namespace', () => {
  let rawRequiredNamespace: RawNamespace;
  let rawOptionalNamespace: RawNamespace | any;
  let validatedNamespaces: ValidatedNamespaces;
  let resultNamespaceMultiNetwork: ValidatedNamespaces;
  let namespace: Namespace;
  const supportedNamespace = 'eip155';
  let fakeWallet: FakeWallet;
  let blockchains: Blockchains;
  let wallets: Wallets;

  beforeEach(() => {
    rawRequiredNamespace = {
      methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
      chains: ['eip155:1'],
      events: ['chainChanged', 'accountsChanged'],
    };

    rawOptionalNamespace = {
      methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
      chains: ['eip155:1', 'eip155:137', 'eip155:1313161554'],
      events: ['chainChanged', 'accountsChanged'],
      rpcMap: {
        '1': 'https://eth-mainnet.g.alchemy.com/v2/V4IJ6qnD4Rb18k6jW_LJJfB9xSwiUbIC',
        '137': 'https://polygon-mainnet.g.alchemy.com/v2/hykYnKHGAJEKXerGbivc33lk-Zu36F_P',
        '1313161554': 'https://mainnet.aurora.dev',
      },
    };

    validatedNamespaces = {
      eip155: {
        methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
        accounts: ['eip155:1:0xtest_wallet'],
        events: ['chainChanged', 'accountsChanged'],
      },
    };

    resultNamespaceMultiNetwork = {
      eip155: {
        methods: ['eth_sendTransaction', 'personal_sign'],
        events: ['chainChanged', 'accountsChanged'],
        accounts: ['eip155:1:0xtest_wallet', 'eip155:137:0xtest_wallet2'],
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
    namespace = new Namespace(supportedNamespace, fakeWallet, rawRequiredNamespace, undefined, blockchains, wallets);
  });

  it('new', () => {
    expect(namespace).toBeTruthy();
  });

  it('should return a validated namespace when the required namespace is valid', async () => {
    expect(await namespace.value()).toEqual(validatedNamespaces);
  });

  it('should throw an error when there are more than one chain in the required namespace', async () => {
    try {
      await new Namespace(
        supportedNamespace,
        fakeWallet,
        rawNamespaceWithTwoChains,
        undefined,
        blockchains,
        wallets
      ).value();
    } catch (error) {
      expect(error).toEqual(new Error(new NamespaceErrorMsgs().onlyOneChain()));
    }
  });

  it('should return a validated namespace when the user selected network is among the dApp networks and the required network is supported', async () => {
    const responseNamespace = {
      eip155: {
        methods: ['eth_sendTransaction', 'personal_sign'],
        events: ['chainChanged', 'accountsChanged'],
        accounts: ['eip155:1:0xtest_wallet', 'eip155:137:0xtest_wallet'],
      },
    };

    const fakePolygonWallet = new FakeWallet(
      Promise.resolve(),
      null,
      '0xtest_wallet',
      new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData)).oneByName('MATIC')
    );
    const namespace = new Namespace(
      supportedNamespace,
      fakePolygonWallet,
      rawRequiredNamespaces.ethereum[supportedNamespace],
      rawOptionalNamespaces[supportedNamespace],
      blockchains,
      wallets
    );
    expect(await namespace.value()).toEqual(responseNamespace);
  });

  it('should throw an error when the user selected network is not among the dApp networks and the required network is supported', async () => {
    const fakeSolanaWallet = new FakeWallet(
      Promise.resolve(),
      null,
      '0xtest_wallet',
      new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData)).oneByName('SOLANA')
    );

    const namespace = new Namespace(
      supportedNamespace,
      fakeSolanaWallet,
      rawRequiredNamespaces.ethereum[supportedNamespace],
      rawOptionalNamespaces[supportedNamespace],
      blockchains,
      wallets
    );
    try {
      await namespace.value();
    } catch (error) {
      expect(error).toEqual(new Error(new NamespaceErrorMsgs().notMatchingNetwork()));
    }
  });

  it('should throw an error when the required network is not supported', async () => {
    const namespace = new Namespace(
      supportedNamespace,
      fakeWallet,
      rawNamespaceWithNotMatchingNetwork,
      rawOptionalNamespaces[supportedNamespace],
      blockchains,
      wallets
    );
    try {
      await namespace.value();
    } catch (error) {
      expect(error).toEqual(new Error(new NamespaceErrorMsgs().notSupportedNetwork()));
    }
  });
});
