import { Component, OnInit } from '@angular/core';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { CAUSES } from '../shared-donations/constants/causes';

@Component({
  selector: 'app-causes',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="donations/information"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'donations.causes.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="cp__title">
        <ion-text class="ux-font-text-lg">
          {{ 'donations.causes.title' | translate }}
        </ion-text>
      </div>
      <div class="cp__causes">
        <app-cause *ngFor="let cause of this.causes" [cause]="cause"></app-cause>
      </div>
    </ion-content>
  `,

  styleUrls: ['./causes.page.scss'],
})
export class CausesPage implements OnInit {
  causes = structuredClone(CAUSES);
  constructor(private trackService: TrackService) {}

  ionViewWillEnter() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_donations_screenview_causes'
    });
  }

  ngOnInit() {}
}
