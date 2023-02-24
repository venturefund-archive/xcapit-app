import { ProposalTypes } from '@walletconnect/types';

export type RawRequiredNamespaces = ProposalTypes.RequiredNamespaces;
export type RawNamespaceErrorMsgs = {
  onlyOneNamespace: string;
  notSupportedNamespaces: string;
  onlyOneChain: string;
  notMatchingNetwork: string;
};

const rawNamespaceErrorMsgsData: RawNamespaceErrorMsgs = {
  onlyOneNamespace: 'Only one namespace per session at a time is supported',
  notSupportedNamespaces: 'Namespace is not supported: ',
  onlyOneChain: 'Connection to multiple networks in the same session is not supported.',
  notMatchingNetwork: 'The network requested in the connection and the network of the selected wallet do not match.',
};

export class NamespaceErrorMsgs {
  constructor(private readonly _rawData: RawNamespaceErrorMsgs = rawNamespaceErrorMsgsData) {}

  public onlyOneNamespace(): string {
    return this._rawData.onlyOneNamespace;
  }

  public notSupportedNamespaces(unsupportedNamespaces: string[]): string {
    return `${this._rawData.notSupportedNamespaces}: ${unsupportedNamespaces.join(' ')}`;
  }

  public onlyOneChain(): string {
    return this._rawData.onlyOneChain;
  }

  public notMatchingNetwork(): string {
    return this._rawData.notMatchingNetwork;
  }
}
