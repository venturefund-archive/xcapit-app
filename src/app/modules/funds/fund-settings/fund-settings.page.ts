import { Component, OnInit } from '@angular/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { ActivatedRoute } from '@angular/router';
import { ApiApikeysService } from '../../apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';

@Component({
  selector: 'app-fund-settings',
  template: `
      <ion-header>
          <ion-toolbar color="uxprimary" class="ux_toolbar">
              <ion-buttons slot="start">
                  <ion-back-button
                          defaultHref="/funds/fund-detail"
                  ></ion-back-button>
              </ion-buttons>
              <ion-title class="ion-text-center">{{
                  'funds.fund_settings.header' | translate
                  }}</ion-title>
          </ion-toolbar>
      </ion-header>
      <ion-content class="fs ion-padding">
          <div class="fs__title">
              <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22" color="uxdark">
                  {{ this.fund?.nombre_bot }}
              </ion-text>
          </div>
          <div class="fs__fund-info">
              <div class="fs__fund-info__title">
                  <ion-text
                          class="ux-font-lato ux-fweight-semibold ux-fsize-12"
                          color="uxsemidark"
                  >
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
                  <ion-text
                          class="ux-font-lato ux-fweight-semibold ux-fsize-12"
                          color="uxsemidark"
                  >
                      {{ 'funds.fund_settings.fund_modify_title' | translate }}
                  </ion-text>
              </div>
              <div class="fs__fund-modify__list">
                  <app-ux-list-inverted>
                      <ion-list>
                          <ion-item>
                              <ion-label>
                                  <h2>
                                      {{ 'funds.fund_settings.apikey' | translate }}
                                  </h2>
                                  <h3>
                                      {{ this.apiKeys?.ak }}
                                  </h3>
                              </ion-label>
                          </ion-item>
                          <div class="list-divider"></div>
                          <ion-item>
                              <ion-label>
                                  <h2>
                                      {{ 'funds.fund_settings.secretkey' | translate }}
                                  </h2>
                                  <h3>
                                      •••••••••••••
                                  </h3>
                              </ion-label>
                          </ion-item>
                          <div class="list-divider"></div>
                          <ion-item>
                              <ion-label>
                                  <h2>
                                      {{ 'funds.fund_settings.take_profit' | translate }}
                                  </h2>
                                  <h3>
                                      {{ this.fund?.ganancia }}%
                                  </h3>
                              </ion-label>
                          </ion-item>
                          <div class="list-divider"></div>
                          <ion-item>
                              <ion-label>
                                  <h2>
                                      {{ 'funds.fund_settings.stop_loss' | translate }}
                                  </h2>
                                  <h3>
                                      {{ this.fund?.perdida }}%
                                  </h3>
                              </ion-label>
                          </ion-item>
                      </ion-list>
                  </app-ux-list-inverted>
              </div>
          </div>
          <div class="fs__fund-finish-pause-card" *ngIf="this.fund">
              <app-fund-finish-pause-card
                      [fundName]="this.fund.nombre_bot"
                      [runId]="this.fund.id_corrida"
                      [status]="this.fund.estado">
              </app-fund-finish-pause-card>
          </div>
      </ion-content>
  `,
  styleUrls: ['./fund-settings.page.scss']
})
export class FundSettingsPage implements OnInit {
  fund: any;
  apiKeys: any;
  fundName: string;

  constructor(
    private apiFunds: ApiFundsService,
    private route: ActivatedRoute,
    private apiApiKeys: ApiApikeysService
  ) {
  }

  ionViewWillEnter() {
    this.fundName = this.route.snapshot.params.name;
    this.getActiveFund();
    this.getApiKeys();
  }

  getActiveFund() {
    this.apiFunds.getLastFundRun(this.fundName).subscribe(
      res => this.fund = res
    );
  }

  getApiKeys() {
    this.apiApiKeys.getByFundName(this.fundName).subscribe(
      res => this.apiKeys = res
    );
  }

  ngOnInit() {
  }


}
