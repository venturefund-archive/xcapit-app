import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletConnectService } from '../../wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { TICKET_CATEGORIES } from '../../tickets/shared-tickets/constants/ticket-categories';
import { ApiTicketsService } from '../../tickets/shared-tickets/services/api-tickets.service';
import { DeleteAccountDataService } from '../shared-profiles/services/delete-account-data/delete-account-data.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

@Component({
  selector: 'app-delete-account',
  template: ` <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/profiles/menu"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'profiles.delete_account.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="da">
        <div class="da__texts">
          <div class="da__texts__first-text">
            <ion-text class="ux-font-text-base" color="neutral90"
              >{{ 'profiles.delete_account.first_text' | translate }}
            </ion-text>
          </div>
          <div class="da__texts__second-text">
            <ion-text class="ux-font-text-base" color="neutral90">{{
              'profiles.delete_account.second_text' | translate
            }}</ion-text>
          </div>
        </div>
        <div class="da__form">
          <form [formGroup]="this.form">
            <app-ux-input
              controlName="email"
              type="email"
              inputmode="email"
              [label]="'profiles.delete_account.email_label' | translate"
              aria-label="email"
              tabindex="0"
              color="primary"
            ></app-ux-input>
          </form>
        </div>
        <div class="da__disclaimer">
          <div class="da__disclaimer__icon">
            <ion-icon name="ux-inbox"></ion-icon>
          </div>
          <div>
            <ion-text class="da__disclaimer__text ux-font-text-xs"
              >{{ 'profiles.delete_account.disclaimer' | translate }}
            </ion-text>
            <ion-text class="da__disclaimer__link ux-link-xs" (click)="goToWalletSupport()">{{
              'profiles.delete_account.link' | translate
            }}</ion-text>
          </div>
        </div>
      </div>
    </ion-content>
    <ion-footer>
      <div class="da__button ion-padding">
        <ion-button
          controlName="email"
          class="ux_button"
          appTrackClick
          name="ux_confirm_delete_account"
          color="secondary"
          expand="block"
          [disabled]="!this.form.valid"
          (click)="this.deleteAccount()"
        >
          {{ 'profiles.delete_account.button' | translate }}
        </ion-button>
      </div>
    </ion-footer>`,
  styleUrls: ['./delete-account.page.scss'],
})
export class DeleteAccountPage {
  form: UntypedFormGroup = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
  });
  wallet: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private translate: TranslateService,
    private storageService: StorageService,
    private ionicStorageService: IonicStorageService,
    private walletConnectService: WalletConnectService,
    private apiTicketsService: ApiTicketsService,
    private navController: NavController,
    private deleteAccountDataService: DeleteAccountDataService,
    private toastService: ToastService
  ) {}

  ionViewWillEnter() {
    this._getUserWalletAddress();
  }

  deleteAccount() {
    this.saveData();
    this.createTicket();
  }

  saveData() {
    this.deleteAccountDataService.email = this.form.value.email;
  }

  createTicket() {
    const category = TICKET_CATEGORIES.find((category) => category.name === 'Mi cuenta/Registro');
    const data = {
      email: this.form.value.email,
      category_code: category.name,
      subject: this.translate.instant(category.value),
      message: this.translate.instant('profiles.user_profile_menu.delete_account_message', { wallet: this.wallet }),
    };
    this.apiTicketsService.createTicket(data).subscribe(
      () => {
        this.cleanStorage();
        this.goToSuccessPage();
      },
      () => this.showToastError()
    );
  }

  async cleanStorage() {
    this.storageService.removeWalletFromStorage();
    this.ionicStorageService.clear();
    await this.walletConnectService.killSession();
  }

  goToSuccessPage() {
    this.navController.navigateRoot('profiles/success-delete-account');
  }

  async showToastError() {
    await this.toastService.showErrorToast({
      message: this.translate.instant('errorCodes.tickets.create_ticket.invalid_data'),
    });
  }

  private async _getUserWalletAddress() {
    const wallet = await this.storageService.getWalletFromStorage();
    this.wallet = wallet.addresses.ERC20;
  }

  goToWalletSupport() {
    this.navController.navigateForward('support/faqs/wallet');
  }
}
