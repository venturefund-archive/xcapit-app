import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LINKS } from 'src/app/config/static-links';
import { InformationModalComponent } from 'src/app/shared/components/information-modal/information-modal.component';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ScanUrlOf } from '../../wallets/shared-wallets/models/scan-url-of/scan-url-of';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { COUNTRIES } from '../shared-ramps/constants/countries';
import { OPERATION_STATUS } from '../shared-ramps/constants/operation-status';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';
import { FiatRampProviderCountry } from '../shared-ramps/interfaces/fiat-ramp-provider-country';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { OperationDataInterface } from '../shared-ramps/interfaces/operation-data.interface';
import { OperationStatus } from '../shared-ramps/interfaces/operation-status.interface';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';

@Component({
  selector: 'app-kripton-operation-detail',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/purchases"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.kripton_operation_detail.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding kod">
      <div class="kod__card-container">
        <ion-card class="kod__card-container__card ux-card-new ion-no-margin" *ngIf="this.operation">
          <div class="kod__card-container__card__title">
            <ion-text class="ux-font-text-xl">
              {{ 'fiat_ramps.kripton_operation_detail.title' | translate }}
            </ion-text>
          </div>

          <ion-item class="kod__card-container__card__coin ion-no-margin ion-no-padding">
            <div class="kod__card-container__card__coin__icon">
              <img [src]="this.token.logoRoute" alt="Token" />
            </div>
            <div class="kod__card-container__card__coin__content">
              <div class="kod__card-container__card__coin__content__name">
                <ion-text class="ux-font-text-lg">{{ this.token.value }}</ion-text>
              </div>
              <div class="kod__card-container__card__coin__content__network">
                <app-token-network-badge [blockchainName]="this.token.network"></app-token-network-badge>
              </div>
            </div>
            <div class="kod__card-container__card__amount">
              <div class="kod__card-container__card__amount__out">
                <ion-text class="ux-font-text-lg"
                  >{{ this.operation.amount_out | formattedAmount }}
                  {{ this.operation.currency_out | uppercase }}</ion-text
                >
              </div>
              <div class="kod__card-container__card__amount__in">
                <ion-text class="ux-font-text-xs"
                  >= {{ this.operation.amount_in | number : '1.2-2' }}
                  {{ this.operation.currency_in | uppercase }}</ion-text
                >
              </div>
            </div>
          </ion-item>

          <ion-item class="kod__card-container__card__state ion-no-margin ion-no-padding" (click)="this.openScan()">
            <div class="kod__card-container__card__state__container">
              <div class="kod__card-container__card__state__container__title">
                <ion-text class="ux-font-titulo-xs">
                  {{ 'fiat_ramps.kripton_operation_detail.state' | translate }}
                </ion-text>
                <ion-icon
                  *ngIf="this.operation.status !== 'complete'"
                  name="information-circle"
                  (click)="this.showStateInformation()"
                  color="info"
                ></ion-icon>
              </div>
              <div class="kod__card-container__card__state__container__status">
                <app-operation-status-chip [statusName]="this.operation.status"></app-operation-status-chip>
                <ion-text *ngIf="this.operation.tx_hash" class="ux-link-xs"
                  >{{ 'fiat_ramps.kripton_operation_detail.scan_link' | translate }}
                  {{ 'fiat_ramps.kripton_operation_detail.scans.' + this.operation.network | translate }}</ion-text
                >
              </div>
              <app-operation-status-alert
                *ngIf="this.operation.status !== 'received' && this.operation.status !== 'complete'"
                [operationStatus]="this.operation.status"
                (goToPurchaseOrder)="this.goToPurchaseOrder()"
              ></app-operation-status-alert>
            </div>
          </ion-item>

          <ion-item class="kod__card-container__card__quotation ion-no-margin ion-no-padding">
            <div class="kod__card-container__card__quotation__container">
              <div class="kod__card-container__card__quotation__container__title">
                <ion-text class="ux-font-titulo-xs">
                  {{ 'fiat_ramps.kripton_operation_detail.quotation' | translate }}
                </ion-text>
              </div>
              <div class="kod__card-container__card__quotation__container__content">
                <ion-text class="ux-font-text-base">
                  1 {{ this.operation.currency_out | uppercase }} =
                  {{ this.operation.amount_in / this.operation.amount_out | number : '1.2-2' }}
                  {{ this.operation.currency_in | uppercase }}
                </ion-text>
              </div>
            </div>
          </ion-item>

          
          <ion-item class="kod__card-container__card__fee ion-no-margin ion-no-padding" *ngIf="this.operation.fiat_fee">
            <div class="kod__card-container__card__fee__container">
              <div class="kod__card-container__card__fee__container__title">
                <ion-text class="ux-font-titulo-xs">
                  {{ 'fiat_ramps.kripton_operation_detail.fee' | translate }}
                </ion-text>
              </div>
              <div class="kod__card-container__card__fee__container__content">
                <ion-text class="ux-font-text-base">
                  {{ this.operation.fiat_fee }} 
                </ion-text>
              </div>
            </div>
          </ion-item>

          <ion-item class="kod__card-container__card__address ion-no-margin ion-no-padding">
            <div class="kod__card-container__card__address__container">
              <div class="kod__card-container__card__address__container__title">
                <ion-text class="ux-font-titulo-xs">
                  {{ 'fiat_ramps.kripton_operation_detail.address' | translate }}
                </ion-text>
              </div>
              <div class="kod__card-container__card__address__container__content">
                <ion-text class="ux-font-text-base">
                  {{ this.operation.wallet_address }}
                </ion-text>
              </div>
            </div>
          </ion-item>

          <ion-item class="kod__card-container__card__provider ion-no-margin ion-no-padding">
            <div class="kod__card-container__card__provider__container">
              <div class="kod__card-container__card__provider__container__provider">
                <div class="kod__card-container__card__provider__container__provider__title">
                  <ion-text class="ux-font-titulo-xs">
                    {{ 'fiat_ramps.kripton_operation_detail.provider' | translate }}
                  </ion-text>
                </div>
                <div class="kod__card-container__card__provider__container__provider__content">
                  <img src="assets/img/provider-logos/KriptonMarket.svg" />

                  <ion-text class="ux-font-text-base"> Kripton Market </ion-text>
                </div>
              </div>
              <div class="kod__card-container__card__provider__container__operation">
                <div class="kod__card-container__card__provider__container__operation__title">
                  <ion-text class="ux-font-titulo-xs">
                    {{ 'fiat_ramps.kripton_operation_detail.operation' | translate }}
                  </ion-text>
                </div>
                <div class="kod__card-container__card__provider__container__operation__content">
                  <ion-text class="ux-font-text-base"> N° {{ this.operation.operation_id }} </ion-text>
                </div>
              </div>
            </div>
          </ion-item>

          <ion-item class="kod__card-container__card__date ion-no-margin ion-no-padding" lines="none">
            <div class="kod__card-container__card__date__container">
              <div class="kod__card-container__card__date__container__date">
                <div class="kod__card-container__card__date__container__date__title">
                  <ion-text class="ux-font-titulo-xs">
                    {{ 'fiat_ramps.kripton_operation_detail.date' | translate }}
                  </ion-text>
                </div>
                <div class="kod__card-container__card__date__container__date__content">
                  <ion-text class="ux-font-text-base">
                    {{ this.operation.created_at | date : 'dd/MM/YYYY' }}
                  </ion-text>
                </div>
              </div>
              <div class="kod__card-container__card__date__container__hour">
                <div class="kod__card-container__card__date__container__hour__content">
                  <ion-text class="ux-font-text-base">
                    {{ this.operation.created_at | date : 'HH:mm'
                    }}{{ 'fiat_ramps.kripton_operation_detail.hours' | translate }}
                  </ion-text>
                </div>
              </div>
            </div>
          </ion-item>
        </ion-card>
      </div>
      <div class="kod__disclaimer">
        <div class="kod__disclaimer__header">
          <ion-text class="ux-font-text-base">
            {{ 'fiat_ramps.kripton_operation_detail.support.header' | translate }}
          </ion-text>
        </div>
        <div class="kod__disclaimer__link">
          <ion-button
            name="ux_goto_kripton_tos"
            class="ux-link-xs ion-no-margin ion-no-padding"
            fill="clear"
            (click)="this.navigateToKriptonTOS()"
            size="small"
          >
            {{ 'fiat_ramps.kripton_operation_detail.support.link' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./kripton-operation-detail.page.scss'],
})
export class KriptonOperationDetailPage {
  provider: FiatRampProvider;
  operation: FiatRampOperation;
  token: Coin;
  status: OperationStatus;
  isInfoModalOpen = false;
  description: string;
  description2: string;
  country: FiatRampProviderCountry;

  constructor(
    private browserService: BrowserService,
    private route: ActivatedRoute,
    private providersFactory: ProvidersFactory,
    private fiatRampsService: FiatRampsService,
    private apiWalletService: ApiWalletService,
    private navController: NavController,
    private trackService: TrackService,
    private modalController: ModalController,
    private translate: TranslateService,
    private storageOperationService: StorageOperationService,
    private kriptonStorageService: KriptonStorageService
  ) {}

  ionViewWillEnter() {
    const operationId = this.route.snapshot.paramMap.get('operation_id');
    this.provider = this.providersFactory.create().byAlias('kripton');
    this.getUserOperation(operationId);
    this.trackScreenViewEvent();
  }

  async navigateToKriptonTOS() {
    await this.browserService.open({
      url: LINKS.kriptonSupport,
    });
  }

  private getCountry() {
    this.country = COUNTRIES.find(
      (c) => c.fiatCode && c.fiatCode.toUpperCase() === this.operation.currency_in.toUpperCase()
    );
  }

  private _getOperationStatus(): OperationStatus {
    return OPERATION_STATUS.find((s) => s.name === this.operation.status);
  }

  async showStateInformation() {
    if (!this.isInfoModalOpen) {
      this.isInfoModalOpen = true;
      const modal = await this.modalController.create({
        component: InformationModalComponent,
        componentProps: {
          title: this.translate.instant('fiat_ramps.operation_status_detail.title'),
          status: this.status.name,
          description: this.description,
          description2: this.description2,
          buttonText: this.translate.instant('fiat_ramps.operation_status_detail.button'),
        },
        cssClass: 'modal',
        backdropDismiss: false,
      });
      await modal.present();
      this.isInfoModalOpen = false;
    }
  }

  private _setText(status: string) {
    if (status === 'incomplete') {
      this.description = this.translate.instant(`fiat_ramps.operation_status_detail.${status}.description`);
      this.description2 = this.translate.instant(`fiat_ramps.operation_status_detail.${status}.description2`);
    } else {
      this.description = this.translate.instant(`fiat_ramps.operation_status_detail.${status}.description`);
    }
  }

  private async getUserOperation(operationId: string) {
    const email = await this.kriptonStorageService.get('email');
    const auth_token = await this.kriptonStorageService.get('access_token');
    this.fiatRampsService.setProvider(this.provider.id.toString());
    this.fiatRampsService.getUserSingleOperation(operationId, { email, auth_token }).subscribe({
      next: (data) => {
        this.operation = data[0];
        this.getCoin();
        this.getCountry();
        this.status = this._getOperationStatus();
        this._setText(this.status.textToShow);
      },
      error: () => {
        this.navigateBackToOperations();
      },
    });
  }

  getCoin() {
    const asset = this.fiatRampsService.getProvider(1).currencies.find((c) => c.symbol === this.operation.currency_out);
    this.token = this.apiWalletService.getCoin(asset.symbol, asset.network);
  }

  navigateBackToOperations() {
    this.navController.navigateBack(['/fiat-ramps/purchases']);
  }

  trackScreenViewEvent() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_buy_kripton_screenview_details',
    });
  }

  async goToPurchaseOrder() {
    await this.setOperationStorage();
    this.navController.navigateForward('/fiat-ramps/purchase-order/1', { animated: false });
  }

  async setOperationStorage() {
    const data: OperationDataInterface = {
      country: this.country.name,
      type: 'cash-in',
      amount_in: this.operation.amount_in,
      amount_out: this.operation.amount_out,
      currency_in: this.operation.currency_in,
      currency_out: this.operation.currency_out,
      price_in: '',
      wallet: '',
      price_out: (this.operation.amount_in / this.operation.amount_out).toString(),
      provider: this.provider.id.toString(),
      network: this.token.network,
      operation_id: this.operation.operation_id,
      created_at: this.operation.created_at,
    };
    this.storageOperationService.updateData(data);
  }

  openScan() {
    if (this.operation.status === 'complete') {
      const url = ScanUrlOf.create(this.operation.tx_hash, this.operation.network).value();
      this.browserService.open({ url });
    }
  }
}
