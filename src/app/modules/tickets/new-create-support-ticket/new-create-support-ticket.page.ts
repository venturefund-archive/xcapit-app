import { Component, OnInit } from '@angular/core';
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
        (success)="this.success()"
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

  async success() {
    let route = '/tickets/new-success';
    if (this.isLoggedIn) {
      route = '/tickets/new-success-wallet';
    }
    await this.navController.navigateForward([route], { replaceUrl: true });
  }
}
