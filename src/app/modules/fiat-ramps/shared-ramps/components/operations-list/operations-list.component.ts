import { Component, Input, OnInit } from '@angular/core';
import { Operation } from '../../interfaces/operation.interface';

@Component({
  selector: 'app-operations-list',
  template: `
    <ion-card class="ux-card">
      <ion-card-header>
        <ion-card-title class="ux-font-text-lg">{{ 'fiat_ramps.operations_list.title' | translate }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-list>
          <ion-item lines="none" class="header-row">
            <ion-label>
              <ion-text class="ux-font-text-xxs" color="neutral80">
                {{ 'fiat_ramps.operations_list.operation' | translate }}
              </ion-text>
            </ion-label>
            <ion-label>
              <ion-text class="ux-font-text-xxs" color="neutral80">
                {{ 'fiat_ramps.operations_list.amount' | translate }}
              </ion-text>
            </ion-label>
            <ion-label>
              <ion-text class="ux-font-text-xxs" color="neutral80">
                {{ 'fiat_ramps.operations_list.date' | translate }}
              </ion-text>
            </ion-label>
            <ion-label>
              <ion-text class="ux-font-text-xxs" color="neutral80">
                {{ 'fiat_ramps.operations_list.status' | translate }}
              </ion-text>
            </ion-label>
          </ion-item>
          <div *ngFor="let op of this.operationsList; let last = last">
            <ion-item class="row" (click)="viewOperationDetail(op)">
              <ion-label>
                <ion-text class="">
                  <img [src]="op.provider.logoRoute" alt="{{ op.provider.name }}" />
                  {{ op.currency_in }}
                </ion-text>
              </ion-label>
              <ion-label *ngIf="op.operation_type === 'cash-in'; then cashInAmount; else cashOutAmount">
              </ion-label>
                <ng-template #cashInAmount>
                  <ion-text class="ux-font-titulo-xs">{{ op.amount_in | currency }}</ion-text>
                </ng-template>
                <ng-template #cashOutAmount>
                  <ion-text class="ux-font-titulo-xs">{{ op.amount_out | currency }}</ion-text>
                </ng-template>
              <ion-label>
                <ion-text class="">
                  {{ op.created_at | date: 'dd/MM/yy' }}
                </ion-text>
              </ion-label>
              <ion-label>
                <app-operation-status-chip [status]="op.status"></app-operation-status-chip>
              </ion-label>
            </ion-item>
          </div>
        </ion-list>
      </ion-card-content>
    </ion-card>
  `,
  styleUrls: ['./operations-list.component.scss'],
})
export class OperationsListComponent implements OnInit {
  @Input() operationsList: Operation[];

  constructor() {}

  ngOnInit() {}

  viewOperationDetail(operation: Operation) {}
}
