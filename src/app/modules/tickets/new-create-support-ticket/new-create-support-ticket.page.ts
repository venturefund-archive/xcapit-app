import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { LoggedIn } from '../../users/shared-users/models/logged-in/logged-in';

@Component({
  selector: 'app-new-create-support-ticket',
  template: `
    <ion-content class="form_component">
      <app-create-ticket-form
        [emailInput]="true"
        [canModifyEmail]="true"
        (successTicketCreation)="this.success($event)"
        (ionBackButton)="this.goBackToFAQs()"
      ></app-create-ticket-form>
    </ion-content>
  `,
  styleUrls: ['./new-create-support-ticket.page.scss'],
})
export class NewCreateSupportTicketPage implements OnInit {
  isLoggedIn: boolean;

  constructor(private navController: NavController, private storage: IonicStorageService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    new LoggedIn(this.storage).value().then((res) => {
      this.isLoggedIn = res;
    });
  }

  async success(formValues: any) {
    let route = '/tickets/new-success';
    if (this.isLoggedIn) {
      route = '/tickets/new-success-wallet';
    }
    const navigationExtras: NavigationExtras = {
      queryParams: {
        email: formValues.email,
      },
      replaceUrl: true,
    };
    await this.navController.navigateForward([route], navigationExtras);
  }

  async goBackToFAQs() {
    await this.navController.navigateBack(['/support/options']);
  }
}
