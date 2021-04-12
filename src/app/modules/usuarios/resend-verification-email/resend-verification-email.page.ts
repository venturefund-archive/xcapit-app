import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-resend-verification-email',
  template: `
    <ion-content class="ion-padding">
      <app-success-content
        [data]="this.data"
        [unauth]="true"
      ></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./resend-verification-email.page.scss'],
})
export class ResendVerificationEmailPage implements OnInit {
  data : any
  
  constructor() {}

  ngOnInit() {
    this.data = SUCCESS_TYPES.resend_verification_email;
    this.data.enabledPrimaryAction = false;
  }
}
