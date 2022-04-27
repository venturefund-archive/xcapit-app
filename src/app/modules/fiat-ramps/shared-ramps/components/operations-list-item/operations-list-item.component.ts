import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { FiatRampOperation } from '../../interfaces/fiat-ramp-operation.interface';
import { OperationStatus } from '../../interfaces/operation-status.interface';
import { FiatRampsService } from '../../services/fiat-ramps.service';

@Component({
  selector: 'app-operations-list-item',
  template: `
    <ion-item
      [lines]="this.linesValue"
      appTrackClick
      name="Operation Item"
      slot="content"
      class="row"
      (click)="viewOperationDetail()"
    >
      <ion-label name="Provider">
        <ion-text class="ux-font-text-xs">
          <img [src]="this.status.provider.logoRoute" alt="{{ this.status.provider.name }}" />
          {{ this.coin }}
        </ion-text>
      </ion-label>
      <ion-label name="Amount">
        <ion-text class="ux-font-titulo-xs">{{ this.amount | currency }}</ion-text>
      </ion-label>
      <ion-label>
        <ion-text class="ux-font-text-xs">
          {{ this.operation.created_at | date: 'dd/MM/yy' }}
        </ion-text>
      </ion-label>
      <ion-label class="end">
        <app-operation-status-chip [status]="this.status"></app-operation-status-chip>
      </ion-label>
    </ion-item>
  `,
  styleUrls: ['./operations-list-item.component.scss'],
})
export class OperationsListItemComponent implements OnInit {
  @Input() operation: FiatRampOperation;
  @Input() isLast: boolean;
  status: OperationStatus;

  get isBuy(): boolean {
    return this.operation.operation_type === 'cash-in';
  }

  get coin(): string {
    if (this.isBuy) {
      return this.operation.currency_in;
    }
    return this.operation.currency_out;
  }

  get amount(): number {
    if (this.isBuy) {
      return this.operation.amount_in;
    }
    return this.operation.amount_out;
  }

  get linesValue(): string {
    if (this.isLast) {
      return 'none';
    }

    return;
  }

  constructor(private navController: NavController, private fiatRampsService: FiatRampsService) {}

  ngOnInit() {
    console.log('hi')
    this.status = this.fiatRampsService.getOperationStatus(this.operation.status, parseInt(this.operation.provider));
  }

  viewOperationDetail() {
    this.navController.navigateForward([
      `/fiat-ramps/operation-detail/provider/${this.status.provider.id}/operation/${this.operation.operation_id}`,
    ]);
  }
}
