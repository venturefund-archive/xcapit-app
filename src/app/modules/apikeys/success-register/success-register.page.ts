import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-success-register',
  template: `
  <ion-content class="ion-padding">
    <app-success-content [data]="this.data" [unauth]="true"></app-success-content>
  </ion-content>
`,
  styleUrls: ['./success-register.page.scss'],
})
export class SuccessRegisterPage implements OnInit {
  data: any;

  constructor() { }

  ngOnInit() {
    this.data = SUCCESS_TYPES.apikeysregister_success;
  }

}
