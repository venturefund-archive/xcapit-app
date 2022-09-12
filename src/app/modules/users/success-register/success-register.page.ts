import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-success-register',
  template: `
    <ion-content *ngIf="this.data" class="ion-padding">
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
    private navController: NavController,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.getEmail();
    this.data = SUCCESS_TYPES.register;
    this.data.textSecondary = this.translate.instant(this.data.textSecondary, { email: this.email });
  }

  getEmail() {
    this.email = this.router.getCurrentNavigation().extras?.state?.email;
    if (!this.email) {
      this.navController.navigateBack(['/users/register', this.email]);
    }
  }

  resendVerificationEmail() {
      const params: NavigationExtras = { state: { email: this.email } };
      this.navController.navigateForward(['/users/resend-verification-email'], params);
  }
}
