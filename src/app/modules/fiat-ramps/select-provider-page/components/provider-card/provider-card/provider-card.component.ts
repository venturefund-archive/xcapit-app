import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { InfoProviderComponent } from 'src/app/modules/fiat-ramps/shared-ramps/components/info-provider/info-provider.component';
import { INFO_PROVIDER } from 'src/app/modules/fiat-ramps/shared-ramps/constants/info-provider';
import { FiatRampProvider } from 'src/app/modules/fiat-ramps/shared-ramps/interfaces/fiat-ramp-provider.interface';
@Component({
  selector: 'app-provider-card',
  template: `
    <div class="pcc ux-card ion-padding" [ngClass]="{ pcc: !this.disabled, 'card-off': this.disabled }">
      <div class="pcc__content">
        <div class="pcc__content__image">
          <img [src]="this.provider?.logoRoute" alt="Provider Logo" />
        </div>
        <div class="pcc__content__body">
          <div class="pcc__content__body__name">
            <ion-text class="ux-font-text-lg name" color="neutral90"> {{ this.provider?.name }}</ion-text>
            <ion-button
              class="pcc__content__body__name__button ion-no-padding"
              
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
            <ion-text class="ux-font-text-xxs description" color="neutral80">{{
              this.provider?.description | translate
            }}</ion-text>
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
  @Output() selectedProvider: EventEmitter<any> = new EventEmitter<any>();
  isInfoModalOpen = false;
  providerInfo: any;

  constructor(private modalController: ModalController, private translate: TranslateService) {}

  sendProviderData(provider: FiatRampProvider) {
    this.selectedProvider.emit(provider);
  }

  async createInfoModal() {
    this.providerInfo = INFO_PROVIDER[this.provider.providerName]
    const modal = await this.modalController.create({
      component: InfoProviderComponent,
      componentProps: {
        image: this.provider?.logoRoute,
        title: this.provider?.name,
        subtitle1:this.providerInfo.subtitle_1,
        subtitle2:this.providerInfo.subtitle_2,
        subtitle3: this.providerInfo.subtitle_3,
        description1: this.providerInfo.description_1,
        description2:this.providerInfo.description_2,
        description3:this.providerInfo.description_3,
        disclaimer:this.providerInfo.disclaimer,
        buttonText: 'fiat_ramps.select_provider.modal_info.button',
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
