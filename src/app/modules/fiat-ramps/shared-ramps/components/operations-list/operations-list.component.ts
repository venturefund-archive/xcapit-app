import { Component, Input, OnInit } from '@angular/core';
import { FiatRampOperation } from '../../interfaces/fiat-ramp-operation.interface';

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
          <ion-text name="No Operations" class="no-operations-text ux-font-text-base">
            {{ 'fiat_ramps.operations_list.no_operations_message' | translate }}
          </ion-text>
        </ng-template>
      </ion-card-content>
    </ion-card>
  `,
  styleUrls: ['./operations-list.component.scss'],
})
export class OperationsListComponent implements OnInit {
  @Input() operationsList: FiatRampOperation[];
  private readonly numberOfOperationsToShow = 2;
  firstOperations: FiatRampOperation[];
  remainingOperations: FiatRampOperation[];
  cssWithLine: string;
  hasOperations: boolean;

  constructor() {}

  ngOnInit() {
    this.firstOperations = this.calculateFirstOperations();
    this.remainingOperations = this.calculateRemainingOperations();
    this.cssWithLine = this.calculateDynamicCssClasses();
    this.hasOperations = this.checkIfUserHasOperations();
  }

  private calculateFirstOperations(): FiatRampOperation[] {
    return this.operationsList.slice(0, this.numberOfOperationsToShow);
  }

  private calculateRemainingOperations(): FiatRampOperation[] {
    return this.operationsList.slice(this.numberOfOperationsToShow, this.operationsList.length);
  }

  private calculateDynamicCssClasses(): string {
    if (this.hasOperations) {
      return 'with-line';
    }

    return '';
  }

  private checkIfUserHasOperations(): boolean {
    return this.operationsList?.length > 0;
  }
}
