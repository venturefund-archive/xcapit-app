import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { WarrantyDataService } from '../shared-warranties/services/send-warranty-data/send-warranty-data.service';
import { WarrantiesService } from '../shared-warranties/services/warranties.service';

@Component({
  selector: 'app-withdraw-warranty',
  template: `<ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'warranties.withdraw_warranty.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ww ion-padding">
      <form [formGroup]="this.form">
        <div class="ww__withdraw-amount-card ux-card ion-padding no-border">
          <div class="ww__withdraw-amount-card__title ux-font-text-xl">
            {{ 'warranties.withdraw_warranty.title' | translate }}
          </div>
          <div class="ww__withdraw-amount-card__input">
            <app-ux-input
              controlName="email"
              type="email"
              inputmode="email"
              [label]="'warranties.withdraw_warranty.text_email' | translate"
              aria-label="email"
              tabindex="0"
              [labelColor]="'primary'"
              [placeholder]="'Email'"
            ></app-ux-input>
            <app-ux-input
              type="number"
              controlName="dni"
              inputmode="number"
              [labelColor]="'primary'"
              [label]="'warranties.withdraw_warranty.text_dni' | translate"
              [placeholder]="'DNI'"
              tabindex="1"
            ></app-ux-input>
            <div class="ww__withdraw-amount-card__subtitle ux-font-text-base">
              {{ 'warranties.withdraw_warranty.subtitle' | translate }}
            </div>
          </div>
        </div>
      </form>
      <div class="ww__support">
        <app-whatsapp-support> </app-whatsapp-support>
      </div>
    </ion-content>
    <ion-footer class="ww__footer">
      <div class="ww__footer__submit-button ion-padding">
        <ion-button
          class="ux_button ww__footer__submit-button__button"
          appTrackClick
          name="ux_warranty_withdraw_DNI"
          color="secondary"
          expand="block"
          (click)="this.submitForm()"
          [disabled]="!this.form.valid"
          >{{ 'wallets.send.send_detail.continue_button' | translate }}</ion-button
        >
      </div>
    </ion-footer>`,
  styleUrls: ['./withdraw-warranty.page.scss'],
})
export class WithdrawWarrantyPage implements OnInit {
  form: UntypedFormGroup = this.formBuilder.group({
    dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(9), Validators.pattern('[0-9]*$')]],
    email: ['', [Validators.email, Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
  });
  warrantyBalance: any;
  walletAddress: string;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private warrantiesService: WarrantiesService,
    private toastService: ToastService,
    private translate: TranslateService,
    private navController: NavController,
    private warrantyDataService: WarrantyDataService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.userWalletAddress();
  }

  async submitForm() {
    this.warrantyBalance = await this.warrantiesService
      .verifyWarranty({ user_dni: this.form.value.dni, wallet: this.walletAddress })
      .toPromise();
    if (this.warrantyBalance.amount === 0) {
      await this.toastService.showErrorToast({
        message: this.translate.instant('warranties.withdraw_warranty.toast_no_deposits_found'),
      });
      return;
    } else {
      this.goToWithdrawSummary();
    }
  }

  async userWalletAddress() {
    this.walletAddress = await this.storageService.getWalletsAddresses('MATIC');
  }

  saveData() {
    this.warrantyDataService.data = Object.assign({
      email: this.form.value.email,
      amount: this.warrantyBalance.amount,
      quoteAmount: this.warrantyBalance.amount,
      user_dni: this.form.value.dni,
      wallet: this.walletAddress,
    });
  }

  goToWithdrawSummary() {
    this.saveData();
    this.navController.navigateForward('warranties/withdraw-warranty-summary');
  }
}
