import { Component, OnInit } from '@angular/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { ActivatedRoute } from '@angular/router';
import { ApiApikeysService } from '../../apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';
import { NavController } from '@ionic/angular';
import { ManualSLTP } from '../shared-funds/constants/manual-stop-loss-take-profit';

@Component({
  selector: 'app-fund-settings',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar fst">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <div>
          <ion-title class="fst__main-title">{{ 'funds.fund_settings.header' | translate }}</ion-title>
          <ion-title class="fst__fund-name">{{ this.fundName }}</ion-title>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content class="fs ion-padding">
      <div class="fs__title">
        <ion-text class="ux-font-text-xl" color="uxdark">
          {{ this.fund?.nombre_bot }}
        </ion-text>
      </div>
      <div class="fs__fund-info">
        <div class="fs__fund-info__title">
          <ion-text class="ux-font-subheading">
            {{ 'funds.fund_settings.fund_info_title' | translate }}
          </ion-text>
        </div>
        <div class="fs__fund-info__list">
          <app-ux-list-inverted>
            <ion-list>
              <ion-item>
                <ion-label>
                  <h2>
                    {{ 'funds.fund_settings.currency' | translate }}
                  </h2>
                  <h3>
                    {{ this.fund?.currency }}
                  </h3>
                </ion-label>
              </ion-item>
            </ion-list>
          </app-ux-list-inverted>
        </div>
      </div>
      <div class="fs__fund-modify">
        <div class="fs__fund-modify__title">
          <ion-text class="ux-font-subheading">
            {{ 'funds.fund_settings.fund_modify_title' | translate }}
          </ion-text>
        </div>
        <div class="fs__fund-modify__list">
          <app-ux-list-inverted>
            <ion-list>
              <ion-item (click)="this.editTakeProfit()" class="fs__take_profit">
                <ion-label>
                  <h2>
                    {{ 'funds.fund_settings.take_profit' | translate }}
                  </h2>
                  <h3 *ngIf="this.fund?.ganancia !== manualSLTP.takeProfit">{{ this.fund?.ganancia }}%</h3>
                  <h3 *ngIf="this.fund?.ganancia === manualSLTP.takeProfit">
                    {{ 'shared.edit_SL_TP.without_take_profit' | translate }}
                  </h3>
                </ion-label>
                <ion-icon slot="end" name="ux-forward" class="fs__fund-modify__list__icon"></ion-icon>
              </ion-item>
              <div class="list-divider"></div>
              <ion-item (click)="this.editStopLoss()" class="fs__stop_loss">
                <ion-label>
                  <h2>
                    {{ 'funds.fund_settings.stop_loss' | translate }}
                  </h2>
                  <h3 *ngIf="this.fund?.perdida === manualSLTP.stopLoss && this.fund?.trailing_stop === 0">
                    {{ 'shared.edit_SL_TP.without_stop_loss' | translate }}
                  </h3>
                  <h3 *ngIf="this.fund?.trailing_stop > 0 && this.fund?.trailing_stop === this.fund?.perdida">
                    {{ 'shared.edit_SL_TP.inteligent_stop_loss' | translate }}
                  </h3>
                  <h3
                    *ngIf="
                      this.fund?.perdida > 0 &&
                      this.fund?.perdida !== manualSLTP.stopLoss &&
                      this.fund?.trailing_stop === 0
                    "
                  >
                    {{ 'shared.edit_SL_TP.classic_stop_loss' | translate }}
                  </h3>
                </ion-label>
                <ion-icon slot="end" name="ux-forward" class="fs__fund-modify__list__icon"></ion-icon>
              </ion-item>
            </ion-list>
          </app-ux-list-inverted>
        </div>
      </div>
      <div class="fs__fund-finish" *ngIf="this.fund">
        <app-fund-finish [fundName]="this.fund.nombre_bot" [runId]="this.fund.id_corrida"> </app-fund-finish>
      </div>
    </ion-content>
  `,
  styleUrls: ['./fund-settings.page.scss'],
})
export class FundSettingsPage implements OnInit {
  fund: any;
  apiKeys: any;
  fundName: string;
  manualSLTP = ManualSLTP;

  constructor(
    private apiFunds: ApiFundsService,
    private route: ActivatedRoute,
    private apiApiKeys: ApiApikeysService,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    this.fundName = this.route.snapshot.paramMap.get('name');
    this.getActiveFund();
    this.getApiKeys();
  }

  getActiveFund() {
    this.apiFunds.getLastFundRun(this.fundName).subscribe((res) => (this.fund = res));
  }

  getApiKeys() {
    this.apiApiKeys.getByFundName(this.fundName).subscribe((res) => (this.apiKeys = res));
  }

  editStopLoss() {
    this.navController.navigateForward(['funds/edit-stop-loss/', this.fundName]);
  }

  editTakeProfit() {
    this.navController.navigateForward(['funds/edit-take-profit/', this.fundName]);
  }

  ngOnInit() {}
}
