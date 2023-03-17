import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SignClientTypes } from '@walletconnect/types';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SignClientV2 } from 'src/app/shared/models/wallet-connect/sign-client/sign-client';
import { WCUri } from 'src/app/shared/models/wallet-connect/wc-uri/WCUri';
import { PairTo } from 'src/app/shared/models/wallet-connect/pair-to/pair-to';
import { Wallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { SessionRequestInjectable } from 'src/app/shared/models/wallet-connect/session-request/injectable/session-request-injectable';
import { SignClientInjectable } from 'src/app/shared/models/wallet-connect/sign-client/injectable/sign-client.injectable';
import { WCSession } from 'src/app/shared/models/wallet-connect/wc-session/wc-session';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { PendingProposal } from '../../../models/wallet-connect/pending-proposal/pending-proposal';

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
    private sessionRequestInjectable: SessionRequestInjectable
  ) {}

  public async pairTo(uri: WCUri, wallet: Wallet) {
    this._proposal = await new PairTo(uri, wallet, await this.signClient()).value();
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
  }

  private signClient(): Promise<SignClientV2> {
    return this.signClientInjectable.signClient();
  }

  public async subscribeToAllEvents() {
    const signClient = await this.signClient();

    signClient.on('session_delete', async (proposal: SignClientTypes.EventArguments['session_proposal']) => {
      await this.sessionDelete();
    });

    signClient.on('session_request', async (request: SignClientTypes.EventArguments['session_request']) => {
      this.sessionRequestInjectable.createRequest(request, this.session().wallet());
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
}
