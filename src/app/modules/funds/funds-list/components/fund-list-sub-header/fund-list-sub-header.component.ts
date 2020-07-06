import { Component, OnInit } from '@angular/core';
import { ApiFundsService } from '../../../shared-funds/services/api-funds/api-funds.service';
import { ModalController } from '@ionic/angular';
import { UxSelectModalComponent } from 'src/app/shared/components/ux-select-modal/ux-select-modal.component';
import { Currency } from '../../../shared-funds/enums/currency.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-fund-list-sub-header',
  template: `
      <div class="fl__total">
          <div class="ux-font-lato ux-fweight-regular ux-fsize-14">
              <ion-text>
                  {{ 'funds.funds_list.sub_header.total_title' | translate }}
              </ion-text>
          </div>
          <div *ngIf="totalBalance?.start_balance === 0"
               class="fl__total__amount ux-font-lato ux-fweight-regular ux-fsize-14">
              <ion-text>
                  {{ 'funds.funds_list.sub_header.not_balance_found' | translate }}
              </ion-text>
          </div>
          <div *ngIf="totalBalance?.start_balance != 0"
               class="fl__total__amount ux-font-gilroy ux-fweight-extrabold ux-fsize-40"
          >
              <app-ux-loading-block
                      *ngIf="!totalBalance"
                      minSize="25px"
              ></app-ux-loading-block>
              <ion-text>
                  {{ this.totalBalance?.total_balance | number: '1.2-6' }}
                  {{ this.totalBalance?.currency }}
              </ion-text>
              <ion-button
                      appTrackClick
                      name="Change Total Currency"
                      (click)="this.changeCurrency()"
                      fill="clear"
                      size="small"
                      class="fl__total__amount__edit"
                      [disabled]="!totalBalance"
              >
                  <ion-icon
                          slot="icon-only"
                          name="ux-pencil"
                          color="uxlight"
                  ></ion-icon>
              </ion-button>
          </div>
          <div class="fl__total__detail" *ngIf="totalBalance?.start_balance != 0">
              <ion-badge class="ux-font-gilroy ux-fweight-extrabold ux-fsize-10">
                  <ion-icon
                          name="ux-triangle-up"
                          *ngIf="this.totalBalance?.total_profit > 0"
                  ></ion-icon>
                  <ion-icon
                          name="ux-triangle-down"
                          *ngIf="this.totalBalance?.total_profit < 0"
                  ></ion-icon>
                  {{
                  this.totalBalance?.total_profit | absoluteValue | number: '1.2-2'
                  }}
                  %
              </ion-badge>
              <div
                      class="fl__total__detail__text ux-font-lato ux-fweight-regular ux-fsize-12"
              >
                  <ion-text>
                      {{ 'funds.funds_list.sub_header.total_detail' | translate }}
                  </ion-text>
              </div>
          </div>
      </div>
  `,
  styleUrls: ['./fund-list-sub-header.component.scss']
})
export class FundListSubHeaderComponent implements OnInit {
  totalBalance: any;
  currencies = [Currency.BTC, Currency.USDT];

  constructor(
    private apiFunds: ApiFundsService,
    private modalController: ModalController,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.getTotalBalance('BTC');
  }

  async changeCurrency() {
    const modal = await this.modalController.create({
      component: UxSelectModalComponent,
      componentProps: {
        title: this.translate.instant(
          'funds.funds_list.sub_header.change_currency'
        ),
        data: this.currencies,
        selected: this.totalBalance ? this.totalBalance.currency : 'BTC'
      },
      swipeToClose: false,
      cssClass: 'ux-routeroutlet-modal'
    });

    await modal.present();

    const data = await modal.onDidDismiss();

    if (data.role === 'selected') {
      this.getTotalBalance(data.data);
    }
  }

  getTotalBalance(ca: string) {
    this.apiFunds
      .getTotalBalance(ca, false)
      .subscribe((data: any) => {
        this.totalBalance = data;
      });
  }
}
