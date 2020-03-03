import { Component, OnInit, Input } from '@angular/core';
import { ApiFundsService } from '../../services/api-funds/api-funds.service';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeCurrencyModalComponent } from '../change-currency-modal/change-currency-modal.component';

@Component({
  selector: 'app-fund-list-sub-header',
  template: `
    <div class="fl__total">
      <div class="ux-font-lato ux-fweight-regular ux-fsize-14">
        <ion-text>
          {{ 'funds.funds_list.sub_header.total_title' | translate }}
        </ion-text>
      </div>
      <div
        class="fl__total__amount ux-font-gilroy ux-fweight-extrabold ux-fsize-40"
      >
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
          <ion-icon slot="icon-only" name="ux-pencil"></ion-icon>
        </ion-button>
      </div>
      <div class="fl__total__detail">
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
            this.totalBalance?.total_profit | number: '1.2-2' | absoluteValue
          }}
          %
        </ion-badge>
        <!-- <div
          class="fl__total__detail__text ux-font-lato ux-fweight-regular ux-fsize-12"
        >
          <ion-text>
            {{
              'funds.funds_list.sub_header.total_detail'
                | translate: { days: this.totalBalance.days }
            }}
          </ion-text>
        </div> -->
      </div>
    </div>
  `,
  styleUrls: ['./fund-list-sub-header.component.scss']
})
export class FundListSubHeaderComponent implements OnInit {
  totalBalance: any;

  constructor(
    private apiFunds: ApiFundsService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getTotalBalance('BTC');
  }

  async changeCurrency() {
    const modal = await this.modalController.create({
      component: ChangeCurrencyModalComponent,
      componentProps: { selected: this.totalBalance.currency }
    });

    modal.onDidDismiss().then(data => {
      if (data.data) {
        this.getTotalBalance(data.data.currency);
      }
    });

    await modal.present();
  }

  getTotalBalance(ca: string) {
    this.apiFunds
      .getTotalBalance(ca)
      .subscribe(data => (this.totalBalance = data));
  }
}
