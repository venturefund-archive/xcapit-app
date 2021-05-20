import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-success-register',
  template: `
    <ion-content class="ion-padding">
      <app-success-content
        [data]="this.data"
        [unauth]="true"
        (secondaryActionEvent)="this.resendVerificationEmail()"
      ></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./success-register.page.scss'],
})
export class SuccessRegisterPage implements OnInit {
  data: any;
  email: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navController: NavController
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.email = this.router.getCurrentNavigation().extras.state.email;
      }
    });
  }

  ngOnInit() {
    this.data = SUCCESS_TYPES.register;
  }

  resendVerificationEmail() {
    const params = { state: { email: this.email } };
    this.navController.navigateForward(
      ['/users/resend-verification-email'],
      params
    );
  }
}
