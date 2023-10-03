import { NamespaceErrorMsgs, RawNamespaceErrorMsgs } from './namespace-error-msgs';

describe('NamespaceErrorMsgs', () => {
  let namespaceErrorMsgs: NamespaceErrorMsgs;
  let rawNamespaceErrorMsgs: RawNamespaceErrorMsgs;
  beforeEach(() => {
    rawNamespaceErrorMsgs = {
      onlyOneNamespace: 'testOnlyOneNamespaceMsg',
      onlyOneChain: 'testOnlyOneChainMsg',
      notSupportedNamespaces: 'testNotSupportedNamespacesMsg',
      notMatchingNetwork: 'testNotMatchingNetworkMsg',
      notSupportedNetwork: 'testNotSupportedChain',
    };
    namespaceErrorMsgs = new NamespaceErrorMsgs(rawNamespaceErrorMsgs);
  });
  it('new', () => {
    expect(namespaceErrorMsgs).toBeTruthy();
  });

  it('onlyOneNamespace', () => {
    expect(namespaceErrorMsgs.onlyOneNamespace()).toEqual(rawNamespaceErrorMsgs.onlyOneNamespace);
  });

  it('onlyOneChain', () => {
    expect(namespaceErrorMsgs.onlyOneChain()).toEqual(rawNamespaceErrorMsgs.onlyOneChain);
  });

  it('notSupportedNamespace', () => {
    expect(namespaceErrorMsgs.notSupportedNamespaces(['NotSupportedNamespace'])).toEqual(
      `${rawNamespaceErrorMsgs.notSupportedNamespaces}: NotSupportedNamespace`
    );
  });

  it('notMatchingNetwork', () => {
    expect(namespaceErrorMsgs.notMatchingNetwork()).toEqual(rawNamespaceErrorMsgs.notMatchingNetwork);
  });

  it('notSupportedNetwork', () => {
    expect(namespaceErrorMsgs.notSupportedNetwork()).toEqual(rawNamespaceErrorMsgs.notSupportedNetwork);
  });
});
