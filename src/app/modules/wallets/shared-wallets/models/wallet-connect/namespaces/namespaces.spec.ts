import { ValidatedNamespaces } from '../namespaces/namespaces';
import { NamespaceErrorMsgs } from '../namespace-error-msgs/namespace-error-msgs';
import { Namespaces } from './namespaces';
import {
  rawRequiredNamespacesWithTwoNamespaces,
  rawRequiredNamespacesWithUnsupportedNamespace,
  rawValidRequiredNamespaces,
} from '../../../fixtures/raw-namespaces.fixture';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { DefaultBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains';
import { rawBlockchainsData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { FakeWallet } from '../../wallet/fake/fake-wallet';

describe('Namespaces', () => {
  let expectedValidatedNamespaces: ValidatedNamespaces;
  let namespaces: Namespaces;
  let fakeWallet: FakeWallet;

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

    namespaces = new Namespaces(rawValidRequiredNamespaces, fakeWallet);
  });

  it('new', () => {
    expect(namespaces).toBeTruthy();
  });

  it('should return a validated namespace when the required namespaces are valid', () => {
    expect(namespaces.value()).toEqual(expectedValidatedNamespaces);
  });

  it('should throw an error when there are more than one namespace in the required namespaces', () => {
    expect(() => new Namespaces(rawRequiredNamespacesWithTwoNamespaces, fakeWallet).value()).toThrow(
      new Error(new NamespaceErrorMsgs().onlyOneNamespace())
    );
  });

  it('should throw an error when selected wallet network does not match the chain in required namespace', () => {
    expect(() => new Namespaces(rawRequiredNamespacesWithUnsupportedNamespace, fakeWallet).value()).toThrow(
      new Error(new NamespaceErrorMsgs().notSupportedNamespaces(['bip122']))
    );
  });
});
