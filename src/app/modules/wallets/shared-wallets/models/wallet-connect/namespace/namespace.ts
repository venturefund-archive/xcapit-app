import { ProposalTypes, SessionTypes } from '@walletconnect/types';
import { Wallet } from 'src/app/modules/wallets/shared-wallets/models/wallet/wallet';
import { NamespaceErrorMsgs } from '../namespace-error-msgs/namespace-error-msgs';
import { ValidatedNamespaces } from '../namespaces/namespaces';
import { structuredClone } from '../../../../../../shared/utils/structured-clone';

export type RawNamespace = ProposalTypes.RequiredNamespace;
export type ValidatedNamespace = SessionTypes.Namespace;

export class Namespace {
  constructor(
    private readonly _aNamespaceName: string,
    private readonly _rawData: RawNamespace,
    private readonly _aWallet: Wallet
  ) {}

  public value(): ValidatedNamespaces {
    this._validateOnlyOneNetworkAtTheSameTime();
    this._validateMatchingNetwork();

    return { [this._aNamespaceName]: this._validatedNamespace() };
  }

  private _validateOnlyOneNetworkAtTheSameTime() {
    if (this._rawData.chains.length > 1) {
      throw new Error(new NamespaceErrorMsgs().onlyOneChain());
    }
  }

  private _validateMatchingNetwork() {
    const requiredNamespaceChainId = this._rawData.chains[0].split(':')[1];
    if (requiredNamespaceChainId !== this._aWallet.blockchain().id()) {
      throw new Error(new NamespaceErrorMsgs().notMatchingNetwork());
    }
  }

  private _validatedNamespace(): ValidatedNamespace {
    const namespace = structuredClone(this._rawData);
    namespace.accounts = [this._account()];
    delete namespace.chains;
    return namespace;
  }

  private _account(): string {
    const namespaceAndChainId = this._rawData.chains[0];
    return `${namespaceAndChainId}:${this._aWallet.address()}`;
  }
}
