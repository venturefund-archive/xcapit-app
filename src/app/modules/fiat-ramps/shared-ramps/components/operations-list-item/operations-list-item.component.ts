import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { OPERATION_STATUS } from '../../constants/operation-status';
import { FiatRampOperation } from '../../interfaces/fiat-ramp-operation.interface';
import { OperationStatus } from '../../interfaces/operation-status.interface';

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
      <ion-label name="Provider">
        <ion-text class="ux-font-text-xs">
          <img [src]="this.coin.logoRoute" alt="{{ this.coin.value }}" />
          {{ this.coin.value }}
        </ion-text>
      </ion-label>
      <ion-label name="Amount">
        <ion-text class="ux-font-titulo-xs">{{ this.amount | formattedAmount: 8:5 }}</ion-text>
      </ion-label>
      <ion-label>
        <ion-text class="ux-font-text-xs">
          {{ this.operation.created_at | date: 'dd/MM/yy' }}
        </ion-text>
      </ion-label>
      <ion-label class="end">
        <app-operation-status-chip [statusName]="this.operation.status"></app-operation-status-chip>
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

  private get isBuy(): boolean {
    return this.operation.operation_type === 'cash-in';
  }

  constructor(private navController: NavController, private apiWalletService: ApiWalletService) {}

  ngOnInit() {
    this.status = this.getOperationStatus();
    this.setHighlight();
    this.setCoinAndAmount();
  }

  setHighlight() {
    if (this.status.textToShow === 'incomplete') {
      this.highlightClass = 'highlight';
    }
  }


  private setCoinAndAmount() {
    if (this.isBuy) {
      this.coin = this.apiWalletService.getCoin(this.operation.currency_out);
      this.amount = this.operation.amount_out;
    }
  }

  private getOperationStatus(): OperationStatus {
    return OPERATION_STATUS.find((s) => s.name === this.operation.status);
  }

  viewOperationDetail() {
    this.navController.navigateForward([
      `/fiat-ramps/kripton-operation-detail/${this.operation.operation_id}`
    ]);
  }
}
