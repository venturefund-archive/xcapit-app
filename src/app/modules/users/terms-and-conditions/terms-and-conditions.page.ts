import { Component, OnInit } from '@angular/core';
import { TYC_ITEMS } from '../shared-users/constant/tyc-items';

@Component({
  selector: 'app-terms-and-conditions',
  template: `<ion-header>
  <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
    <ion-buttons slot="start">
      <ion-back-button defaultHref="" (click)="this.back()"></ion-back-button>
    </ion-buttons>
    <ion-title>{{ 'profiles.user_profile_menu.terms_and_conditions' | translate }}</ion-title>
  </ion-toolbar>
</ion-header>
<ion-content class="ur__container">
<app-tyc-items-cars *ngFor="let item of this.items"
[items]="this.item">

</app-tyc-items-cars>
<div>
  <ion-text></ion-text>
</div>
<!-- <app-tyc-items-cars *ngFor="let item of this.items"
[items]="this.item">

</app-tyc-items-cars> -->
</ion-content>
  `,
  styleUrls: ['./terms-and-conditions.page.scss'],
})
export class TermsAndConditionsPage implements OnInit {
  items = structuredClone(TYC_ITEMS)

  constructor() { }

  ngOnInit() {
  }

  back(){

  }
}
