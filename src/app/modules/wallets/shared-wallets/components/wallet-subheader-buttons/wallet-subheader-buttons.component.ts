import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { WarningBackupModalComponent } from '../warning-backup-modal/warning-backup-modal.component';
import { WalletBackupService } from '../../wallet-backup/wallet-backup.service';

@Component({
  selector: 'app-wallet-subheader-buttons',
  template: `
    <div class="wsb">
      <div class="wsb__card-buttons">
        <div class="wsb__card-buttons__send-card card">
          <app-icon-button-card
            (click)="this.goToSend()"
            appTrackClick
            class="ux-font-text-lg"
            name="ux_go_to_send"
            [text]="'wallets.home.subheader_buttons_component.send_card' | translate"
            icon="ux-arrow-up"
          ></app-icon-button-card>
        </div>
        <div class="wsb__card-buttons__receive-card card">
          <app-icon-button-card
            (click)="this.goToReceive()"
            appTrackClick
            class="ux-font-text-lg"
            name="ux_go_to_receive"
            [text]="'wallets.home.subheader_buttons_component.receive_card' | translate"
            icon="ux-arrow-down"
          ></app-icon-button-card>
        </div>
        <div *appFeatureFlag="'ff_buyCryptoHomeWalletButton'" class="wsb__card-buttons__buy-card card">
          <app-icon-button-card
            (click)="this.goToBuy()"
            appTrackClick
            class="ux-font-text-lg"
            name="ux_go_to_buy"
            [text]="'wallets.home.subheader_buttons_component.buy_card' | translate"
            icon="ux-currency"
          ></app-icon-button-card>
        </div>
        <div *appFeatureFlag="'ff_swap'" class="wsb__card-buttons__swap-card card">
          <app-icon-button-card
            (click)="this.goToSwap()"
            appTrackClick
            class="ux-font-text-lg"
            name="ux_go_to_swap"
            [text]="'wallets.home.subheader_buttons_component.swap_card' | translate"
            icon="ux-vertical-switch"
          ></app-icon-button-card>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./wallet-subheader-buttons.component.scss'],
})
export class WalletSubheaderButtonsComponent implements OnInit {
  @Input() asset: string;
  @Input() network: string;
  showBackupWarning = false;
  isProtectedWallet: boolean;
  isWarningModalOpen = false;

  constructor(
    private navController: NavController,
    private modalController: ModalController,
    private ionicStorageService: IonicStorageService,
    private remoteConfigService: RemoteConfigService,
    private walletBackupService: WalletBackupService
  ) {}

  ngOnInit() {
    this.checkBackupWarning();
  }

  private async shouldChangeNavigation(): Promise<boolean> {
    if (!this.isWarningModalOpen) {
      this.isWarningModalOpen = true;
      const shouldChangeNavigation = await this.showWarningBackupModal();

      switch (shouldChangeNavigation) {
        case 'skip':
          this.showBackupWarning = false;
          await this.ionicStorageService.set('backupWarningWallet', false);
          return false;
        case 'close':
        case 'backup':
          return true;
      }
    }

    return true;
  }

  async goToSend() {
    if ((await this.walletBackupService.presentModal()) === 'skip') {
      if (!this.asset) {
        return this.navController.navigateForward(['wallets/send/select-currency']);
      }

      const navigationExtras: NavigationExtras = {
        queryParams: {
          asset: this.asset,
          network: this.network,
        },
      };

      return this.navController.navigateForward(['wallets/send/detail'], navigationExtras);
    }
  }

  async goToReceive() {
    if ((await this.walletBackupService.presentModal()) === 'skip') {
      if (!this.asset) {
        return this.navController.navigateForward(['wallets/receive/select-currency']);
      }
      const navigationExtras: NavigationExtras = {
        queryParams: {
          asset: this.asset,
          network: this.network,
        },
      };
      return this.navController.navigateForward(['wallets/receive/detail'], navigationExtras);
    }
  }

  async goToBuy() {
    if ((await this.walletBackupService.presentModal()) === 'skip') {
      this.navController.navigateForward(['fiat-ramps/select-provider']);
    }
  }

  async goToSwap() {
    if ((await this.walletBackupService.presentModal()) === 'skip') {
      this.navController.navigateForward(['']);
    }
  }

  async checkBackupWarning() {
    if (this.remoteConfigService.getFeatureFlag('ff_homeWalletBackupWarningModal')) {
      this.showBackupWarning = await this.ionicStorageService.get('backupWarningWallet');
    }
  }

  async showWarningBackupModal(): Promise<string> {
    const modal = await this.modalController.create({
      component: WarningBackupModalComponent,
      componentProps: {},
      cssClass: 'ux-md-modal-informative',
      backdropDismiss: false,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.isWarningModalOpen = false;
    return data;
  }
}
