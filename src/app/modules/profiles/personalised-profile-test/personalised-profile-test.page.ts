import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personalised-profile-test',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__left">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="" name="back"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'wealth_managements.investor_test.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ppt ion-padding">
      <div class="ppt__question ux-font-text-lg">
        <ion-text>1. ¿Qué deseas hacer dentro de Xcapit? Elige todas las opciones que consideres</ion-text>
      </div>
      <div class="ppt_answers">
      <!-- <ion-item lines="none">
            <div class="item">
              <app-ux-checkbox
                class="medium"
                ngClass="checkbox"
                controlName="providerAccepted"
                slot="start"
              ></app-ux-checkbox>
            </div>
            <div class="text">
              <app-ux-text class="ip_text">
                {{ 'fiat_ramps.information_paxful.recordatory_2' | translate }}
              </app-ux-text>
            </div>
          </ion-item> -->
      </div>
    </ion-content>
  `,
  styleUrls: ['./personalised-profile-test.page.scss'],
})
export class PersonalisedProfileTestPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
