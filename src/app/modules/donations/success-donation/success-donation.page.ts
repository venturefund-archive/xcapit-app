import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { TrackService } from 'src/app/shared/services/track/track.service';

@Component({
  selector: 'app-success-donation',
  template:`
   <ion-content class="ion-padding">
      <app-success-content [data]="this.data"></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./success-donation.page.scss'],
})
export class SuccessDonationPage implements OnInit {
  data = SUCCESS_TYPES.success_donation;
  constructor(private trackService : TrackService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_donations_screenview_success'
    });
  }

}
