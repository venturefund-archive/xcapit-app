import { Component, Input, OnInit } from '@angular/core';
import { Operation } from '../../interfaces/operation.interface';

@Component({
  selector: 'app-operations-list-item',
  template: `
    <ion-item [lines]="this.linesValue" slot="content" class="row" (click)="viewOperationDetail()">
      <ion-label>
        <ion-text class="ux-font-text-xs">
          <img [src]="operation.provider.logoRoute" alt="{{ operation.provider.name }}" />
          {{ operation.currency_in }}
        </ion-text>
      </ion-label>
      <div *ngIf="operation.operation_type === 'cash-in'; then cashInAmount; else cashOutAmount"></div>
      <ng-template #cashInAmount>
        <ion-label>
          <ion-text class="ux-font-titulo-xs">{{ operation.amount_in | currency }}</ion-text>
        </ion-label>
      </ng-template>
      <ng-template #cashOutAmount>
        <ion-label>
          <ion-text class="ux-font-titulo-xs">{{ operation.amount_out | currency }}</ion-text>
        </ion-label>
      </ng-template>
      <ion-label>
        <ion-text class="ux-font-text-xs">
          {{ operation.created_at | date: 'dd/MM/yy' }}
        </ion-text>
      </ion-label>
      <ion-label class="end">
        <app-operation-status-chip [status]="operation.status"></app-operation-status-chip>
      </ion-label>
    </ion-item>
  `,
  styleUrls: ['./operations-list-item.component.scss'],
})
export class OperationsListItemComponent implements OnInit {
  @Input() operation: Operation;
  @Input() isLast: boolean;

  get linesValue(): string {
    if (this.isLast) {
      return 'none'
    }
    
    return;
  }

  constructor() {}

  ngOnInit() {}

  viewOperationDetail() {}
}
