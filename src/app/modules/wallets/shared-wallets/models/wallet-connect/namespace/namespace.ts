import { ProposalTypes, SessionTypes } from '@walletconnect/types';
import { Wallet } from 'src/app/modules/wallets/shared-wallets/models/wallet/wallet';
import { NamespaceErrorMsgs } from '../namespace-error-msgs/namespace-error-msgs';
import { ValidatedNamespaces } from '../namespaces/namespaces';
import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';

import { Wallets } from '../../wallets/wallets.interface';
import { Blockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains.interface';

export type RawNamespace = ProposalTypes.RequiredNamespace;
export type ValidatedNamespace = SessionTypes.Namespace;

export type ResponseNamespace = SessionTypes.BaseNamespace;
export class Namespace {
  constructor(
    private readonly _aNamespaceName: string,
    private readonly _aSelectedWallet: Wallet,
    private readonly _rawRequiredNamespaceData: RawNamespace,
    private readonly _rawOptionalNamespaceData: RawNamespace | any | undefined,
    private readonly _blockchains: Blockchains,
    private readonly _userWallets: Wallets
  ) {}

  public async value(): Promise<ValidatedNamespaces> {
    this._validateOnlyOneNetworkOnRequiredNamespaces();
    this._validateOnlySupportedNetworkOnRequiredNamespace();
    this._validateMatchingNetwork();

    return { [this._aNamespaceName]: await this._validatedNamespaceData() };
  }

  private _validateOnlyOneNetworkOnRequiredNamespaces() {
    if (this._rawRequiredNamespaceData.chains.length > 1) {
      throw new Error(new NamespaceErrorMsgs().onlyOneChain());
    }
  }

  private _validateOnlySupportedNetworkOnRequiredNamespace() {
    const supportedChainIds = this._blockchains.value().map((blockchain: Blockchain) => blockchain.id());
    if (!supportedChainIds.includes(this._requiredNamespaceChainId())) {
      throw new Error(new NamespaceErrorMsgs().notSupportedNetwork());
    }
  }

  private _validateMatchingNetwork() {
    if (!this._availableNamespacesChainIds().includes(this._aSelectedWallet.blockchain().id())) {
      throw new Error(new NamespaceErrorMsgs().notMatchingNetwork());
    }
  }

  private _requiredNamespaceChainId(): string {
    return this._rawRequiredNamespaceData.chains[0].split(':')[1];
  }

  private _optionalNamespacesChainIds(): string[] {
    return this._rawOptionalNamespaceData.chains.map((namespaceChain) => namespaceChain.split(':')[1]);
  }

  private _availableNamespacesChainIds(): string[] {
    const availableNamespacesChainIds = [];
    if (this._rawOptionalNamespaceData) {
      availableNamespacesChainIds.push(...this._optionalNamespacesChainIds());
    }
    if (!availableNamespacesChainIds.includes(this._requiredNamespaceChainId())) {
      availableNamespacesChainIds.push(this._requiredNamespaceChainId());
    }
    return availableNamespacesChainIds;
  }

  private async _validatedNamespaceData(): Promise<ResponseNamespace> {
    return {
      methods: this._rawRequiredNamespaceData.methods,
      events: this._rawRequiredNamespaceData.events,
      accounts: await this._accounts(),
    };
  }

  private async _accounts(): Promise<string[]> {
    const accounts = [];
    for (const chainId of this._responseChainIds()) {
      accounts.push(await this._accountBy(chainId));
    }
    return accounts;
  }

  private _responseChainIds(): string[] {
    const chainIds = [this._requiredNamespaceChainId()];
    if (!chainIds.includes(this._aSelectedWallet.blockchain().id())) {
      chainIds.push(this._aSelectedWallet.blockchain().id());
    }
    return chainIds;
  }

  private async _accountBy(chainId: string): Promise<string> {
    return `${this._aNamespaceName}:${chainId}:${(
      await this._userWallets.oneBy(this._blockchains.oneById(chainId))
    ).address()}`;
  }
}
