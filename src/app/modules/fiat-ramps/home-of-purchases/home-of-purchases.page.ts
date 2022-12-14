import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';
import { KriptonUserInjectable } from '../shared-ramps/models/kripton-user/injectable/kripton-user.injectable';

@Component({
  selector: 'app-home-of-purchases',
  template: ` <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.home_of_purchases.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="hop">
      <div
        *ngIf="this.enabledProviders && this.enabledProviders.includes('kripton')"
        class="kyc-status-card ion-padding-start ion-padding-end ion-padding-top"
        [ngClass]="this.style"
      >
        <app-kyc-status-card
          *ngIf="this.userStatus"
          [title]="this.title"
          [message]="this.message"
          [style]="this.style"
          [statusText]="this.status"
          [userStatus]="this.userStatus.registration_status"
          [kycApproved]="this.userStatus.kyc_approved"
          [disabledCard]="this.disabledStatusCard"
        ></app-kyc-status-card>
      </div>
      <div
        class="hop__operations-list ion-padding-start ion-padding-end ion-padding-top"
        *ngIf="this.isLogged !== undefined && this.enabledProviders && this.enabledProviders.includes('kripton')"
      >
        <app-operations-list [operationsList]="this.operationsList" [isLogged]="this.isLogged"></app-operations-list>
      </div>
      <div
        *ngIf="this.enabledProviders && this.enabledProviders.includes('moonpay')"
        class="hop__moonpay-purchases ion-padding-start ion-padding-end ion-padding-top"
      >
        <app-moonpay-purchases-card></app-moonpay-purchases-card>
      </div>
      <div class="hop__question ion-padding-start ion-padding-end">
        <ion-text (click)="goToFaqs()" class="ux-link-xs">{{
          'fiat_ramps.home_of_purchases.question' | translate
        }}</ion-text>
      </div>
    </ion-content>
    <ion-footer>
      <div class="hop__button ion-padding">
        <ion-button
          class="ux_button"
          appTrackClick
          name="ux_buy_kripton_new"
          color="secondary"
          expand="block"
          (click)="this.handler()"
        >
          {{ 'fiat_ramps.home_of_purchases.button' | translate }}
        </ion-button>
      </div>
    </ion-footer>`,
  styleUrls: ['./home-of-purchases.page.scss'],
})
export class HomeOfPurchasesPage {
  operationsList: FiatRampOperation[];
  title: string;
  status: string;
  message: string;
  style: string;
  statusName: string;
  userStatus: any;
  statuses = {
    USER_INFORMATION: 'starting',
    USER_IMAGES: 'pending',
    COMPLETE: 'checking',
  };
  disabledStatusCard = true;
  isLogged: boolean;
  email: string;
  enabledProviders: string[];

  constructor(
    private fiatRampsService: FiatRampsService,
    private providersFactory: ProvidersFactory,
    private tokenOperationDataService: TokenOperationDataService,
    private navController: NavController,
    private translate: TranslateService,
    private kriptonStorage: KriptonStorageService,
    private kriptonUser: KriptonUserInjectable
  ) {}

  async ionViewWillEnter() {
    this.setEnabledProviders();
    this.checkIfUserIsLogged();
    await this.getUserEmail();
    this.getUserOperations();
    await this.getUserStatus();
  }

  async ionViewDidEnter() {
    if (!(await this.kriptonStorage.get('kyc_approved'))) this.disabledStatusCard = false;
  }

  async checkIfUserIsLogged() {
    this.isLogged = await this.kriptonUser.create().isLogged();
  }

  async getUserOperations() {
    if (this.enabledProviders.includes('kripton') && this.isLogged) this.getOperations();
  }

  getOperations(): void {
    this.fiatRampsService.getUserOperations({ email: this.email }).subscribe((data) => {
      this.operationsList = data;
    });
  }

  setEnabledProviders() {
    this.enabledProviders = this.providers().map((provider: FiatRampProvider) => provider.alias);
  }

  providers(): FiatRampProvider[] {
    return this.providersFactory.create().all();
  }

  goToFaqs() {
    this.navController.navigateForward('/support/faqs/buy');
  }

  handler() {
    const url = this.tokenOperationDataService.tokenOperationData
      ? 'fiat-ramps/select-provider'
      : 'fiat-ramps/token-selection';
    this.navController.navigateForward(url);
  }

  private async getUserEmail() {
    this.email = await this.kriptonStorage.get('email');
  }

  async getUserStatus() {
    if (this.email && this.isLogged) {
      this.userStatus = await this.fiatRampsService.getOrCreateUser({ email: this.email }).toPromise();
      this.setCorrectDataByStatus();
    }
  }

  setCorrectDataByStatus() {
    this.title = this.translate.instant('fiat_ramps.kyc_status.title');
    this.message = this.translate.instant('fiat_ramps.kyc_status.starting.message');
    this.style = 'warning';
    this.status = this.translate.instant(
      `fiat_ramps.kyc_status.${this.statuses[this.userStatus.registration_status]}.status`
    );

    if (this.userStatus.registration_status === 'COMPLETE') {
      this.message = this.translate.instant('fiat_ramps.kyc_status.checking.message');
    }

    if (this.userStatus.kyc_approved) {
      this.title = this.translate.instant('fiat_ramps.kyc_status.approving.title');
      this.message = this.translate.instant('fiat_ramps.kyc_status.approving.message');
      this.style = 'approving';
    }
  }
}
