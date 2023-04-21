import { Namespace, RawNamespace, ValidatedNamespace } from './namespace';
import { ValidatedNamespaces } from '../namespaces/namespaces';
import { NamespaceErrorMsgs } from '../namespace-error-msgs/namespace-error-msgs';
import {
  rawNamespaceWithTwoChains,
  rawNamespaceWithNotMatchingNetwork,
} from '../../../fixtures/raw-namespaces.fixture';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { DefaultBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains';
import { rawBlockchainsData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { FakeWallet } from '../../../../../swaps/shared-swaps/models/wallet/fake/fake-wallet';

describe('Namespace', () => {
  let rawValidNamespace: RawNamespace;
  let validatedNamespaces: ValidatedNamespaces;
  let namespace: Namespace;
  const supportedNamespace = 'eip155';
  let fakeWallet: FakeWallet;

  beforeEach(() => {
    rawValidNamespace = {
      methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
      chains: ['eip155:1'],
      events: ['chainChanged', 'accountsChanged'],
    };

    validatedNamespaces = {
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
    namespace = new Namespace(supportedNamespace, rawValidNamespace, fakeWallet);
  });

  it('new', () => {
    expect(namespace).toBeTruthy();
  });

  it('should return a validated namespace when the required namespace is valid', () => {
    expect(namespace.value()).toEqual(validatedNamespaces);
  });

  it('should throw an error when there are more than one chain in the required namespace', () => {
    expect(() => new Namespace(supportedNamespace, rawNamespaceWithTwoChains, fakeWallet).value()).toThrow(
      new Error(new NamespaceErrorMsgs().onlyOneChain())
    );
  });

  it('should throw an error when selected wallet network does not match the chain in required namespace', () => {
    expect(() => new Namespace(supportedNamespace, rawNamespaceWithNotMatchingNetwork, fakeWallet).value()).toThrow(
      new Error(new NamespaceErrorMsgs().notMatchingNetwork())
    );
  });
});
