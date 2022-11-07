import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LINKS } from 'src/app/config/static-links';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';

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
                  >{{ this.operation.amount_out | formattedAmount }} {{ this.operation.currency_out | uppercase }}</ion-text
                >
              </div>
              <div class="kod__card-container__card__amount__in">
                <ion-text class="ux-font-text-xs"
                  >= {{ this.operation.amount_in | number: '1.2-2' }} {{ this.operation.currency_in | uppercase }}</ion-text
                >
              </div>
            </div>
          </ion-item>

          <ion-item class="kod__card-container__card__state ion-no-margin ion-no-padding">
            <div class="kod__card-container__card__state__container">
              <div class="kod__card-container__card__state__container__title">
                <ion-text class="ux-font-titulo-xs">
                  {{ 'fiat_ramps.kripton_operation_detail.state' | translate }}
                </ion-text>
                <ion-icon name="information-circle" (click)="this.showStateInformation()" color="info"></ion-icon>
              </div>
              <app-operation-status-chip [statusName]="this.operation.status"></app-operation-status-chip>
              <app-operation-status-alert *ngIf="this.operation.status !== 'received' && this.operation.status !== 'complete'" [operationStatus]="this.operation.status"></app-operation-status-alert>
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
                  {{ this.operation.amount_in / this.operation.amount_out | number: '1.2-2' }}
                  {{ this.operation.currency_in | uppercase }}
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
                    {{ this.operation.created_at | date: 'dd/MM/YYYY' }}
                  </ion-text>
                </div>
              </div>
              <div class="kod__card-container__card__date__container__hour">
                <div class="kod__card-container__card__date__container__hour__content">
                  <ion-text class="ux-font-text-base">
                    {{ this.operation.created_at | date: 'HH:mm'
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
export class KriptonOperationDetailPage implements OnInit {
  provider: FiatRampProvider;
  operation: FiatRampOperation;
  token: Coin;

  constructor(
    private browserService: BrowserService,
    private route: ActivatedRoute,
    private providersFactory: ProvidersFactory,
    private fiatRampsService: FiatRampsService,
    private apiWalletService: ApiWalletService,
    private navController: NavController,
    private trackService: TrackService,
  ) {}

  ngOnInit() {}

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

  showStateInformation() {
    return;
  }

  private getUserOperation(operationId: string) {
    this.fiatRampsService.setProvider(this.provider.id.toString());
    this.fiatRampsService.getUserSingleOperation(operationId).subscribe({
      next: (data) => {
        this.operation = data[0];
        this.getCoin();
      },
      error: () => {
        this.navigateBackToOperations();
      },
    });
  }

  getCoin() {
    this.token = this.apiWalletService.getCoin(this.operation.currency_out);
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

}
