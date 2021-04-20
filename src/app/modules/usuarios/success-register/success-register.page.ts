import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-success-register',
  template: `
    <ion-content class="ion-padding">
      <app-success-content [data]="this.data" [unauth]="true" (secondaryActionEvent)="this.resendVerificationEmail()"></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./success-register.page.scss'],
})
export class SuccessRegisterPage implements OnInit {
  data: any;

  constructor(private navController: NavController, private router: Router) { }

  ngOnInit() {
    this.data = SUCCESS_TYPES.register;
  }

  resendVerificationEmail() {
    this.router.navigate(['/users/resend-verification-email']);
  }
}
