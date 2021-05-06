import { Component } from '@angular/core';
@Component({
  selector: 'app-select-provider',
  template: `
  <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">
          {{ 'fiat_ramps.select_provider.header' | translate }}</ion-title
        >
      </ion-toolbar>
  </ion-header>
    <ion-content class="ion-padding-top">
          <div class="ux_main"> 
              <div class="sp__title">
                <ion-text
                  class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22"
                >
                  {{ 'fiat_ramps.select_provider.title' | translate }}
                </ion-text>
              </div>
              <div class="ux_content">
                <div>
                        <ion-list>
                            <app-provider-card
                                    *ngFor="let provider of providers"
                                    [provider]="provider"      
                            >
                            </app-provider-card>
                        </ion-list>
                </div> 
              </div>
          </div>
    </ion-content>
  `,
  styleUrls: ['./select-provider.page.scss'],
})
export class SelectProviderPage {
  providers = [
    {
      id: 1,
      name: "KriptonMarket",
      img: "../../assets/img/providers/id1.svg",
      route: "/fiat-ramps/new-operation"
    },

    {
      id: 2,
      name: "Paxful",
      img: "../../assets/img/providers/id2.svg",
      route:"/tabs/funds"
    }
  ];

  constructor() { }
  
}
