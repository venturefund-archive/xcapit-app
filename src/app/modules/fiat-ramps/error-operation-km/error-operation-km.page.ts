import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { TransactionDataService } from '../../wallets/shared-wallets/services/transaction-data/transaction-data.service';

@Component({
  selector: 'app-error-operation-km',
  template: `
    <ion-content class="ion-padding failed-mnemonic-content">
      <app-success-content
        *ngIf="this.data"
        [data]="this.data"
        imageAlt="Error Image"
        (primaryActionEvent)="this.goBackToDetail()"
      ></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./error-operation-km.page.scss'],
})
export class ErrorOperationKmPage {
  data: any;
  constructor(private navController: NavController) {}

  ionViewWillEnter() {
    this.data = SUCCESS_TYPES.error_operation_km;
  }

  goBackToDetail() {
    this.navController.navigateForward(['/fiat-ramps/purchase-order/2']);
  }
}
