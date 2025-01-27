import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonAccordionGroup } from '@ionic/angular';
import { FiatRampOperation } from '../../interfaces/fiat-ramp-operation.interface';

@Component({
  selector: 'app-operations-list-accordion',
  template: `
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
        <app-operations-list-item
          [isLast]="!this.isAccordionOpen && last"
          [operation]="op"
          *ngFor="let op of this.firstOperations; let last = last"
        ></app-operations-list-item>
        <ion-accordion-group>
          <ion-accordion toggleIcon="" value="operations">
            <div slot="content">
              <app-operations-list-item
                [isLast]="this.isAccordionOpen && last"
                [operation]="op"
                *ngFor="let op of this.remainingOperations; let last = last"
              >
              </app-operations-list-item>
            </div>
          </ion-accordion>
        </ion-accordion-group>
    </ion-list>
    <div *ngIf="this.remainingOperations.length > 0">
      <ion-button
        name="Toggle Accordion"
        class="ux_button ion-no-margin"
        color="info"
        appTrackClick
        fill="clear"
        size="small"
        (click)="this.toggleAccordion()"
      >
        {{ this.buttonText | translate }}
      </ion-button>
    </div>
  `,
  styleUrls: ['./operations-list-accordion.component.scss'],
})
export class OperationsListAccordionComponent implements OnInit {
  @Input() firstOperations: FiatRampOperation[];
  @Input() remainingOperations: FiatRampOperation[];
  @ViewChild(IonAccordionGroup, { static: true }) accordionGroup: IonAccordionGroup;
  isAccordionOpen: boolean;

  buttonText: string;

  constructor() {}

  ngOnInit() {
    this.closeAccordion();
  }

  toggleAccordion() {
    this.isAccordionOpen ? this.closeAccordion() : this.openAccordion();
  }

  private openAccordion() {
    this.buttonText = 'fiat_ramps.operations_list.button_show_less';
    this.accordionGroup.value = 'operations';
    this.isAccordionOpen = true;
  }

  private closeAccordion() {
    this.buttonText = 'fiat_ramps.operations_list.button_show_more';
    this.accordionGroup.value = undefined;
    this.isAccordionOpen = false;
  }
}
