import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { InfoProviderComponent } from 'src/app/modules/fiat-ramps/shared-ramps/components/info-provider/info-provider.component';
import { FiatRampProvider } from 'src/app/modules/fiat-ramps/shared-ramps/interfaces/fiat-ramp-provider.interface';
@Component({
  selector: 'app-provider-card',
  template: `
    <div class="pcc ux-card ion-padding" [ngClass]="{ pcc: !this.disabled, 'card-off': this.disabled }">
      <ion-badge *ngIf="this.provider.isBestQuote" class="pcc__badge ux-font-num-subtitulo">{{
        'fiat_ramps.select_provider.best_quote' | translate
      }}</ion-badge>
      <div class="pcc__content">
        <div class="pcc__content__image">
          <img [src]="this.provider?.logoRoute" alt="Provider Logo" />
        </div>
        <div class="pcc__content__body">
          <div class="pcc__content__body__name">
            <ion-text class="ux-font-text-lg name" color="neutral90"> {{ this.provider?.name }}</ion-text>
            <ion-button
              class="pcc__content__body__name__button ion-no-padding"
              *ngIf="this.provider?.showInfo"
              [disabled]="this.disabled"
              slot="icon-only"
              fill="clear"
              appTrackClick
              name="informative_modal"
              size="small"
              (click)="this.showProviderInfo()"
            >
              <ion-icon name="ux-info-circle-outline" color="info"></ion-icon>
            </ion-button>
          </div>
          <div class="pcc__content__body__description">
            <ion-text *ngIf="this.provider.quote || this.provider.usdQuote" class="ux-font-text-xxs description" color="neutral80">{{
              'fiat_ramps.select_provider.description'
                | translate
                  : {
                      providerName: this.provider.name,
                      token: this.tokenValue,
                      quote: this.provider.quote ? (this.provider.quote | formattedAmount: 10:2) : (this.provider.usdQuote | formattedAmount: 10:2),
                      fiatCode: this.fiatCode
                    }
            }}</ion-text>
            <ion-skeleton-text *ngIf="!this.provider.quote && !this.provider.usdQuote" width="100%" animated></ion-skeleton-text>
          </div>
        </div>
        <div class="pcc__content__radio">
          <ion-radio
            mode="md"
            slot="end"
            checked="true"
            name="ux_buy_moonpay"
            (click)="this.sendProviderData(this.provider)"
            [disabled]="this.disabled"
            [value]="this.provider"
            appTrackClick
            [dataToTrack]="{ eventLabel: this.provider.trackClickEventName }"
          ></ion-radio>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./provider-card.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class ProviderCardComponent {
  @Input() provider: FiatRampProvider;
  @Input() disabled: boolean;
  @Input() fiatCode: string;
  @Input() tokenValue: string;
  @Output() selectedProvider: EventEmitter<any> = new EventEmitter<any>();
  isInfoModalOpen = false;

  constructor(private modalController: ModalController, private translate: TranslateService) {}

  sendProviderData(provider: FiatRampProvider) {
    this.selectedProvider.emit(provider);
  }

  async createInfoModal() {
    const modal = await this.modalController.create({
      component: InfoProviderComponent,
      componentProps: {
        image: this.provider?.logoRoute,
        title: this.provider?.name,
        subtitle1: this.translate.instant('fiat_ramps.select_provider.modal_info.subtitle_1'),
        subtitle2:
          this.provider.providerName === 'kripton'
            ? this.translate.instant('fiat_ramps.select_provider.modal_info.subtitle_3')
            : '',
        subtitle3: this.translate.instant('fiat_ramps.select_provider.modal_info.subtitle_2'),

        description1: this.translate.instant(
          `fiat_ramps.select_provider.modal_info.${this.provider.providerName}.description_1`
        ),
        description2:
          this.provider.providerName === 'kripton'
            ? this.translate.instant(
                `fiat_ramps.select_provider.modal_info.${this.provider.providerName}.description_3`
              )
            : '',
        description3: this.translate.instant(
          `fiat_ramps.select_provider.modal_info.${this.provider.providerName}.description_2`
        ),

        disclaimer:
          this.provider.providerName === 'moonpay'
            ? this.translate.instant('fiat_ramps.select_provider.modal_info.moonpay.disclaimer')
            : '',
        buttonText: this.translate.instant('fiat_ramps.select_provider.modal_info.button'),
      },
      cssClass: 'modal',
      backdropDismiss: false,
    });
    await modal.present();
  }

  async showProviderInfo() {
    if (!this.isInfoModalOpen) {
      this.isInfoModalOpen = true;
      await this.createInfoModal();
      this.isInfoModalOpen = false;
    }
  }
}
