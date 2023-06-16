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
import { TrackService } from 'src/app/shared/services/track/track.service';
import { SimplifiedWallet } from '../../wallets/shared-wallets/models/simplified-wallet/simplified-wallet';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import {
  UserKycKriptonDataService
} from '../shared-ramps/services/user-kyc-kripton-data/user-kyc-kripton-data.service';

@Component({
  selector: 'app-home-of-purchases',
  template: ` <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="" (click)="this.back()"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ this.header | translate }}
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
        <app-operations-list
          *ngIf="this.isUserWarranty != undefined"
          [operationsList]="this.operationsList"
          [isUserWarranty]="this.isUserWarranty"
          [isLogged]="this.isLogged"
          (loggedOut)="loggedOut()"
        ></app-operations-list>
      </div>
      <div
        *ngIf="this.enabledProviders && this.enabledProviders.includes('moonpay')"
        class="hop__moonpay-purchases ion-padding-start ion-padding-end ion-padding-top"
      >
        <app-moonpay-purchases-card *ngIf="!this.isUserWarranty"></app-moonpay-purchases-card>
      </div>
      <div class="hop__question ion-padding-start ion-padding-end">
        <ion-text (click)="goToFaqs()" class="ux-link-xs">{{
          'fiat_ramps.home_of_purchases.question' | translate
        }}</ion-text>
      </div>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar class="hop__footer" *ngIf="!this.isUserWarranty">
        <ion-label class="hop__footer__title ux-font-text-lg">{{
          'fiat_ramps.home_of_purchases.footer.title' | translate
        }}</ion-label>
        <div class="hop__footer__actions">
          <ion-button
            class="ux_button"
            appTrackClick
            name="ux_buy_new"
            color="secondary"
            expand="block"
            (click)="this.buy()"
          >
            {{ 'fiat_ramps.home_of_purchases.footer.buy_button' | translate }}
          </ion-button>
          <ion-button
            *appFeatureFlag="'ff_sellEnabled'"
            class="ux_button"
            appTrackClick
            name="ux_sell_new"
            color="secondary"
            expand="block"
            (click)="this.sell()"
          >
            {{ 'fiat_ramps.home_of_purchases.footer.sell_button' | translate }}
          </ion-button>
        </div>
      </ion-toolbar>
      <div class="ux_footer ion-padding" *ngIf="this.isUserWarranty">
        <ion-button
          class="ux_button"
          appTrackClick
          name="ux_buy_new_simplified_wallet"
          color="secondary"
          size="large"
          expand="block"
          (click)="this.buy()"
        >
          {{ 'fiat_ramps.home_of_purchases.footer.buy_button_simplified' | translate }}
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
  header: string;
  statuses = {
    USER_INFORMATION: 'starting',
    USER_IMAGES: 'pending',
    COMPLETE: 'checking',
  };
  disabledStatusCard = true;
  isLogged: boolean;
  email: string;
  enabledProviders: string[];
  isUserWarranty: boolean;

  constructor(
    private fiatRampsService: FiatRampsService,
    private providersFactory: ProvidersFactory,
    private tokenOperationDataService: TokenOperationDataService,
    private navController: NavController,
    private translate: TranslateService,
    private kriptonStorage: KriptonStorageService,
    private kriptonUser: KriptonUserInjectable,
    private trackService: TrackService,
    private ionicStorageService: IonicStorageService,
    private userKycKriptonDataService: UserKycKriptonDataService
  ) {}

  async ionViewWillEnter() {
    await this.getUserWarranty();
    this.setHeader();
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

  setHeader() {
    this.header = this.isUserWarranty
      ? 'fiat_ramps.home_of_purchases.header_simplified'
      : 'fiat_ramps.home_of_purchases.header';
  }

  async getOperations(): Promise<void> {
    const auth_token = await this.kriptonStorage.get('access_token');
    this.fiatRampsService.getUserOperations({ email: this.email, auth_token }).subscribe((data) => {
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

  buy() {
    this.tokenOperationDataService.add({ mode: 'buy' });
    this.isUserWarranty ? this.navigateBySimplifiedWallet() : this.navigateBy();
  }

  navigateBySimplifiedWallet() {
    this.isLogged ? this.setDataSimplifiedWallet() : this.navigateToLoginKripton();
  }

  sell() {
    this.tokenOperationDataService.add({ mode: 'sell' });
    this.navigateBy();
  }

  navigateBy() {
    if (this.tokenOperationDataService.tokenOperationData.isFirstTime) {
      this.navController.navigateForward(
        this.tokenOperationDataService.hasAssetInfo() ? '/fiat-ramps/select-provider' : '/fiat-ramps/token-selection'
      );
      this.tokenOperationDataService.add({ isFirstTime: false });
    } else {
      this.navController.navigateForward('/fiat-ramps/token-selection');
    }
  }

  setDataSimplifiedWallet() {
    this.tokenOperationDataService.add({ asset: 'USDC', network: 'MATIC', country: 'ARG' });
    this.navigateByOperation();
  }

  navigateByOperation() {
    this.navController.navigateRoot('/fiat-ramps/new-operation/kripton');
  }

  navigateToLoginKripton() {
    this.navController.navigateForward('/fiat-ramps/user-email');
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

  private async getUserWarranty() {
    this.isUserWarranty = await new SimplifiedWallet(this.ionicStorageService).value();
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

  back() {
    return this.navController.navigateBack('/tabs/wallets');
  }

  loggedOut() {
    this.userKycKriptonDataService.clean();
    this.isLogged = false;
    this.userStatus = null;
    this.email = null;
  }
}
