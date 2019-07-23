import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-fund-info',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          {{ 'funds.new_fund_info.header' | translate }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button icon-only shape="round" (click)="this.closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <h3>{{ 'funds.new_fund_info.fund_name_title' | translate }}</h3>
      <p>{{ 'funds.new_fund_info.fund_name_text' | translate }}</p>

      <h3>{{ 'funds.new_fund_info.currency_title' | translate }}</h3>
      <p>{{ 'funds.new_fund_info.currency_text' | translate }}</p>

      <h3>{{ 'funds.new_fund_info.term_of_operation_title' | translate }}</h3>
      <p>{{ 'funds.new_fund_info.term_of_operation_text' | translate }}</p>

      <h3>{{ 'funds.new_fund_info.take_profit_title' | translate }}</h3>
      <p>{{ 'funds.new_fund_info.take_profit_text' | translate }}</p>

      <h3>{{ 'funds.new_fund_info.stop_loss_title' | translate }}</h3>
      <p>{{ 'funds.new_fund_info.stop_loss_text' | translate }}</p>

      <h3>{{ 'funds.new_fund_info.trailing_title' | translate }}</h3>
      <p>{{ 'funds.new_fund_info.trailing_text' | translate }}</p>

      <h3>{{ 'funds.new_fund_info.trailing_profit_title' | translate }}</h3>
      <p>{{ 'funds.new_fund_info.trailing_profit_text' | translate }}</p>

      <h3>{{ 'funds.new_fund_info.trailing_stop_title' | translate }}</h3>
      <p>{{ 'funds.new_fund_info.trailing_stop_text' | translate }}</p>

      <h3>{{ 'funds.new_fund_info.risk_level_title' | translate }}</h3>
      <p>{{ 'funds.new_fund_info.risk_level_text' | translate }}</p>
    </ion-content>
  `,
  styleUrls: ['./new-fund-info.component.scss']
})
export class NewFundInfoComponent {

  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }
}
