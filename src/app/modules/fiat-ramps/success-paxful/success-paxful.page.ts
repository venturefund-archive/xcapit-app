import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-success-paxful',
  template: `
    <ion-content class="ion-padding">
      <app-success-content [data]="this.data"></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./success-paxful.page.scss'],
})
export class SuccessPaxfulPage implements OnInit {
  data: any;

  constructor() {}

  ngOnInit() {
    this.data = SUCCESS_TYPES.paxful_on_ramp_success;
  }
}
