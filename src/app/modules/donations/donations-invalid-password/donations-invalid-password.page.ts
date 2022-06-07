import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SUCCESS_TYPES } from '../../../shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-donations-invalid-password',
  template: `
    <ion-content class="ion-padding failed-mnemonic-content">
      <app-success-content
        *ngIf="this.data"
        [data]="this.data"
        imageName="ux-error-open-lock.svg"
        imageAlt="Error Image"
        (primaryActionEvent)="this.goBackToSummary()"
      ></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./donations-invalid-password.page.scss'],
})
export class DonationsInvalidPasswordPage implements OnInit {
  data: any;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.data = SUCCESS_TYPES.error_wallet_incorrect_password;
  }

  goBackToSummary() {
    this.navController.navigateBack('/donations/summary-data');
  }
}
