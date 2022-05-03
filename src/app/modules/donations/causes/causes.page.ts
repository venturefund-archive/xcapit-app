import { Component, OnInit } from '@angular/core';
import { CAUSES } from '../shared-donations/constants/causes';

@Component({
  selector: 'app-causes',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'donations.causes.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="cp__title">
        <ion-text class="ux-font-text-lg">
          {{ 'Elige una causa' | translate }}
        </ion-text>
      </div>
      <div>
        <app-cause *ngFor="let cause of this.causes" [cause]="cause"></app-cause>
      </div>
    </ion-content>
  `,

  styleUrls: ['./causes.page.scss'],
})
export class CausesPage implements OnInit {
  causes = CAUSES;
  constructor() {}

  ngOnInit() {}
}
