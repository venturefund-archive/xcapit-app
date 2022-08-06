import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { TrackService } from 'src/app/shared/services/track/track.service';

@Component({
  selector: 'app-success-profile-test',
  template: ` <ion-content class="ion-padding">
  <app-success-content [data]="this.data"></app-success-content>
</ion-content>`,
  styleUrls: ['./success-profile-test.page.scss'],
})
export class SuccessProfileTestPage implements OnInit {
  data: any;

  constructor(private trackService : TrackService) { }

  ngOnInit() {
    this.data = SUCCESS_TYPES.success_profile_test;
  }

  ionViewWillEnter() {
    this.trackScreenView();
   }
 
   trackScreenView(){
     this.trackService.trackEvent({
       eventAction: 'screenview',
       description: window.location.href,
       eventLabel: 'ux_profile_test_complete'
     });
   }

}
