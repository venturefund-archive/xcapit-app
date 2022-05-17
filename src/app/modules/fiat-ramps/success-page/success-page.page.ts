import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-success-page',
  template: `
    <ion-content class="ion-padding">
      <app-success-content [data]="this.data">
      </app-success-content>
    </ion-content>
  `,
  styleUrls: ['./success-page.page.scss'],
})
export class SuccessPagePage implements OnInit {
  data: any;
  
  constructor(
  ) {}
  
  ngOnInit() {
    this.data = SUCCESS_TYPES.success_fiat_ramps;
  }
}
