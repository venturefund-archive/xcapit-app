import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success-reset-password',
  template: `
    <ion-content class="ion-padding">
      <app-success-content [data]="this.data" [unauth]="true"></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./success-reset-password.page.scss'],
})
export class SuccessResetPasswordPage implements OnInit {
  data: any;
  isReset: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.isReset = this.route.snapshot.paramMap.get('isReset');
    if (this.isReset === 'false') {
      this.data = SUCCESS_TYPES.email_reset_password;
    } else if (this.isReset === 'true') {
      this.data = SUCCESS_TYPES.reset_password;
    }
  }
}
