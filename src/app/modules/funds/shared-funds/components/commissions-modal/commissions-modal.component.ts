import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-commissions-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          {{ 'funds.commissions.header' | translate }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button icon-only shape="round" (click)="this.closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <app-commissions-content></app-commissions-content>
    </ion-content>
  `,
  styleUrls: ['./commissions-modal.component.scss']
})
export class CommissionsModalComponent implements OnInit {
  constructor(private modalController: ModalController) {}
  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }
}
