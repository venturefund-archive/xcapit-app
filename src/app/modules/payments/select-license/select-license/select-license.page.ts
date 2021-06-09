import { Component, OnInit } from '@angular/core';
import { LICENSES } from '../constants/license';

@Component({
  selector: 'app-select-license',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center"> {{ 'Pagos anual' }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="title">
          <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22">
            {{ 'Elige tu plan' }}
          </ion-text>
        </div>
        <ion-text class="subtitle ux-font-gilroy ux-fweight-regular ux-fsize-14">
          {{ '¡Prueba 30 días gratis todos los planes!' }}
        </ion-text>
        <ion-text class="second-subtitle ux-font-gilroy ux-fsize-14">
          {{ 'Puedes cancelar cuando quieras' }}
        </ion-text>
        <div class="license_type">
          <ion-button
            class="license_type__anual_button"
            name="anual"
            appTrackClick
            fill="clear"
            size="small"
            (click)="this.changeToAnual()"
            >Planes Anuales</ion-button
          >
          <ion-button
            class="license_type__mensual_button"
            name="mensual"
            appTrackClick
            fill="clear"
            size="small"
            (click)="this.changeToMensual()"
            >Planes Mensuales</ion-button
          >
        </div>
        <div class="ux_content">
          <div>
            <ion-list>
              <app-item-license *ngFor="let license of licenses" [license]="license"></app-item-license>
            </ion-list>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./select-license.page.scss'],
})
export class SelectLicensePage implements OnInit {
  licenses = LICENSES;
  mensualLicenses;
  anualLicenses;
  constructor() {}

  ionViewWillEnter() {
    this.changeToAnual();
  }

  ngOnInit() {}

  changeToAnual() {
    this.licenses = LICENSES;
    const anualLicenses = this.licenses.filter((licenses) => licenses.state === 'anual' || licenses.state === '');
    this.licenses = anualLicenses;
  }
  changeToMensual() {
    this.licenses = LICENSES;
    const mensualLicenses = this.licenses.filter((licenses) => licenses.state === 'mensual' || licenses.state === '');
    this.licenses = mensualLicenses;
  }
}
