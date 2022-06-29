import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { TrackService } from 'src/app/shared/services/track/track.service';

@Component({
  selector: 'app-error-test',
  template: `<ion-content class="ion-padding">
  <app-success-content *ngIf="this.data" [data]="this.data"></app-success-content>
</ion-content>`,
  styleUrls: ['./error-test.page.scss'],
})
export class ErrorTestPage implements OnInit {
  data = SUCCESS_TYPES.error_test_financial_education;
  constructor(private trackService : TrackService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.trackScreenView();
  }

  trackScreenView(){
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_education_screenview_retry'
    });
  }

}
