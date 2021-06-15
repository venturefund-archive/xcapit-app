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
        <ion-title class="ion-text-center "> {{ 'payment.licenses.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="title">
          <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22">
            {{ 'payment.licenses.title' | translate }}
          </ion-text>
        </div>
        <ion-text class="subtitle ux-font-roboto ux-fweight-regular ux-fsize-14">
          {{ 'payment.licenses.textPrimary' | translate }}
        </ion-text>
        <ion-text class="second-subtitle ux-font-roboto ux-fsize-14">
          {{ 'payment.licenses.textSecondary' | translate }}
        </ion-text>
        <div class="license_type">
          <ion-button
            [ngClass]="{ active: activeButtonAnnual }"
            class="license_type__anual_button ux-font-roboto ux-fweight-regular ux-fsize-14"
            name="anual"
            appTrackClick
            fill="clear"
            size="small"
            (click)="this.changeToAnnual()"
            >{{ 'payment.licenses.btnAnnual' | translate }}</ion-button
          >
          <ion-button
            [ngClass]="{ active: activeButtonMonthly }"
            class="license_type__mensual_button ux-font-roboto ux-fweight-regular ux-fsize-14"
            name="mensual"
            appTrackClick
            fill="clear"
            size="small"
            (click)="this.changeToMonthly()"
            >{{ 'payment.licenses.btnMonthly' | translate }}</ion-button
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
  stateAnnual: string;
  activeButtonAnnual: boolean = true;
  stateMonthly: string;
  activeButtonMonthly: boolean = true;

  constructor() {}

  ionViewWillEnter() {
    this.changeToAnnual();
  }

  ngOnInit() {}

  changeToAnnual() {
    this.licenses = LICENSES;
    const anualLicenses = this.licenses.filter(
      (licenses) => licenses.state === 'payment.licenses.annual' || licenses.state === ''
    );
    this.licenses = anualLicenses;
    this.activatedBtnAnnual();
  }

  changeToMonthly() {
    this.licenses = LICENSES;
    const mensualLicenses = this.licenses.filter(
      (licenses) => licenses.state === 'payment.licenses.monthly' || licenses.state === ''
    );
    this.licenses = mensualLicenses;
    this.activatedBtnMonthly();
  }

  activatedBtnAnnual() {
    this.activeButtonAnnual = true;
    this.stateAnnual = 'active';
    this.activeButtonMonthly = false;
    this.stateMonthly = '';
  }

  activatedBtnMonthly() {
    this.activeButtonMonthly = true;
    this.stateMonthly = 'active';
    this.activeButtonAnnual = false;
    this.stateAnnual = '';
  }
}
