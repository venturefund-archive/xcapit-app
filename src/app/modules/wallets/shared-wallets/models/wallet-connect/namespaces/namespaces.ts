import { ProposalTypes, SessionTypes } from '@walletconnect/types';
import { Wallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { NamespaceErrorMsgs } from '../namespace-error-msgs/namespace-error-msgs';
import { Namespace } from '../namespace/namespace';

export type RawNamespaces = ProposalTypes.RequiredNamespaces;

export type ValidatedNamespaces = SessionTypes.Namespaces;

export class Namespaces {
  constructor(private readonly _rawNamespaces: RawNamespaces, private readonly _aWallet: Wallet) {}

  public value(): ValidatedNamespaces {
    this._validateOnlyOneNamespacePerSession();
    this._validateSupportedNamespaces();

    const supportedNamespace = this._supportedNamespaces()[0];
    return new Namespace(supportedNamespace, this._rawNamespaces[supportedNamespace], this._aWallet).value();
  }

  private _validateOnlyOneNamespacePerSession(): void {
    if (Object.keys(this._rawNamespaces).length > 1) {
      throw new Error(new NamespaceErrorMsgs().onlyOneNamespace());
    }
  }

  private _validateSupportedNamespaces() {
    const unsupportedNamespaces = Object.keys(this._rawNamespaces).filter((namespace) => {
      return this._supportedNamespaces().includes(namespace) ? false : true;
    });
    if (unsupportedNamespaces.length > 0) {
      throw new Error(new NamespaceErrorMsgs().notSupportedNamespaces(unsupportedNamespaces));
    }
  }

  private _supportedNamespaces(): string[] {
    return ['eip155'];
  }
}
