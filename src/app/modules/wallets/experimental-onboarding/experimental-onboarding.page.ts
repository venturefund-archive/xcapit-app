import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TokenOperationDataService } from '../../fiat-ramps/shared-ramps/services/token-operation-data/token-operation-data.service';
import { structuredClone } from '../../../shared/utils/structured-clone';
import { INITIATION_WALLET_STEPS } from '../shared-wallets/constants/initiation-wallet-steps';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';

@Component({
  selector: 'app-experimental-onboarding',
  template: `
    <ion-content class="ew">
      <div class="ew__header">
        <div class="ew__header__close-button">
          <ion-button fill="clear" appTrackClick name="Close Success" (click)="this.closeToWallet()">
            <ion-icon class="ew__header__close_button__icon" name="ux-close"></ion-icon>
          </ion-button>
        </div>
      </div>
      <div class="ew__content">
        <div class="ew__content__image">
          <img src="assets/img/user-profile/avatar-profile-xcapit.svg" />
        </div>
        <div class="ew__content__title">
          <ion-text class="ux-font-text-xl">
            {{ 'wallets.experimental_onboarding.title' | translate : { username: this.username } }}</ion-text
          >
        </div>
        <div class="ew__content__progress">
          <ion-progress-bar></ion-progress-bar>

          <div class="ew__content__actions">
            <ion-text class="ux-font-text-lg">{{ 'wallets.experimental_onboarding.init_wallet' | translate }}</ion-text>
            <ion-text class="ux-font-text-base">{{
              'wallets.experimental_onboarding.complete_steps' | translate
            }}</ion-text>
          </div>
        </div>
        <div class="ew__content__next">
          <ion-text class="ux-font-text-lg">{{ 'wallets.experimental_onboarding.next_step' | translate }}</ion-text>
          <div class="ew__content__card">
            <app-initiation-wallet-step-card
              *ngFor="let nextStep of this.nextSteps"
              [nextStep]="nextStep"
              (navigate)="this.navigateTo($event)"
            ></app-initiation-wallet-step-card>
          </div>
        </div>
        <div class="ew__content__competed">
          <ion-text class="ux-font-header-titulo">{{
            'wallets.experimental_onboarding.progress' | translate
          }}</ion-text>
          <div class="ew__content__card">
            <app-initiation-wallet-step-card
              *ngFor="let stepCompleted of this.stepsCompleted"
              [stepCompleted]="stepCompleted"
            ></app-initiation-wallet-step-card>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./experimental-onboarding.page.scss'],
})
export class ExperimentalOnboardingPage {
  steps = structuredClone(INITIATION_WALLET_STEPS);
  username: string;
  nextSteps: any;
  stepsCompleted: any;
  constructor(
    private walletService: WalletService,
    private navController: NavController,
    private tokenOperationDataService: TokenOperationDataService
  ) {}

  ionViewWillEnter() {
    this.setUsername();
    this.filterSteps();
  }

  closeToWallet() {
    this.navController.navigateForward('tabs/wallets');
  }

  filterSteps() {
    this.nextSteps = this.steps.filter((steps) => !steps.isComplete);
    this.stepsCompleted = this.steps.filter((steps) => steps.isComplete);
  }

  setUsername() {
    this.walletService.walletExist().then((res) => {
      this.username = `Xcapiter${this.walletService.addresses['ERC20'].substring(0, 5)}`;
    });
  }

  navigateTo(event) {
    this.setTokenOperationData(event.name);
    this.navController.navigateForward(event.url);
  }

  setTokenOperationData(name) {
    if (name === 'ux_exp_buy') {
      this.tokenOperationDataService.tokenOperationData = {
        asset: 'USDC',
        network: 'MATIC',
        country: this.tokenOperationDataService?.tokenOperationData?.country,
        mode: 'buy',
      };
    }
  }
}
