import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

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

  constructor(
    private navController: NavController,
    private translate: TranslateService,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

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

  goToBuy() {
    this.navController.navigateForward(['/fiat-ramps/moonpay']);
  }

  async goToPerformance() {
    this.toastService.showInfoToast({
      message: this.translate.instant(this.translate.instant('home.home_page.subheader_component.coming_soon_alert')),
    });
  }
}
