import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-success-profile',
  template: `
    <ion-content class="ion-padding">
      <app-success-content [data]="this.data"></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./success-profile.page.scss']
})
export class SuccessProfilePage implements OnInit {
  data: any;

  constructor() {}

  ngOnInit() {
    this.data = SUCCESS_TYPES.profile;
  }
}
