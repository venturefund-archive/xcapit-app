import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { InformativeModalComponent } from 'src/app/modules/menus/main-menu/components/informative-modal/informative-modal.component';
import { ApiApikeysService } from 'src/app/modules/apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';
import { ToastAlertComponent } from 'src/app/shared/components/new-toasts/toast-alert/toast-alert.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-wallet-subheader-buttons',
  template: `
    <div class="wsb">
      <div class="wsb__card-buttons">
        <div class="wsb__card-buttons__send-card card">
          <app-icon-button-card
            (click)="this.goToSend()"
            appTrackClick
            name="Go to Send"
            [text]="'wallets.home.subheader_buttons_component.send_card' | translate"
            icon="ux-wallet"
          ></app-icon-button-card>
        </div>
        <div class="wsb__card-buttons__receive-card card">
          <app-icon-button-card
            (click)="this.goToReceive()"
            appTrackClick
            name="Go to Receive"
            [text]="'wallets.home.subheader_buttons_component.receive_card' | translate"
            icon="ux-money-flow"
          ></app-icon-button-card>
        </div>
        <div class="wsb__card-buttons__buy-card card">
          <app-icon-button-card
            (click)="this.goToBuy()"
            appTrackClick
            name="Go to Buy"
            [text]="'wallets.home.subheader_buttons_component.buy_card' | translate"
            icon="ux-buy-sell"
          ></app-icon-button-card>
        </div>
        <div class="wsb__card-buttons__performance card">
          <app-icon-button-card
            (click)="this.goToPerformance()"
            appTrackClick
            name="Go to Performance"
            [text]="'wallets.home.subheader_buttons_component.performance_card' | translate"
            icon="ux-buysell-icon"
          ></app-icon-button-card>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./wallet-subheader-buttons.component.scss'],
})
export class WalletSubheaderButtonsComponent implements OnInit {
  @Input() asset: string;
  apikeys: any = [];

  constructor(
    private navController: NavController,
    private modalController: ModalController,
    private apiApikeysService: ApiApikeysService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.getAllApiKeys();
  }

  goToSend() {
    if (!this.asset) {
      return this.navController.navigateForward(['wallets/send/select-currency']);
    }

    return this.navController.navigateForward(['wallets/send/detail/' + this.asset]);
  }

  goToReceive() {
    if (!this.asset) {
      return this.navController.navigateForward(['wallets/receive']);
    }
    const navigationExtras: NavigationExtras = {
      queryParams: {
        asset: this.asset,
      },
    };

    return this.navController.navigateForward(['wallets/receive'], navigationExtras);
  }

  async goToBuy() {
    if (!this.asset && this.apikeys.length > 0) {
      this.navController.navigateForward('/fiat-ramps/operations');
    } else {
      await this.openNoApiKeysModal();
    }
  }

  async goToPerformance() {
    const modal = await this.modalController.create({
      component: ToastAlertComponent,
      cssClass: 'ux-alert',
      showBackdrop: false,
      componentProps: {
        title: this.translate.instant('home.home_page.subheader_component.coming_soon_alert'),
        type: 'information',
        detailsEnabled: false,
      },
    });
    await modal.present();
  }

  getAllApiKeys() {
    this.apiApikeysService.getAll().subscribe((data) => {
      this.apikeys = data;
    });
  }

  async openNoApiKeysModal() {
    const modal = await this.modalController.create({
      component: InformativeModalComponent,
      cssClass: 'ux-modal-informative',
      swipeToClose: false,
    });
    await modal.present();
  }
}
