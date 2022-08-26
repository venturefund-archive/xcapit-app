import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
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

  constructor(private route: ActivatedRoute, private router: Router, private navController: NavController, private translate: TranslateService) {
    this.route.queryParams.subscribe(() => {
      const navigationState = this.router.getCurrentNavigation().extras;
      if (navigationState) {
        this.email = navigationState.state.email;
      } else {
        this.navController.navigateBack(['/users/register', this.email]);
      }
    });
  }

  ngOnInit() {
    this.data = SUCCESS_TYPES.register;
    this.data.textSecondary = this.translate.instant(this.data.textSecondary, {email: this.email}) 
    this.data.image = "assets/img/users/success-register/success-register.svg"
  }

  resendVerificationEmail() {
    this.navController.navigateForward(['/users/resend-verification-email', this.email]);
  }
}