import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';

@Component({
  selector: 'app-new-create-support-ticket',
  template: `
    <div class="form_component">
      <app-create-ticket-form 
        [emailInput]="true"
        [canModifyEmail]="true"
        (success)="this.success()"
      ></app-create-ticket-form>
    </div>
  `,
  styleUrls: ['./new-create-support-ticket.page.scss'],
})
export class NewCreateSupportTicketPage implements OnInit {
  walletExists: boolean;

  constructor(
    private navController: NavController,
    private walletService: WalletService
    ) { }

  ngOnInit() {}

  ionViewWillEnter() {
  this.walletService.walletExist().then((res) => { this.walletExists = res })
  }

  async success() {
    let route = '/tickets/new-success'
    if (this.walletExists) {
      route = '/tickets/new-success-wallet'
    }
    await this.navController.navigateForward([route], { replaceUrl: true });
  }
}
