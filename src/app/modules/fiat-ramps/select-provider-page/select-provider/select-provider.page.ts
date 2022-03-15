import { Component } from '@angular/core';
import { PROVIDERS } from '../../shared-ramps/constants/providers';
@Component({
  selector: 'app-select-provider',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ 'fiat_ramps.select_provider.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="sp__title">
          <ion-text class="ux-font-text-xl">
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
