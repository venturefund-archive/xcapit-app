import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LINKS } from 'src/app/config/static-links';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';

@Component({
  selector: 'app-info-provider-kripton',
  template: `
    <div class="modal-content">
      <div class="main">
        <div class="main__close_button">
          <ion-button
            class="ion-no-padding"
            slot="icon-only"
            fill="clear"
            name="Close"
            appTrackClick
            (click)="this.close()"
          >
            <ion-icon class="main__close_button__icon" name="ux-close"></ion-icon>
          </ion-button>
        </div>
        <div class="main__body">
          <div class="main__body__content">
            <div class="main__body__content__img">
              <img src="assets/img/provider-logos/KriptonMarket.svg" />
            </div>
            <div class="main__body__content__title">
              <ion-text class="ux-font-text-xl"
                >{{ 'fiat_ramps.select_provider.modal_info.kripton.provider_name' | translate }}
              </ion-text>
            </div>
            <div class="ux-text-base main__body__content__header">
              <ion-text>{{ 'fiat_ramps.select_provider.modal_info.kripton.header' | translate }}</ion-text>
              <br />
              <ion-text>{{ 'fiat_ramps.select_provider.modal_info.kyc_required' | translate }}</ion-text>
            </div>
            <div class="ux-font-header-titulo main__body__content__subtitle">
              <ion-text>{{ 'fiat_ramps.select_provider.modal_info.subtitle_delivery_time' | translate }}</ion-text>
            </div>
            <div class="main__body__content__description">
              <ul>
                <li>
                  <ion-text class="ux-font-text-base">
                    {{ 'fiat_ramps.select_provider.modal_info.kripton.delivery_time_1' | translate }}
                  </ion-text>
                </li>
                <li>
                  <ion-text class="ux-font-text-base">
                    {{ 'fiat_ramps.select_provider.modal_info.kripton.delivery_time_2' | translate }}
                  </ion-text>
                </li>
              </ul>
            </div>
            <div class="ux-font-header-titulo main__body__content__subtitle">
              <ion-text>{{ 'fiat_ramps.select_provider.modal_info.subtitle_more_information' | translate }}</ion-text>
            </div>
            <div class="main__body__content__link">
              <ion-icon name="globe-outline" color="info"></ion-icon>
              <ion-text name="Go To Kripton" class="ux-link-xs" (click)="this.navigateToKripton()">
                {{ 'fiat_ramps.select_provider.modal_info.kripton.more_information' | translate }}
              </ion-text>
            </div>
            <div class="main__actions">
              <ion-button
                class="ux_button main__actions__button ion-no-margin"
                name="Understood"
                color="secondary"
                size="large"
                (click)="this.close()"
              >
                {{ 'fiat_ramps.select_provider.modal_info.button' | translate }}
              </ion-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./info-provider-kripton.component.scss'],
})
export class InfoProviderKriptonComponent {
  constructor(private modalController: ModalController, private browserService: BrowserService) {}

  close() {
    this.modalController.dismiss();
  }

  async navigateToKripton() {
    await this.browserService.open({ url: LINKS.kriptonPage });
  }
}
