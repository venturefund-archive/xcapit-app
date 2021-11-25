import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ApiApikeysService } from 'src/app/modules/apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';
import { InformativeModalComponent } from 'src/app/modules/menus/main-menu/components/informative-modal/informative-modal.component';
import { ToastAlertComponent } from 'src/app/shared/components/new-toasts/toast-alert/toast-alert.component';

@Component({
  selector: 'app-home-subheader',
  template: `
    <div class="hsub">
      <div class="hsub">
        <div class="hsub__card-buttons">
          <div class="hsub__card-buttons__wallet-card card">
            <app-icon-button-card
              (click)="this.goToWallet()"
              appTrackClick
              name="Go to Wallet"
              [text]="'home.home_page.subheader_component.wallet' | translate"
              icon="ux-wallet"
            ></app-icon-button-card>
          </div>
          <div class="hsub__card-buttons__buy-card card">
            <app-icon-button-card
              (click)="this.goToBuy()"
              appTrackClick
              name="Go to Buy"
              [text]="'home.home_page.subheader_component.buy_card' | translate"
              icon="ux-money-flow"
            ></app-icon-button-card>
          </div>
          <div class="hsub__card-buttons__investments card">
            <app-icon-button-card
              (click)="this.goToInvestments()"
              appTrackClick
              name="Go to Investments"
              [text]="'home.home_page.subheader_component.investments' | translate"
              icon="ux-trending-up"
            ></app-icon-button-card>
          </div>
          <div class="hsub__card-buttons__objectives card">
            <app-icon-button-card
              (click)="this.goToObjectives()"
              appTrackClick
              name="Go to Objectives"
              [text]="'home.home_page.subheader_component.objectives' | translate"
              icon="ux-buy-sell"
              comingSoon="true"
            ></app-icon-button-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./home-subheader.component.scss'],
})
export class HomeSubheaderComponent implements OnInit {
  apikeys: any = [];
  constructor(
    private navController: NavController,
    private modalController: ModalController,
    private translate: TranslateService,
    private apiApikeysService: ApiApikeysService
  ) {}

  ngOnInit() {
    this.getAllApiKeys();
  }

  async goToWallet() {
    this.navController.navigateForward('/tabs/wallets');
  }

  async goToBuy() {
    if (this.apikeys.length > 0) {
      this.navController.navigateForward('/fiat-ramps/operations');
    } else {
      await this.openNoApiKeysModal();
    }
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

  goToInvestments() {
    this.navController.navigateForward('/tabs/funds');
  }

  async goToObjectives() {
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
}
