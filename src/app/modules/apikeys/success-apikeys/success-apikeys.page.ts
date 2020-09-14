import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-success-apikeys',
  template: `
    <ion-content class="ion-padding">
      <app-success-content [data]="this.data"></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./success-apikeys.page.scss']
})

export class SuccessApikeysPage implements OnInit {
  constructor() {}
  data: any;
  ngOnInit() {
    this.data = SUCCESS_TYPES.apikeys;
  }
}
