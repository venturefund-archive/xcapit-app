import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { WalletBackupService } from '../../services/wallet-backup/wallet-backup.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TokenOperationDataService } from 'src/app/modules/fiat-ramps/shared-ramps/services/token-operation-data/token-operation-data.service';
import { DefaultSwapsUrls } from 'src/app/modules/swaps/shared-swaps/routes/default-swaps-urls';

@Component({
  selector: 'app-wallet-subheader-buttons',
  template: `
    <div class="wsb">
      <div class="wsb__card-buttons">
        <ng-template [ngIf]="this.enabledToOperate">
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
        </ng-template>
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
        <ng-template [ngIf]="this.enabledToBuy && this.enabledToOperate">
          <div *appBuyCryptoFeatureFlag class="wsb__card-buttons__buy-card card">
            <app-icon-button-card
              (click)="this.goToBuy()"
              appTrackClick
              class="ux-font-text-lg"
              name="ux_go_to_buy"
              [text]="'wallets.home.subheader_buttons_component.buy_card' | translate"
              icon="ux-currency"
            ></app-icon-button-card>
          </div>
        </ng-template>
        <ng-template [ngIf]="this.enabledToOperate">
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
        </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['./wallet-subheader-buttons.component.scss'],
})
export class WalletSubheaderButtonsComponent implements OnInit {
  @Input() asset: string;
  @Input() tokenAddress: string;
  @Input() network: string;
  @Input() enabledToBuy = true;
  @Input() enabledToOperate = true;

  constructor(
    private navController: NavController,
    private walletBackupService: WalletBackupService,
    private storage: IonicStorageService,
    private tokenOperationDataService: TokenOperationDataService
  ) {}

  ngOnInit() {}

  async goToSend() {
    if ((await this.walletBackupService.presentModal()) === 'skip') {
      if (!this.asset) {
        return this.navController.navigateForward(['wallets/send/select-currency']);
      }

      return this.navController.navigateForward([
        'wallets/send/detail/blockchain',
        this.network,
        'token',
        this.tokenAddress,
      ]);
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
      const conditionsPurchasesAccepted = await this.storage.get('conditionsPurchasesAccepted');
      if (conditionsPurchasesAccepted) {
        this.asset
          ? this.tokenOperationDataService.set({
              asset: this.asset,
              network: this.network,
              isFirstTime: true,
            })
          : this.tokenOperationDataService.clean();
        return this.navController.navigateForward(['fiat-ramps/purchases']);
      }
      return this.navController.navigateForward(['fiat-ramps/buy-conditions']);
    }
  }

  async goToSwap() {
    if ((await this.walletBackupService.presentModal()) === 'skip') {
      this.navController.navigateForward(new DefaultSwapsUrls().home());
    }
  }
}
