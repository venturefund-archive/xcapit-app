import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { TrackService } from 'src/app/shared/services/track/track.service';

@Component({
  selector: 'app-error-donation',
  template:`
   <ion-content class="ion-padding">
      <app-success-content *ngIf="this.data" [data]="this.data"></app-success-content>
   </ion-content>`,
  styleUrls: ['./error-donation.page.scss'],
})
export class ErrorDonationPage implements OnInit {
  data = SUCCESS_TYPES.error_donation;
  constructor(private trackService : TrackService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_donations_screenview_error'
    });
  }
}
