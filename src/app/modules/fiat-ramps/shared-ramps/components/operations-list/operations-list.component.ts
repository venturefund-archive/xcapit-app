import { Component, Input, OnInit } from '@angular/core';
import { Operation } from '../../interfaces/operation.interface';

@Component({
  selector: 'app-operations-list',
  template: `
    <ion-card class="ux-card ion-no-margin">
      <ion-card-header [ngClass]="this.cssWithLine">
        <ion-card-title class="ux-font-text-lg">{{ 'fiat_ramps.operations_list.title' | translate }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <div *ngIf="this.hasOperations; then operationsTable; else noOperationsMessage"></div>
        <ng-template #operationsTable>
          <app-operations-list-accordion
            [firstOperations]="this.firstOperations"
            [remainingOperations]="this.remainingOperations"
          ></app-operations-list-accordion>
        </ng-template>
        <ng-template #noOperationsMessage>
          <ion-text class="no-operations-text ux-font-text-base">
            {{ 'fiat_ramps.operations_list.no_operations_message' | translate }}
          </ion-text>
        </ng-template>
      </ion-card-content>
    </ion-card>
  `,
  styleUrls: ['./operations-list.component.scss'],
})
export class OperationsListComponent implements OnInit {
  @Input() operationsList: Operation[];
  private readonly numberOfOperationsToShow = 2;

  get firstOperations(): Operation[] {
    return this.operationsList.slice(0, this.numberOfOperationsToShow);
  }

  get remainingOperations(): Operation[] {
    return this.operationsList.slice(this.numberOfOperationsToShow, this.operationsList.length);
  }

  get cssWithLine(): string {
    if (this.hasOperations) {
      return 'with-line';
    }

    return '';
  }

  get hasOperations(): boolean {
    return this.operationsList?.length > 0;
  }

  constructor() {}

  ngOnInit() {}
}
