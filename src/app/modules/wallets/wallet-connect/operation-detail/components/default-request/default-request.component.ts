import { Component, Input, OnInit } from '@angular/core';
import { ethers } from 'ethers';

@Component({
  selector: 'app-default-request',
  template: `
    <div>
      <div class="drc__container">
        <div class="drc__container__title">
          <ion-label>
            {{ 'wallets.wallet_connect.operation_detail.date' | translate }}
          </ion-label>
        </div>

        <div class="drc__container__content drc__container__date">
          <span>{{ this.dateInfo.date }}</span>
          <span>{{ this.dateInfo.time }} H</span>
        </div>
      </div>

      <div class="drc__container">
        <div class="drc__container__title">
          <ion-label>
            {{ 'wallets.wallet_connect.operation_detail.from' | translate }}
          </ion-label>
        </div>

        <div class="drc__container__content">
          <ion-label>
            {{ this.request.params[0].from }}
          </ion-label>
        </div>
      </div>

      <div class="drc__container">
        <div class="drc__container__title">
          <ion-label>
            {{ 'wallets.wallet_connect.operation_detail.to' | translate }}
          </ion-label>
        </div>

        <div class="drc__container__content">
          <ion-label>
            {{ this.request.params[0].to }}
          </ion-label>
        </div>
      </div>

      <div class="drc__container" *ngIf="this.totalAmount">
        <div class="drc__container__title">
          <ion-label>
            {{ 'wallets.wallet_connect.operation_detail.amount' | translate }}
          </ion-label>
        </div>

        <div class="drc__container__content">
          <ion-label> {{ this.totalAmount }} {{ this.providerSymbol }} </ion-label>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./default-request.component.scss'],
})
export class DefaultRequestComponent implements OnInit {
  @Input() request: any;
  @Input() providerSymbol: string;
  @Input() dateInfo: any;

  public totalAmount;

  constructor() {}

  ngOnInit() {
    this.getTotalAmount();
  }

  getTotalAmount() {
    this.totalAmount = this.request.params[0].value ? ethers.utils.formatEther(ethers.BigNumber.from(this.request.params[0].value)) : null;
  }

}
