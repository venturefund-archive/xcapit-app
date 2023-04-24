import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { OPERATION_STATUS } from '../../constants/operation-status';
import { FiatRampOperation } from '../../interfaces/fiat-ramp-operation.interface';
import { OperationStatus } from '../../interfaces/operation-status.interface';
import { FiatRampsService } from '../../services/fiat-ramps.service';
import { CountryRepo } from '../../models/country-repo/country-repo';
import { Countries } from '../../models/countries/countries';
import { COUNTRIES } from '../../constants/countries';

@Component({
  selector: 'app-operations-list-item',
  template: `
    <ion-item
      appTrackClick
      lines="none"
      name="Operation Item"
      slot="content"
      class="row"
      (click)="viewOperationDetail()"
      [ngClass]="this.highlightClass"
    >
      <ion-label name="Coin" class="oli__coin">
        <ion-text class="ux-font-text-xs">
          <div class="oli__coin__wrapper">
            <img
              class="oli__coin__wrapper__operation-type"
              [src]="'assets/img/fiat-ramps/operations-list/' + this.operation.operation_type + '.svg'"
            />
            <img class="oli__coin__wrapper__image" [src]="this.imgUrl" alt="{{ this.imgAlt }}" />
          </div>
          {{ this.isBuy ? this.coin.value : (this.operation.currency_out | uppercase) }}
        </ion-text>
      </ion-label>
      <ion-label name="Amount">
        <ion-text class="ux-font-titulo-xs">{{ this.amount | formattedAmount : 8 : 5 }}</ion-text>
      </ion-label>
      <ion-label>
        <ion-text class="ux-font-text-xs">
          {{ this.operation.created_at | date : 'dd/MM/yy' }}
        </ion-text>
      </ion-label>
      <ion-label class="end">
        <app-operation-status-chip
          [statusName]="this.operation.status"
          [operationType]="this.operation.operation_type"
        ></app-operation-status-chip>
      </ion-label>
    </ion-item>
  `,
  styleUrls: ['./operations-list-item.component.scss'],
})
export class OperationsListItemComponent implements OnInit {
  @Input() operation: FiatRampOperation;
  @Input() isLast = false;
  status: OperationStatus;
  coin: Coin;
  amount: number;
  highlightClass: string;
  isBuy: boolean;
  imgUrl: string;
  imgAlt: string;
  constructor(
    private navController: NavController,
    private apiWalletService: ApiWalletService,
    private fiatRampsService: FiatRampsService
  ) {}

  ngOnInit() {
    this.setType();
    this.status = this.getOperationStatus();
    this.setHighlight();
    this.setImage();
    this.setAmount();
  }

  private setType() {
    this.isBuy = this.operation.operation_type === 'cash-in';
  }

  setHighlight() {
    if (this.status.textToShow === 'incomplete') {
      this.highlightClass = 'highlight';
    }
  }

  private setImage() {
    if (this.isBuy) {
      const asset = this.fiatRampsService
        .getProvider(1)
        .currencies.find((c) => c.symbol === (this.isBuy ? this.operation.currency_out : this.operation.currency_in));
      this.coin = this.apiWalletService.getCoin(asset.symbol, asset.network);
      this.imgUrl = this.coin.logoRoute;
      this.imgAlt = this.coin.value;
    } else {
      const country = new Countries(new CountryRepo(COUNTRIES)).findByCurrencyCode(
        this.operation.currency_out.toUpperCase()
      );
      this.imgUrl = country.flagRoute();
      this.imgAlt = this.operation.currency_out;
    }
  }

  private setAmount() {
    this.amount = this.operation.amount_out;
  }

  private getOperationStatus(): OperationStatus {
    return OPERATION_STATUS.find((statuses) => statuses.type === this.operation.operation_type).statuses.find(
      (status) => status.name === this.operation.status
    );
  }

  viewOperationDetail() {
    this.navController.navigateForward([`/fiat-ramps/kripton-operation-detail/${this.operation.operation_id}`]);
  }
}
