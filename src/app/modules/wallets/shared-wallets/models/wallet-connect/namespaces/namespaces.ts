import { ProposalTypes, SessionTypes } from '@walletconnect/types';
import { Wallet } from 'src/app/modules/wallets/shared-wallets/models/wallet/wallet';
import { NamespaceErrorMsgs } from '../namespace-error-msgs/namespace-error-msgs';
import { Namespace } from '../namespace/namespace';
import { Blockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains.interface';
import { Wallets } from '../../wallets/wallets.interface';

export type RawNamespaces = ProposalTypes.RequiredNamespaces;

export type ValidatedNamespaces = SessionTypes.Namespaces;

export class Namespaces {
  constructor(
    private readonly _aWallet: Wallet,
    private readonly _rawRequiredNamespaces: RawNamespaces,
    private readonly _rawOptionalNamespaces: RawNamespaces | undefined,
    private readonly _blockchains: Blockchains,
    private readonly _wallets: Wallets
  ) {}

  public async value(): Promise<ValidatedNamespaces> {
    this._validateOnlyOneNamespacePerSession();
    this._validateSupportedNamespaces();

    const supportedNamespace = this._supportedNamespaces()[0];
    const optionalsNamespaces = this._rawOptionalNamespaces
      ? this._rawOptionalNamespaces[supportedNamespace]
      : undefined;

    return await new Namespace(
      supportedNamespace,
      this._aWallet,
      this._rawRequiredNamespaces[supportedNamespace],
      optionalsNamespaces,
      this._blockchains,
      this._wallets
    ).value();
  }

  private _validateOnlyOneNamespacePerSession(): void {
    if (Object.keys(this._rawRequiredNamespaces).length > 1) {
      throw new Error(new NamespaceErrorMsgs().onlyOneNamespace());
    }
  }

  private _validateSupportedNamespaces() {
    const unsupportedNamespaces = Object.keys(this._rawRequiredNamespaces).filter((namespace) => {
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
