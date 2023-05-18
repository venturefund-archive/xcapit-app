import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OperationStatus } from 'src/app/modules/fiat-ramps/shared-ramps/interfaces/operation-status.interface';

@Component({
  selector: 'app-information-modal',
  template: ` <div class="modal-content">
    <div class="main__close_button">
      <ion-button class="ion-no-padding" slot="icon-only" fill="clear" name="Close" (click)="this.close()">
        <ion-icon class="main__close_button__icon" name="ux-close"></ion-icon>
      </ion-button>
    </div>
    <div class="main__body">
      <div class="main__body__content">
        <ion-label class="ux-font-text-lg main__body__content__title">{{ this.title }} </ion-label>
        <app-operation-status-chip [statusName]="this.status.name" [operationType]="this.operationType"></app-operation-status-chip>
        <ion-label *ngIf="this.description" class="ion-no-margin ux-font-text-base main__body__content__description" [innerHTML]="this.description">
        </ion-label>
        <ion-label *ngIf="this.description2" class="ion-no-margin ux-font-text-base main__body__content__description2">
          {{ this.description2 }}
        </ion-label>
        <div class="main__actions">
          <ion-button
            class="ux_button main__actions__button ion-no-margin"
            name="Understood"
            color="secondary"
            size="large"
            (click)="this.close()"
          >
            {{ this.buttonText }}
          </ion-button>
        </div>
      </div>
    </div>
  </div>`,
  styleUrls: ['./information-modal.component.scss'],
})
export class InformationModalComponent implements OnInit {
  title: string;
  status: OperationStatus;
  operationType: string;
  description: string;
  description2: string;
  buttonText: string;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
