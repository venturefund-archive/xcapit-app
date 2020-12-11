import { Component, Input, OnInit } from '@angular/core';
import { FundDataStorageService } from '../../../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-fund-finished-card',
  template: `
    <div class="ffc" (click)="this.renewFund()">
      <div class="ffc__content">
        <div class="ffc__content__right ion-padding-top ion-padding-start ion-padding-bottom">
          <div class="item">
            <ion-text
              class="ux-font-lato ux-fweight-semibold ux-fsize-12"
              color="uxdark"
              >{{ this.fund.nombre_bot }}</ion-text
            >
            <ion-text
              class="ux-font-gilroy ux-fweight-extrabold ux-fsize-24"
              color="uxdark"
            >
              {{ this.fund.currency }}
            </ion-text>
          </div>
          <div class="item second">
            <ion-text
              class="ux-font-lato ux-fweight-semibold ux-fsize-12"
              color="uxmedium"
              >{{ 'funds.funds_finished.fund_finished_card.take_profit' | translate }}</ion-text
            >
            <ion-text
              class="ux-font-lato ux-fweight-semibold ux-fsize-12"
              color="uxdark"
              >{{ this.fund.ganancia }}%</ion-text
            >
          </div>
        </div>
        <div class="ffc__content__right ion-padding-top ion-padding-end ion-padding-bottom">
          <div class="item">
            <ion-text
              class="ux-font-lato ux-fweight-semibold ux-fsize-12"
              color="uxmedium"
              >{{ 'funds.funds_finished.fund_finished_card.risk' | translate }}</ion-text
            >
            <ion-text
              [ngClass] = "{ 'high-risk': this.risk == 'Alto' }"
              class="risk ux-font-gilroy ux-fweight-semibold ux-fsize-24"
              color="uxdark"
              >{{ this.risk }}</ion-text
            >
          </div>
          <div class="item second">
            <ion-text
              class="ux-font-lato ux-fweight-semibold ux-fsize-12"
              color="uxmedium"
              >{{ 'funds.funds_finished.fund_finished_card.stop_loss' | translate }}</ion-text
            >
            <ion-text
              class="ux-font-lato ux-fweight-semibold ux-fsize-12"
              color="uxdark"
              >-{{ this.fund.perdida }}%</ion-text
            >
          </div>
        </div>
      </div>
      <div class="ffc__footer">
        <div class="ffc__footer__left">
        </div>
        <div class="ffc__footer__right">
          <div class="share-button">
            <ion-button
              appTrackClick
              name="Share"
              type="submit"
              fill="clear"
              size="small"
              class="ux-font-lato ux-fweight-semibold ux-fsize-14"
            >
              {{ 'funds.funds_finished.fund_finished_card.renovate' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./fund-finished-card.component.scss'],
})
export class FundFinishedCardComponent implements OnInit {
  @Input() fund: any;
  risk: string;

  constructor(
    private fundDataStorage: FundDataStorageService,
    private navController: NavController
  ) { }

  ngOnInit() { this.getRiskLevel() }

  async renewFund(){
    this.fundDataStorage.setData('fundName', {fund_name: this.fund.nombre_bot});
    this.fundDataStorage.setData('fundRenew', true);
    this.navController.navigateForward(['funds/fund-risk']);
  }

  getRiskLevel() {
    if (this.fund.nivel_de_riesgo == "classic_BTC" || this.fund.nivel_de_riesgo == "classic_USDT") {
      this.risk = "Medio";
    } else if (this.fund.nivel_de_riesgo == "pro_BTC" || this.fund.nivel_de_riesgo == "pro_USDT") {
      this.risk = "Alto";
    } else {
      this.risk = "No definido";
    }
  }

}
