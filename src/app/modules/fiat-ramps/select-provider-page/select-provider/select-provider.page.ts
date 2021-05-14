import { Component } from '@angular/core';
import { PROVIDERS } from '../../shared-ramps/constants/providers';
@Component({
  selector: 'app-select-provider',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center"> {{ 'fiat_ramps.select_provider.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="sp__title">
          <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22">
            {{ 'fiat_ramps.select_provider.title' | translate }}
          </ion-text>
        </div>
        <div class="ux_content">
          <div>
            <ion-list>
              <app-provider-card *ngFor="let provider of providers" [provider]="provider"> </app-provider-card>
            </ion-list>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./select-provider.page.scss'],
})
export class SelectProviderPage {
  providers = PROVIDERS;

  constructor() {}
}
