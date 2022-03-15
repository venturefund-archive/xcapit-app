import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-referrals-info',
  template: ` <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="referrals/list"></ion-back-button>
        </ion-buttons>
        <ion-title> {{ 'referrals.referrals_info.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="ux_main">
        <div class="ux_content">
          <div class="info">
            <ion-text class="title ux-font-num-subtitulo">{{
              'referrals.referrals_info.info_title1' | translate
            }}</ion-text>
            <ion-text class="description ux-font-text-xs semibold">{{
              'referrals.referrals_info.info_description1' | translate
            }}</ion-text>
          </div>
          <div class="info">
            <ion-text class="title ux-font-num-subtitulo">{{
              'referrals.referrals_info.info_title2' | translate
            }}</ion-text>
            <ion-text class="description ux-font-text-base">{{
              'referrals.referrals_info.info_description2' | translate
            }}</ion-text>
          </div>
          <div class="info">
            <ion-text class="title ux-font-num-subtitulo">{{
              'referrals.referrals_info.info_title3' | translate
            }}</ion-text>
            <ion-text class="description ux-font-text-base">{{
              'referrals.referrals_info.info_description3' | translate
            }}</ion-text>
          </div>
          <div class="info">
            <ion-text class="title ux-font-num-subtitulo">{{
              'referrals.referrals_info.info_title4' | translate
            }}</ion-text>
            <ion-text class="description ux-font-text-base">{{
              'referrals.referrals_info.info_description4' | translate
            }}</ion-text>
          </div>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./referrals-info.page.scss'],
})
export class ReferralsInfoPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
