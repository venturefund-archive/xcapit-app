import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SignClientTypes } from '@walletconnect/types';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SignClientV2 } from 'src/app/shared/models/wallet-connect/sign-client/sign-client';
import { PairTo } from 'src/app/shared/models/wallet-connect/pair-to/pair-to';
import { Wallet } from 'src/app/modules/wallets/shared-wallets/models/wallet/wallet';
import { SessionRequestInjectable } from 'src/app/shared/models/wallet-connect/wallet-connect-request/injectable/session-request-injectable';
import { SignClientInjectable } from 'src/app/shared/models/wallet-connect/sign-client/injectable/sign-client.injectable';
import { WCSession } from 'src/app/shared/models/wallet-connect/wc-session/wc-session';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { PendingProposal } from '../../../models/wallet-connect/pending-proposal/pending-proposal';
import { SessionRequest } from '../../../../../../shared/models/wallet-connect/session-request/session-request';
import { WCUri } from 'src/app/shared/models/wallet-connect/wc-uri/wc-uri.interface';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { WCStorageService } from '../wc-storage/wc-storage.service';
import { ExistingProposal } from '../../../models/wallet-connect/existing-proposal/existing-proposal';
import { WalletsFactory } from '../../../models/wallets/factory/wallets.factory';

@Injectable({ providedIn: 'root' })
export class WCConnectionV2 {
  private _proposal: PendingProposal;
  private _session: WCSession;
  private _connected = false;

  constructor(
    private signClientInjectable: SignClientInjectable,
    private router: Router,
    private navController: NavController,
    private translate: TranslateService,
    private toastService: ToastService,
    private sessionRequestInjectable: SessionRequestInjectable,
    private wallets: WalletsFactory,
    private blockchains: BlockchainsFactory,
    private WcStorageService: WCStorageService
  ) {}

  public async pairTo(uri: WCUri, wallet: Wallet, pairingTopic?: string) {
    const existingProposal = new ExistingProposal(this.WcStorageService);
    const { proposal, chainId } = await existingProposal.value();
    const wallets = this.wallets.create();
    const blockchains = this.blockchains.create();
    if ((await existingProposal.exists()) && proposal.params.pairingTopic === pairingTopic) {
      this._proposal = new PendingProposal(
        proposal,
        await wallets.oneBy(blockchains.oneById(chainId)),
        await this.signClient(),
        blockchains,
        wallets
      );
    } else {
      this._proposal = await new PairTo(uri, wallet, await this.signClient(), blockchains, wallets).value();
      this.setWCStorageKeys(this._proposal.wallet().blockchain().id(), JSON.stringify(this._proposal.raw()));
    }
  }

  public proposal(): PendingProposal {
    return this._proposal;
  }

  public session(): WCSession {
    return this._session;
  }

  public connected(): boolean {
    return this._connected;
  }

  public async approveSession(): Promise<void> {
    this._session = new WCSession(await this.proposal().approve(), await this.signClient(), this.proposal().wallet());
    this._connected = true;
  }

  public closeSession() {
    this._session.disconnect();
    this._connected = false;
    this.removeStoredProposalKeys();
  }

  private signClient(): Promise<SignClientV2> {
    return this.signClientInjectable.create();
  }

  public async subscribeToAllEvents() {
    const signClient = await this.signClient();

    signClient.on('session_delete', async (proposal: SignClientTypes.EventArguments['session_proposal']) => {
      await this.sessionDelete();
    });

    signClient.on('session_request', async (request: SignClientTypes.EventArguments['session_request']) => {
      this.sessionRequestInjectable.createRequest(new SessionRequest(request), this.session().wallet());
      await this.navController.navigateForward(['wallets/wallet-connect/operation-detail']);
    });
  }

  public async sessionDelete() {
    const url = this.router.url.split('/').pop();

    if (url === 'connection-detail') {
      await this.navController.navigateBack(['wallets/wallet-connect/new-connection']);
    }

    this.closeSession();
    const dapp = this.session().peerMetadata.name;
    this.showDisconnectionToast(this.translate.instant('wallets.wallet_connect.dapp_disconnection.message', { dapp }));
  }

  private showDisconnectionToast(text: string) {
    this.toastService.showErrorToast({
      message: this.translate.instant(text),
    });
  }

  private async removeStoredProposalKeys() {
    await this.WcStorageService.remove('proposal_wallet_chain_id');
    await this.WcStorageService.remove('current_proposal');
  }

  private async setWCStorageKeys(chainId, proposal) {
    await this.WcStorageService.set('proposal_wallet_chain_id', chainId);
    await this.WcStorageService.set('current_proposal', proposal);
  }
}
