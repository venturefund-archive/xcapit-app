import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wallets-agenda-home',
  template: `<ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref=""></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'profiles.wallets_agenda.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="wa">
      <div class="wa__content">
        <img class="wa__content__img" src="/assets/img/profiles/wallets-agenda/empty.svg" />
        <div class="wa__content__text">
          <ion-text class="ux-font-text-xs wa__content__text__title">Aún no posees wallets en tu agenda.</ion-text>
          <ion-text class="ux-font-text-xs wa__content__text__subtitle">¡Comienza ahora!</ion-text>
        </div>
      </div>
    </ion-content>
    <ion-footer>
      <div class="ion-padding">
        <ion-button class="ux_button" appTrackClick name="ux_donations_donate" color="secondary" expand="block">
          Agendar nueva wallet
        </ion-button>
      </div>
    </ion-footer>`,
  styleUrls: ['./wallets-agenda-home.page.scss'],
})
export class WalletsAgendaHomePage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
