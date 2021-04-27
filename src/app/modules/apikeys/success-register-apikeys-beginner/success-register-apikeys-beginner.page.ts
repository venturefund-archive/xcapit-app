import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-success-register-apikeys-beginner',
  template: `
    <ion-content class="ion-padding">
      <app-success-content [data]="this.data"></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./success-register-apikeys-beginner.page.scss'],
})
export class SuccessRegisterApikeysBeginnerPage implements OnInit {
  data: any;

  constructor() {}

  ngOnInit() {
    this.data = SUCCESS_TYPES.apikeys_register_success_begginer;
  }
}
