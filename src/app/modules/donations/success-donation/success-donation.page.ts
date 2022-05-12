import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-success-donation',
  template:`
   <ion-content class="ion-padding">
      <app-success-content [data]="this.data"></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./success-donation.page.scss'],
})
export class SuccessDonationPage implements OnInit {
  data = SUCCESS_TYPES.success_donation;
  constructor() { }

  ngOnInit() {
  }

}
