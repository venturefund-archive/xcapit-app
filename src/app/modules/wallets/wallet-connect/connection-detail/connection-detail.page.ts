import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WalletConnectService } from '../../shared-wallets/services/wallet-connect/wallet-connect.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-connection-detail',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home" (click)="this.backNavigation()"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">
          {{ 'wallets.wallet_connect.connection_detail.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <app-informative-card
        *ngIf="this.connectionStatus"
        [title]="'wallets.wallet_connect.connection_detail.card_title_connected'"
        [description]="'wallets.wallet_connect.connection_detail.card_description_connected'"
      ></app-informative-card>
      <app-informative-card
        *ngIf="!this.connectionStatus"
        [title]="'wallets.wallet_connect.connection_detail.card_title_disconnected'"
        [description]="'wallets.wallet_connect.connection_detail.card_description_disconnected'"
      ></app-informative-card>
      <div class="ux_content">
        <div class="wcdc">
          <div class="wcdc__logo">
            <img src="{{ this.peerMeta?.icons[0] }}" />
          </div>
          <div class="wcdc__provider_name">
            <ion-label>
              {{ this.peerMeta?.name }}
            </ion-label>
          </div>
          <div class="wcdc__connection">
            <div class="wcdc__connection__connected" *ngIf="this.connectionStatus">
              <ion-icon name="checkmark-circle-outline" class="wcdc__connection__icon"></ion-icon>
              <ion-label>
                {{ 'wallets.wallet_connect.connection_detail.connection_status.connected' | translate }}
              </ion-label>
            </div>

            <div class="wcdc__connection__disconnected" *ngIf="!this.connectionStatus">
              <ion-icon name="close-circle-outline" class="wcdc__connection__icon"></ion-icon>
              <ion-label>
                {{ 'wallets.wallet_connect.connection_detail.connection_status.disconnected' | translate }}
              </ion-label>
            </div>
          </div>

          <div class="wcdc__provider_detail">
            <ion-label> URL: {{ this.peerMeta?.url }} </ion-label>
            <ion-label *ngIf="this.peerMeta?.description">
              {{ 'wallets.wallet_connect.connection_detail.description' | translate }}: {{ this.peerMeta?.description }}
            </ion-label>
          </div>

          <div class="list-divider"></div>

          <div class="wcdc__permission_details">
            <ion-label>
              {{ 'wallets.wallet_connect.connection_detail.permissions' | translate }}
            </ion-label>
          </div>
        </div>

        <ion-button
          class="ux_button connect_button"
          appTrackClick
          name="Next"
          color="uxsecondary"
          size="large"
          (click)="approveSession()"
          *ngIf="!this.connectionStatus"
        >
          {{ 'wallets.wallet_connect.button_connect' | translate }}
        </ion-button>

        <div class="disconnect_link" *ngIf="this.connectionStatus">
          <a (click)="this.disconnectSession()">{{ 'wallets.wallet_connect.button_disconnect' | translate }}</a>
        </div>

        <div class="disclaimer ion-margin-top">
          <span>{{ 'wallets.wallet_connect.disclaimer_1' | translate }}</span>
          <span>
            {{ 'wallets.wallet_connect.disclaimer_2' | translate }}

            <ion-button
              name="Support Help"
              class="ux-link-xs disclaimer__button"
              (click)="this.supportHelp()"
              appTrackClick
              fill="clear"
            >
              {{ 'wallets.wallet_connect.disclaimer_support' | translate }}
            </ion-button>
          </span>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./connection-detail.page.scss'],
})
export class ConnectionDetailPage implements OnInit {
  public peerMeta;
  public connectionStatus = false;

  constructor(
    private walletConnectService: WalletConnectService,
    private navController: NavController,
    private alertController: AlertController,
    private translate: TranslateService
  ) {}

  ionViewWillEnter() {
    this.checkProtocolInfo();
    this.checkConnectionStatus();
  }

  ngOnInit() {}

  async checkProtocolInfo() {
    if (!this.walletConnectService.peerMeta) {
      await this.walletConnectService.killSession();
      this.backNavigation();
    } else {
      this.peerMeta = this.walletConnectService.peerMeta;
    }
  }

  async backNavigation() {
    if (this.walletConnectService.connected) {
      this.navController.navigateBack(['/tab/home']);
    } else {
      this.navController.pop();
    }
  }

  async checkConnectionStatus() {
    this.connectionStatus = this.walletConnectService.connected;
  }

  public async approveSession(): Promise<void> {
    try {
      await this.walletConnectService.approveSession();
      this.connectionStatus = true;
    } catch (error) {
      const alert = await this.alertController.create({
        header: this.translate.instant('wallets.wallet_connect.connection_detail.errors.header'),
        message: this.translate.instant('wallets.wallet_connect.connection_detail.errors.message'),
        cssClass: 'ux-alert-small-text',
        buttons: [
          {
            text: this.translate.instant('wallets.wallet_connect.connection_detail.errors.close_button'),
            role: 'cancel',
            cssClass: 'ux-link-xs',
          },
        ],
      });
      await alert.present();
    }
  }

  public async disconnectSession() {
    const alert = await this.alertController.create({
      header: this.translate.instant('wallets.wallet_connect.connection_detail.disconnect.header'),
      message: this.translate.instant('wallets.wallet_connect.connection_detail.disconnect.message'),
      buttons: [
        {
          text: this.translate.instant('wallets.wallet_connect.connection_detail.disconnect.cancel_button'),
        },
        {
          text: this.translate.instant('wallets.wallet_connect.connection_detail.disconnect.accept_button'),
          handler: async () => {
            await this.killSession();
          },
        },
      ],
    });
    await alert.present();
  }

  public async killSession() {
    try {
      this.connectionStatus = false;
      await this.walletConnectService.killSession();
    } catch (error) {
      console.log('Wallet Connect - killSession error: ', error);
    } finally {
      this.navController.navigateRoot(['wallets/wallet-connect/new-connection']);
    }
  }

  supportHelp() {
    this.navController.navigateForward('/tickets/create-support-ticket');
  }
}
