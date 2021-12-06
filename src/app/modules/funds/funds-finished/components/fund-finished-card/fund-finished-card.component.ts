import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FundDataStorageService } from '../../../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { ApiFundsService } from '../../../shared-funds/services/api-funds/api-funds.service';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { StorageApikeysService } from '../../../../apikeys/shared-apikeys/services/storage-apikeys/storage-apikeys.service';
import { ApiApikeysService } from '../../../../apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';

@Component({
  selector: 'app-fund-finished-card',
  template: `
    <div class="ffc">
      <div class="ffc__content">
        <div class="ffc__content__right">
          <div class="item">
            <ion-text class="ux-font-text-xxs regular" color="uxdark">{{ this.fund.nombre_bot }}</ion-text>
            <ion-text class="ux-font-text-xl" color="uxdark">
              {{ this.fund.currency }}
            </ion-text>
          </div>
          <div class="item second">
            <ion-text class="ux-font-text-xxs regular" color="uxmedium">{{
              'funds.funds_finished.fund_finished_card.take_profit' | translate
            }}</ion-text>
            <ion-text class="ux-font-text-xxs regular" color="uxdark">{{ this.fund.ganancia }}%</ion-text>
          </div>
        </div>
        <div class="ffc__content__right">
          <div class="item">
            <ion-text class="ux-font-text-xxs regular" color="uxmedium">{{
              'funds.funds_finished.fund_finished_card.risk' | translate
            }}</ion-text>
            <ion-text [ngClass]="{ 'high-risk': this.risk === 'Alto' }" class="risk ux-font-text-xl" color="uxdark">{{
              this.risk
            }}</ion-text>
          </div>
          <div class="item second">
            <ion-text class="ux-font-text-xxs regular" color="uxmedium">{{
              'funds.funds_finished.fund_finished_card.stop_loss' | translate
            }}</ion-text>
            <ion-text class="ux-font-text-xxs regular" color="uxdark">-{{ this.fund.perdida }}%</ion-text>
          </div>
        </div>
      </div>
      <div class="ffc__footer">
        <div class="ffc__footer__left">
          <ion-button
            appTrackClick
            name="Delete Fund"
            type="submit"
            fill="clear"
            size="small"
            (click)="this.deleteFund()"
            class="ffc__footer__left__trash ux-font-text-xs semibold"
          >
            <ion-icon class="ffc__footer__left__trash__icon" name="trash-outline"></ion-icon>
          </ion-button>
        </div>
        <div class="ffc__footer__right">
          <div class="share-button">
            <ion-button
              appTrackClick
              name="Renovate Fund"
              type="submit"
              fill="clear"
              size="small"
              (click)="this.renewFund()"
              class="renovate-fund ux-font-text-xxs"
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
  @Output() deleteFundClick = new EventEmitter<any>();
  risk: string;

  constructor(
    private fundDataStorage: FundDataStorageService,
    private apiFunds: ApiFundsService,
    private toastService: ToastService,
    private translate: TranslateService,
    private navController: NavController,
    private storageApikeysService: StorageApikeysService,
    private apiApikeysService: ApiApikeysService
  ) {}

  ngOnInit() {
    this.getRiskLevel();
  }

  async renewFund() {
    const apiKeys = await this.apiApikeysService.getByFundName(this.fund.nombre_bot).toPromise();
    this.storageApikeysService.updateData({ id: apiKeys.pk, nombre_bot: apiKeys.nombre_bot, alias: apiKeys.alias });
    await this.fundDataStorage.setData('fundName', { fund_name: this.fund.nombre_bot });
    await this.fundDataStorage.setData('fundRenew', true);
    await this.navController.navigateForward(['funds/fund-investment']);
  }

  getRiskLevel() {
    if (this.fund.nivel_de_riesgo === 'classic_BTC' || this.fund.nivel_de_riesgo === 'classic_USDT') {
      this.risk = 'Medio';
    } else if (this.fund.nivel_de_riesgo === 'pro_BTC' || this.fund.nivel_de_riesgo === 'pro_USDT') {
      this.risk = 'Alto';
    } else {
      this.risk = this.translate.instant(`funds.fund_investment.card.profiles.${this.fund.nivel_de_riesgo}.title`);
    }
  }

  deleteFund() {
    this.apiFunds.deleteFundRuns(this.fund.nombre_bot).subscribe((data) => {
      this.deleteFundClick.emit(this.fund);
      this.showToast();
    });
  }

  async showToast() {
    await this.toastService.showToast({
      cssClass: 'ux-toast-info',
      message: this.translate.instant('funds.funds_finished.fund_finished_card.fund_deleted'),
    });
  }
}
