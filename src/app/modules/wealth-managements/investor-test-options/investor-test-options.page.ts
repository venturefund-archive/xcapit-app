import { Component, OnInit } from '@angular/core';
import { INVESTOR_TEST_OPTIONS } from '../shared-wealth-managements/constants/test-options';

@Component({
  selector: 'app-investor-test-options',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ito__toolbar ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/investments/binance"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'wealth_managements.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="content ion-padding">
      <div class="ito ux_main">
        <div class="ux_content">
          <div class="ito__contain_image">
            <img class="ito__image" src="../assets/img/investor-test/investor-options.svg" alt="" />
          </div>
          <div class="ito__title_and_subtitle">
            <ion-text class="ito__title ux-font-text-lg">
              {{ 'wealth_managements.title' | translate }}
            </ion-text>
            <ion-text class="ito__subtitle ux-font-text-base">
              {{ 'wealth_managements.subtitle' | translate }}
            </ion-text>
          </div>
          <div class="ito__options">
            <app-test-option-item *ngFor="let option of this.options" [option]="option"></app-test-option-item>
          </div>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./investor-test-options.page.scss'],
})
export class InvestorTestOptionsPage implements OnInit {
  options = INVESTOR_TEST_OPTIONS;
  constructor() {}

  ngOnInit() {}
}
