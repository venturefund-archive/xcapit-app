import { Component, OnInit } from '@angular/core';
import { TrackService } from 'src/app/shared/services/track/track.service';

@Component({
  selector: 'app-warranty-summary',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar ux_toolbar__rounded">
        <ion-buttons slot="start">
          <ion-back-button appTrackClick name="ux_nav_go_back" (click)="back()" defaultHref=""></ion-back-button>
        </ion-buttons>
        <ion-title class="ws__header">{{ 'Confeccionar garantia' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ws ion-padding">
      <div class="ws__transaction-summary-card" *ngIf="this.warrantyData">
        <app-warranty-summary-card
          [title]="'Datos de tu depósito' | translate"
          [documentTitle]="'DNI Garante' | translate"
          [amountTitle]="'Monto de garantia' | translate"
          [warrantyData]="this.warrantyData"
          [serviceCost]="'Costo de servicio' | translate"
        ></app-warranty-summary-card>
      </div>
    </ion-content>
    <ion-footer class="ws__footer">
      <div class="ws__footer__submit-button ion-padding">
      <ion-button
        class="ux_button"
        color="secondary"
        appTrackClick
        name="ux_warranty_start_confirm"
        (click)="this.handleSubmit()"
        >{{ 'Confeccionar garantia' | translate }}</ion-button
      >
      </div>
    </ion-footer>
  `,
  styleUrls: ['./warranty-summary.page.scss'],
})
export class WarrantySummaryPage implements OnInit {
  warrantyData = {
    amount: 1,
    quoteAmount: 2,
    document: 37987452,
    serviceCost: 0.3
  };
  constructor(private trackService: TrackService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_warranty_start_confirm_screenview',
    });
  }

  back() {}
  handleSubmit() {}
}
