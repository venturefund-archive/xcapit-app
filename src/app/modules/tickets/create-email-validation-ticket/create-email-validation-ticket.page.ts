import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-create-ticket',
  template: `
    <ion-content class="form_component">
      <app-create-ticket-form
        *ngIf="this.userEmail"
        [userEmail]="this.userEmail"
        [emailInput]="true"
        [canModifyEmail]="this.canModifyEmail"
        category="Mi cuenta/Registro"
        (successTicketCreation)="this.success()"
        (ionBackButton)="this.goBackToLogin()"
      ></app-create-ticket-form>
    </ion-content>
  `,
  styleUrls: ['./create-email-validation-ticket.page.scss'],
})
export class CreateEmailValidationTicketPage implements OnInit {
  canModifyEmail = true;
  userEmail: string;
  constructor(private navController: NavController, private router: Router) {}

  ngOnInit() {
    this.userEmail = this.router.getCurrentNavigation().extras?.state?.email;
  }

  ionViewWillEnter() {
    if (this.userEmail) {
      this.canModifyEmail = false;
    }
  }
  async success() {
    await this.navController.navigateForward(['/tickets/success', true]);
  }

  async goBackToLogin() {
    await this.navController.navigateBack(['/users/login-new']);
  }
}
